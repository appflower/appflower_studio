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
      error_reporting(0);
      $form->port = empty($form->port)?'3306':$form->port;
      $conn = new mysqli($form->host, $form->username, $form->password,$form->database,$form->port);
      
      if (mysqli_connect_errno()) {
          $error = mysqli_connect_error();
          //print_r($error);
          if(substr_count($error,'Access denied for user')>0)
          {
            $this->result['success'] = false;
            $this->result['fields'][] = array('fieldName'=>'infor','error'=>'Cannot connect to database server using the provided username and/or password');
            $this->result['fields'][] = array('fieldName'=>'username','error'=>'Username and/or password does not math');
            $this->result['fields'][] = array('fieldName'=>'password','error'=>'Username and/or password does not math');
          }
          elseif(substr_count($error,'Unknown MySQL server host')>0)
          {
            $this->result['success'] = false;
            $this->result['fields'][] = array('fieldName'=>'infor','error'=>'Cannot connect to database server using the provided host and/or port');
            $this->result['fields'][] = array('fieldName'=>'host','error'=>'Host and/or port does not math');
            $this->result['fields'][] = array('fieldName'=>'port','error'=>'Host and/or port does not math');
          }
          elseif(substr_count($error,'Unknown database')>0)
          {
            $this->result['success'] = true;
            $this->result['databaseExist']= false;
          }
      }
      else {
        $this->result['success'] = true;
        $this->result['databaseExist']= true;
      }
  }
}
?>
