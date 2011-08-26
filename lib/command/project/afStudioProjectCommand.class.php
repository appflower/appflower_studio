<?php
/**
 * Studio Project Command Class
 * 
 * @author Radu Topala <radu@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioProjectCommand extends afBaseStudioCommand
{
    /**
     * Getting tree list
     * 
     * todo - rename to getTree, should be also renamed in frontend
     */
    protected function processGet()
    {
        $path = $this->getParameter('path');
        if ($path) {
            $path = str_replace('root/', '/', $path);
            $path = str_replace('root', '/', $path);
        }
        
        $files = sfFinder::type('any')->ignore_version_control()->maxdepth(0)->in($path);
        
        if (count($files) > 0) {
            foreach ($files as $file) {
                $this->result[] = array(
                    'text' => basename($file), 
                    'leaf' => (is_file($file) ? true : false)
                );
            }
            
            return $this->result;
            
        }
        
        return afResponseHelper::create()->success(true)->asArray();
    }
	
	/**
	 * Checking is valid path
	 */
    protected function processIsPathValid()
    {
        $path = $this->getParameter('path');
        if ($path) {
            $path = str_replace('root/', '/', $path);
            $path = str_replace('root', '/', $path);
        }
        
        $projectYmlPath = $projectPath . '/config/project.yml';
        $appFlowerPluginPath = $projectPath . '/plugins/appFlowerPlugin/';
        $appFlowerStudioPluginPath = $projectPath . '/plugins/appFlowerStudioPlugin/';
        
        if (file_exists($appFlowerPluginPath) && file_exists($appFlowerStudioPluginPath)) {
            $sfYaml = new sfYaml();
            $projectYmlData = $sfYaml->load($projectYmlPath);
            
            if (file_exists($projectYmlPath) && !empty($projectYmlData['project']['url'])) {
                $this->result = array_merge(array('success'=>true, 'title'=>'Success', 'message'=>'The selected path contains a valid project. <br>You will now be redirected to <b>'.$projectYmlData['project']['url'].'/studio</b>'),$projectYmlData);
            } else {
                $this->result = array('success'=>false, 'message'=> 'The selected path contains an AppFlower project, but the URL for the project is not set!');
            }
        } else {
            $this->result = array('success'=>false, 'message'=> 'The selected path doesn\'t contain any valid AppFlower project!');
        }
    }
    
    
    /**
     * Save project functionality
     */
    protected function processSave()
    {
        $params = $this->getParameter('params');
        
        $params['autodeploy'] = !isset($params['autodeploy']) ? false : true;
        $latest = !isset($params['latest']) ? false : true;
        $path = $params['path'];
        
        
        $params = array_merge(ProjectConfigurationManager::$defaultProjectTemplate['project'], $params);
        
        $unique = afStudioUtil::unique();
        
        file_put_contents('/tmp/project-'.$unique.'.yml', $this->dumpYaml(array('project'=>$params)));
   	    
        $console = afStudioConsole::getInstance()->execute('afsbatch create_project_structure.sh '.$path.' '.$latest.' /tmp/project-'.$unique.'.yml');
    	
        if (is_readable($path.'/config/project.yml')) {    	    	
            $this->result['success'] = true;
            $this->result['message'] = 'Project created in path <b>'.$path.'</b> Please set up virtual host to connect to it!';
            $this->result['console'] = $console;
        } else {
            $this->result['success'] = false;
            $this->result['message'] = 'Project was not created in path <b>'.$path.'</b> due to some errors!';
            $this->result['console'] = $console;
        }
        
    }
    
    /**
     * Check database functionality
     */
    protected function processCheckDatabase()
    {
        $form = json_decode($this->getParameter($form));
        
        //check database connection
        $form->port = empty($form->port) ? '3306' : $form->port;
        $dsn = "mysql:dbname={$form->database};host={$form->host};port={$form->port}";      
        
        error_reporting(0);
        
        try {
            $conn = new PDO($dsn, $form->username, $form->password);
            
            $this->result['success'] = true;
            $this->result['databaseExist']= true;
        } catch (PDOException $e) {
            $error=$e->getMessage();
            
            if(substr_count($error,'Access denied for user')>0) {
                $this->result['success'] = false;
                $this->result['fields'][] = array('fieldName'=>'infor','error'=>'Cannot connect to database server using the provided username and/or password');
                $this->result['fields'][] = array('fieldName'=>'username','error'=>'Username and/or password does not match');
                $this->result['fields'][] = array('fieldName'=>'password','error'=>'Username and/or password does not match');
            } elseif (substr_count($error,'Unknown MySQL server host')>0||substr_count($error,'Can\'t connect to MySQL server')>0||substr_count($error,'is not allowed to connect to this MySQL')>0) {
                $this->result['success'] = false;
                $this->result['fields'][] = array('fieldName'=>'infor','error'=>'Cannot connect to database server using the provided host and/or port');
                $this->result['fields'][] = array('fieldName'=>'host','error'=>'Host and/or port does not match');
                $this->result['fields'][] = array('fieldName'=>'port','error'=>'Host and/or port does not match');
            } elseif (substr_count($error,'Unknown database')>0) {
                $this->result['success'] = true;
                $this->result['databaseExist']= false;
            }
        }
    }
    
    /**
     * Save wizard processing
     */
    protected function processSaveWizard()
    {
        $userForm = json_decode($this->getParameter('userForm'));
        $databaseForm = json_decode($this->getParameter('databaseForm'));
        
        $databaseExist = $this->getParameter('databaseExist');
        $databaseExist = $databaseExist ? 1 : 0;
        
        $project['name'] = $this->getParameter('name');    	
        $project['template'] = $this->getParameter('template');
        
        $latest = true;
        $path = $params['path'];
        
        $project = array_merge(ProjectConfigurationManager::$defaultProjectTemplate['project'], $project);
        $unique = afStudioUtil::unique();
        
        file_put_contents('/tmp/project-'.$unique.'.yml', $this->dumpYaml(array('project'=>$project)));
        
        //create db configuration
        $dcm = new DatabaseConfigurationManager('/tmp/databases-'.$unique.'.yml');
        $dcm->setDatabaseConnectionParams(array('database'=>$databaseForm->database, 'host'=>$databaseForm->host, 'port'=>$databaseForm->port, 'username'=>$databaseForm->username, 'password'=>$databaseForm->password));
        $dcm->save();
        
        //create user configuration
        afStudioUserHelper::createNewUserForCPW($userForm, '/tmp/users-'.$unique.'.yml');
        
        $console = afStudioConsole::getInstance()->execute('afsbatch create_project_structure.sh '.$path.' '.$latest.' /tmp/project-'.$unique.'.yml /tmp/databases-'.$unique.'.yml /tmp/users-'.$unique.'.yml '.$databaseExist.' '.$databaseForm->database.' '.$databaseForm->host.' '.$databaseForm->port.' '.$databaseForm->username.' '.$databaseForm->password);
        
        if (is_readable($path.'/config/project.yml')) {    	    	
            $this->result['success'] = true;
            $this->result['message'] = 'Project created in path <b>'.$path.'</b> Please set up virtual host to connect to it!';
            $this->result['console'] = $console;
        } else {
            $this->result['success'] = false;
            $this->result['message'] = 'Project was not created in path <b>'.$path.'</b> due to some errors!';
            $this->result['console'] = $console;
        }
    }
    
    /**
     * Execute run controller
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processRun()
    {
        return afResponseHelper::create()->success(true)->console(afStudioProjectCommandHelper::processRun());
    }
    
    /**
     * Dump yaml
     *
     * @param array $data 
     * @return string
     */
    private function dumpYaml(array $data)
    {
        $sfYaml = new sfYaml();
        $yamlData = $sfYaml->dump($data, 4);
        
        return $yamlData;
    }
    
}
