<?php
/**
 * Load Project Tree Command
 * 
 * @author radu
 */
class afStudioTemplateSelectorCommand extends afBaseStudioCommand
{
	public function processUpdate()
	{
		if($this->params['request']->getParameterHolder()->has('template'))
		{
			$templateName = strtolower($this->params['request']->getParameterHolder()->get('template'));
		}
		
		$projectPath = sfConfig::get('sf_root_dir');
				
		$projectYmlPath = $projectPath . '/config/project.yml';
		$appFlowerPluginPath = $projectPath . '/plugins/appFlowerPlugin/';
		$appFlowerStudioPluginPath = $projectPath . '/plugins/appFlowerStudioPlugin/';
		
		$projectYml = sfYaml::load($projectYmlPath);
		$pluginTemplateYml = sfYaml::load(sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/config/template.yml');
		
		if(file_exists($appFlowerPluginPath)&&file_exists($appFlowerStudioPluginPath))
		{
			$projectYml['project']['template'] = in_array($templateName,$pluginTemplateYml['template']['types'])?$templateName:$pluginTemplateYml['template']['default'];
        		
      file_put_contents($projectYmlPath,sfYaml::dump($projectYml,4));
        	
      $this->result = array('success'=>true,'message'=>'Template was set to '.ucfirst($templateName));
		}
		else		
		$this->result = array('title'=>'Failure', 'message'=> 'The selected path doesn\'t contain any valid AppFlower project!');
	}
}
?>
