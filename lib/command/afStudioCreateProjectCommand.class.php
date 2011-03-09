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
    	
    	$params = array_merge(ProjectConfigurationManager::$defaultProjectTemplate['project'],$params);
    	
    	//print_r($params);
    	
    	$this->result['success'] = true;
        $this->result['message'] = 'TO DO: generate new project with git clone or other tool..';		
	}
}
?>
