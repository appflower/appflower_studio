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
}
?>
