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
		
		if(file_exists($projectYmlPath))
		{
			$sfYaml = new sfYaml();
        	$projectYmlData = $sfYaml->load($projectYmlPath);
        	
        	$this->result = array_merge(array('success'=>true, 'title'=>'Success', 'message'=>'The selected path contains a valid project. <br>You will now be redirected to <b>'.$projectYmlData['project']['url'].'</b>'),$projectYmlData);
		}
		else		
		$this->result = array('success' => false, 'title'=>'Failure', 'message'=> 'The selected path doesn\'t contain any AppFlower project!');
	}
}
?>
