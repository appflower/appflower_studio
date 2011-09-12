<?php
/**
 * Create Project Command
 * 
 * @author radu
 */
class afStudioCreateProjectCommand extends afBaseStudioCommand
{
	public function processSave()
	{
		  $params = $this->params['request']->getPostParameters();
    	
    	$params['autodeploy'] = !isset($params['autodeploy'])?false:true;
    	$latest = !isset($params['latest'])?false:true;
    	$path = $params['path'];
    	unset($params['latest']);
    	unset($params['path']);
    	
    	$params = array_merge(ProjectConfigurationManager::$defaultProjectTemplate['project'],$params);
    	$unique = afStudioUtil::unique();
    	
    	file_put_contents('/tmp/project-'.$unique.'.yml', $this->dumpYaml(array('project'=>$params)));
    	   	
    	$console = afStudioConsole::getInstance()->execute('afsbatch create_project_structure.sh '.$path.' '.$latest.' /tmp/project-'.$unique.'.yml');
    	    	
    	if(is_readable($path.'/config/project.yml'))
    	{    	    	
      	$this->result['success'] = true;
        $this->result['message'] = 'Project created in path <b>'.$path.'</b> Please set up virtual host to connect to it!';
        $this->result['console'] = $console;
    	}
    	else {
    	  $this->result['success'] = false;
        $this->result['message'] = 'Project was not created in path <b>'.$path.'</b> due to some errors!';
        $this->result['console'] = $console;
    	}
	}
	
	private function dumpYaml($data)
  {
      $sfYaml = new sfYaml();
      $yamlData = $sfYaml->dump($data, 4);

      return $yamlData;
  }
  
  public function processCheckDatabase()
  {
      $params = $this->params['request']->getPostParameters();
      
      $form = json_decode($params['form']);
      
      //check database connection
      $form->port = empty($form->port)?'3306':$form->port;
      $dsn = 'mysql:dbname='.$form->database.';host='.$form->host.';port='.$form->port;      
      error_reporting(0);
      try {
          $conn = new PDO($dsn,$form->username,$form->password);
          
          $this->result['success'] = true;
          $this->result['databaseExist']= true;
      } catch (PDOException $e) {
          $error=$e->getMessage();
          
          if(substr_count($error,'Access denied for user')>0)
          {
            $this->result['success'] = false;
            $this->result['fields'][] = array('fieldName'=>'infor','error'=>'Cannot connect to database server using the provided username and/or password');
            $this->result['fields'][] = array('fieldName'=>'username','error'=>'Username and/or password does not match');
            $this->result['fields'][] = array('fieldName'=>'password','error'=>'Username and/or password does not match');
          }
          elseif(substr_count($error,'Unknown MySQL server host')>0||substr_count($error,'Can\'t connect to MySQL server')>0||substr_count($error,'is not allowed to connect to this MySQL')>0)
          {
            $this->result['success'] = false;
            $this->result['fields'][] = array('fieldName'=>'infor','error'=>'Cannot connect to database server using the provided host and/or port');
            $this->result['fields'][] = array('fieldName'=>'host','error'=>'Host and/or port does not match');
            $this->result['fields'][] = array('fieldName'=>'port','error'=>'Host and/or port does not match');
          }
          elseif(substr_count($error,'Unknown database')>0)
          {
            $this->result['success'] = true;
            $this->result['databaseExist']= false;
          }
      }
  }
  
  public function processSaveWizard()
	{
		  $params = $this->params['request']->getPostParameters();
		  
		  $userForm = json_decode($params['userForm']);
		  $databaseForm = json_decode($params['databaseForm']);
    	
		  $databaseExist = $params['databaseExist']?1:0;
		  
    	$project['name'] = $params['name'];    	
    	$project['template'] = $params['template'];
    	
    	$latest = false;
    	$path = $params['path'];
    	
    	$project = array_merge(ProjectConfigurationManager::$defaultProjectTemplate['project'],$project);
    	$unique = afStudioUtil::unique();
    	
    	file_put_contents('/tmp/project-'.$unique.'.yml', $this->dumpYaml(array('project'=>$project)));
    	
    	//create db configuration
    	$dcm = new DatabaseConfigurationManager('/tmp/databases-'.$unique.'.yml');
      $dcm->setDatabaseConnectionParams(array('database'=>$databaseForm->database, 'host'=>$databaseForm->host, 'port'=>$databaseForm->port, 'username'=>$databaseForm->username, 'password'=>$databaseForm->password));
      $dcm->save();
            
      //create user configuration
      afStudioUserHelper::createNewUserForCPW($userForm, '/tmp/users-'.$unique.'.yml');
    	   	
    	$console = afStudioConsole::getInstance()->execute('afsbatch create_project_structure.sh '.$path.' '.$latest.' /tmp/project-'.$unique.'.yml /tmp/databases-'.$unique.'.yml /tmp/users-'.$unique.'.yml '.$databaseExist.' '.$databaseForm->database.' '.$databaseForm->host.' '.$databaseForm->port.' '.$databaseForm->username.' '.$databaseForm->password);
        $this->result['console'] = $console;
    	    	
    	if(is_readable($path.'/config/project.yml'))
    	{
            try {
                $serverEnv = afStudioUtil::getServerEnvironment();
                $vhost = $serverEnv->createNewProjectVhost($params['slug'], $path.'/web');
                if ($vhost) {
                    $serverEnv->restartWebServer();
                    $projectURL = 'http://'.$_SERVER['SERVER_ADDR'].':'.$vhost->getPort();
                }
                
                $this->result['success'] = true;
                $this->result['message'] = 'Project created in path <b>'.$path.'</b>.<br />';
                $this->result['message'] .= "You can access it with this URL: <a href=\"$projectURL\">$projectURL</a>";
                
            } catch (ServerException $e) {
                if (sfConfig::get('sf_environment') == 'dev') {
                    throw $e;
                } else {
                    $this->result['success'] = false;
                    $this->result['message'] = 'Project was created in path <b>'.$path.'</b> but some errors occured while trying to configure Apache virtual host!';
                    $this->result['console'] .= '<li>ServerEnvironmentException: '.$e->getMessage().'</li>';
                }
            }
    	}
    	else {
    	    $this->result['success'] = false;
            $this->result['message'] = 'Project was not created in path <b>'.$path.'</b> due to some errors!';
    	}
	}
}
?>
