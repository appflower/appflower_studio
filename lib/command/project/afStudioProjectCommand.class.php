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
     * @return afResponse
     */
    protected function processGet()
    {
        $path = $this->getParameter('path');
        if ($path) {
            $path = str_replace('root/', '/', $path);
            $path = str_replace('root', '/', $path);
        }
        
        $files = sfFinder::type('any')->ignore_version_control()->maxdepth(0)->in($path);
        
        $data = array();
        
        if (count($files) > 0) {
            foreach ($files as $file) {
                $data[] = array(
                    'text' => basename($file), 
                    'leaf' => (is_file($file) ? true : false)
                );
            }
        }
        
        return afResponseHelper::create()->success(true)->data(array(), $data, 0);
    }
	
	/**
	 * Checking is valid path
	 * 
	 * @return array
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
     * 
     * @return afResponse
     * @author Radu Topala
     * @author Sergey Startsev
     */
    protected function processSave()
    {
        $params = $this->getParameter('params');
        
        $params['autodeploy'] = !isset($params['autodeploy']) ? false : true;
        $latest = !isset($params['latest']) ? false : true;
        $path = $params['path'];
        
        
        $params = array_merge(ProjectConfigurationManager::$defaultProjectTemplate['project'], $params);
        
        $unique = afStudioUtil::unique();
        
        file_put_contents('/tmp/project-'.$unique.'.yml', sfYaml::dump(array('project' => $params), 4));
   	    
        $console = afStudioConsole::getInstance()->execute('afsbatch create_project_structure.sh '.$path.' '.$latest.' /tmp/project-'.$unique.'.yml');
    	
        if (is_readable($path.'/config/project.yml')) {
            return $response->success(true)->message('Project created in path <b>'.$path.'</b> Please set up virtual host to connect to it!')->console($console);
        }
        
        return $response->success(false)->message('Project was not created in path <b>'.$path.'</b> due to some errors!')->console($console);
    }
    
    /**
     * Check database functionality
     */
    protected function processCheckDatabase()
    {
        $response = afResponseHelper::create();
        
        $form = json_decode($this->getParameter('form'));
        
        //check database connection
        $form->port = empty($form->port) ? '3306' : $form->port;
        $dsn = "mysql:dbname={$form->database};host={$form->host};port={$form->port}";
        
        error_reporting(0);
        
        $data = array();
        
        try {
            $conn = new PDO($dsn, $form->username, $form->password);
            
            $response->success(true);
            $data['databaseExist']= true;
        } catch (PDOException $e) {
            $error = $e->getMessage();
            
            if (substr_count($error, 'Access denied for user') > 0) {
                $response->success(false);
                $data['fields'][] = array('fieldName' => 'infor', 'error' => 'Cannot connect to database server using the provided username and/or password');
                $data['fields'][] = array('fieldName' => 'username', 'error' => 'Username and/or password does not match');
                $data['fields'][] = array('fieldName' => 'password', 'error' => 'Username and/or password does not match');                
            } elseif (substr_count($error, 'Unknown MySQL server host') > 0 || substr_count($error, "Can't connect to MySQL server") > 0 || substr_count($error, 'is not allowed to connect to this MySQL') > 0) {
                $response->success(false);
                $data['fields'][] = array('fieldName'=>'infor','error'=>'Cannot connect to database server using the provided host and/or port');
                $data['fields'][] = array('fieldName'=>'host','error'=>'Host and/or port does not match');
                $data['fields'][] = array('fieldName'=>'port','error'=>'Host and/or port does not match');
            } elseif (substr_count($error, 'Unknown database') > 0) {
                $response->success(true);
                $data['databaseExist'] = false;
            }
        }
        
        return $response->data(array(), $data, 0);
    }
    
    /**
     * Save wizard processing
     * 
     * @return afResponse
     * @author Radu Topala
     * @author Sergey Startsev
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
        
        file_put_contents('/tmp/project-'.$unique.'.yml', sfYaml::dump(array('project'=>$project), 4));
        
        //create db configuration
        $dcm = new DatabaseConfigurationManager('/tmp/databases-'.$unique.'.yml');
        $dcm->setDatabaseConnectionParams(array('database'=>$databaseForm->database, 'host'=>$databaseForm->host, 'port'=>$databaseForm->port, 'username'=>$databaseForm->username, 'password'=>$databaseForm->password));
        $dcm->save();
        
        //create user configuration
        afStudioUserHelper::createNewUserForCPW($userForm, '/tmp/users-'.$unique.'.yml');
        
        $console = afStudioConsole::getInstance()->execute('afsbatch create_project_structure.sh '.$path.' '.$latest.' /tmp/project-'.$unique.'.yml /tmp/databases-'.$unique.'.yml /tmp/users-'.$unique.'.yml '.$databaseExist.' '.$databaseForm->database.' '.$databaseForm->host.' '.$databaseForm->port.' '.$databaseForm->username.' '.$databaseForm->password);
        
        $response = afResponseHelper::create();
        if (is_readable($path.'/config/project.yml')) {
            return $response->success(true)->message('Project created in path <b>'.$path.'</b> Please set up virtual host to connect to it!')->console($console);
        }
        
        return $response->success(false)->message('Project was not created in path <b>'.$path.'</b> due to some errors!')->console($console);
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
     * Export project functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processExport()
    {
        $by_os = $this->getParameter('by_os', 'false');
        $type = $this->getParameter('type', 'project');
        $path = $this->getParameter('path', "./data/export/{$type}");
        
        $console = afStudioConsole::getInstance();
        $console_result = $console->execute("sf afs:export --type={$type} --by_os={$by_os} --path={$path}");
        
        return afResponseHelper::create()->success($console->wasLastCommandSuccessfull())->console($console_result);
    }
    
}
