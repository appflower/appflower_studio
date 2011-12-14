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
        $projectYmlName = '/config/project.yml';
        $projectYmlPath = $projectPath . $projectYmlName;
        $appFlowerPluginPath = $projectPath . '/plugins/appFlowerPlugin/';
        $appFlowerStudioPluginPath = $projectPath . '/plugins/appFlowerStudioPlugin/';
        
        $projectYml = sfYaml::load($projectYmlPath);
        $pluginTemplateYml = sfYaml::load(sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/config/template.yml');
        
        if (file_exists($appFlowerPluginPath) && file_exists($appFlowerStudioPluginPath)) {
            $projectYml['project']['template'] = in_array($templateName, $pluginTemplateYml['template']['types']) ? $templateName : $pluginTemplateYml['template']['default'];
            
            if(afStudioUtil::writeFile($projectYmlPath,sfYaml::dump($projectYml,4)))
            {
                return $response->success(true)->message('Template was set to '.ucfirst($templateName));   
            }
            else {
                return $response->success(false)->message('File '.$projectYmlName.' is not writable!');
            }            
        }
        
        return $response->success(false)->message("The selected path doesn't contain any valid AppFlower project!");
	}
	
}
