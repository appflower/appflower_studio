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
    	$params['latest'] = !isset($params['latest'])?false:true;
    	
    	$params = array_merge(ProjectConfigurationManager::$defaultProjectTemplate['project'],$params);
    	
    	$console = afStudioConsole::getInstance()->execute('afsbatch create_project_structure.sh '.$params['path'].' '.$params['latest']);
    	
    	$this->result['success'] = true;
        $this->result['message'] = 'Starting to get shape';
        $this->result['console'] = $console;
	}
}
?>
