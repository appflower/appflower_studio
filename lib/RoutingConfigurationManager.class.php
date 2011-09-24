<?php
/**
 * Class allows to modify routing.yml file
 *
 * @author Lukasz Wojciechowski
 */
class RoutingConfigurationManager {

    public function __construct() {
        $this->filePath = sfConfig::get('sf_app_config_dir') . '/routing.yml';
    }

    public function setHomepageUrlFromWidgetUri($widgetUri)
    {
        $uriParts = explode('/', $widgetUri);
        if (count($uriParts) != 2) {
            return false;
        }
        $routingYml = $this->loadYaml($this->filePath);
        
        if (is_array(@$routingYml['homepage']['param'])) {
            $routingYml['homepage']['param']['module'] = $uriParts[0];
            $routingYml['homepage']['param']['action'] = $uriParts[1];
            
            $yaml = new sfYaml();
            
            return afStudioUtil::writeFile($this->filePath, $yaml->dump($routingYml, 4));
        }
    }

    private function loadYaml($filePath)
    {
        $sfYaml = new sfYaml();
        $fileData = $sfYaml->load($filePath);

        return $fileData;
    }

    private function dumpYaml($data)
    {
        $sfYaml = new sfYaml();
        $yamlData = $sfYaml->dump($data, 4);

        return $yamlData;
    }

}
?>