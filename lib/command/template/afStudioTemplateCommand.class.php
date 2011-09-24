<?php
/**
 * Load Project Tree Command class
 * 
 * @author Radu Topala <radu@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioTemplateCommand extends afBaseStudioCommand
{
    /**
     * Updating template
     *
     * @return afResponse
     * @author Radu Topala
     * @author Sergey Startsev
     */
    public function processUpdate()
    {
        $response = afResponseHelper::create();
        
        if (!$this->hasParameter('template')) return $response->success(false)->message("You should define template name");
        
        $templateName = strtolower($this->getParameter('template'));
        
        $projectPath = sfConfig::get('sf_root_dir');
        
        $projectYmlPath = $projectPath . '/config/project.yml';
        $appFlowerPluginPath = $projectPath . '/plugins/appFlowerPlugin/';
        $appFlowerStudioPluginPath = $projectPath . '/plugins/appFlowerStudioPlugin/';
        
        $projectYml = sfYaml::load($projectYmlPath);
        $pluginTemplateYml = sfYaml::load(sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/config/template.yml');
        
        if (file_exists($appFlowerPluginPath) && file_exists($appFlowerStudioPluginPath)) {
            $projectYml['project']['template'] = in_array($templateName, $pluginTemplateYml['template']['types']) ? $templateName : $pluginTemplateYml['template']['default'];
            
            afStudioUtil::writeFile($projectYmlPath,sfYaml::dump($projectYml,4));
            
            return $response->success(true)->message('Template was set to '.ucfirst($templateName));
        }
        
        return $response->success(false)->message("The selected path doesn't contain any valid AppFlower project!");
	}
	
}
