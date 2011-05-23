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
    	    	
    	$this->result['success'] = true;
      $this->result['message'] = 'Project created in path '.$path.'. Please set up virtual host to connect to it!';
      $this->result['console'] = $console;
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
}
?>
