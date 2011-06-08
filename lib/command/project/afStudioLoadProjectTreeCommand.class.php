<?php
/**
 * Load Project Tree Command
 * 
 * @author radu
 */
class afStudioLoadProjectTreeCommand extends afBaseStudioCommand
{
	public function processGet()
	{
		if($this->params['request']->getParameterHolder()->has('path'))
		{
			$path=str_replace('root/','/',$this->params['request']->getParameterHolder()->get('path'));
			$path=str_replace('root','/',$path);
		}
		$files = sfFinder::type('any')->ignore_version_control()->maxdepth(0)->in($path);
		 				
		if(count($files)>0)
		{
			foreach ($files as $file)
			{
				$this->result[]=array('text'=>basename($file),'leaf'=>(is_file($file)?true:false));
			}
		}
		else
		$this->result = array('success' => true);
	}
	
	public function processIsPathValid()
	{
		if($this->params['request']->getParameterHolder()->has('path'))
		{
			$projectPath=str_replace('root/','/',$this->params['request']->getParameterHolder()->get('path'));
			$projectPath=str_replace('root','/',$projectPath);
		}
				
		$projectYmlPath = $projectPath . '/config/project.yml';
		$appFlowerPluginPath = $projectPath . '/plugins/appFlowerPlugin/';
		$appFlowerStudioPluginPath = $projectPath . '/plugins/appFlowerStudioPlugin/';
		
		if(file_exists($appFlowerPluginPath)&&file_exists($appFlowerStudioPluginPath))
		{
			$sfYaml = new sfYaml();
        	$projectYmlData = $sfYaml->load($projectYmlPath);
        	
        	if(file_exists($projectYmlPath)&&!empty($projectYmlData['project']['url']))
        	{
        		$this->result = array_merge(array('success'=>true, 'title'=>'Success', 'message'=>'The selected path contains a valid project. <br>You will now be redirected to <b>'.$projectYmlData['project']['url'].'/studio</b>'),$projectYmlData);
        	}
        	else 
        	$this->result = array('success'=>false, 'message'=> 'The selected path contains an AppFlower project, but the URL for the project is not set!');
		}
		else		
		$this->result = array('success'=>false, 'message'=> 'The selected path doesn\'t contain any valid AppFlower project!');
	}
}
?>
