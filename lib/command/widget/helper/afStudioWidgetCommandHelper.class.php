<?php
/**
 * Widget command helper class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioWidgetCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * folder from where will be synchronized libs to project
     * should be folder in studio plugin command class, here lib/command/widget/
     */
    const LIB_PATH = 'action';
    
    /**
     * root libs path in project, where will be deployed libs
     */
    const PROJECT_LIB_PATH_ROOT = 'studio';
    
    /**
     * path for deployed libs
     */
    const PROJECT_LIB_PATH = 'widget/action';
    
    /**
     * Place type application
     */
    const PLACE_APPLICATION = 'app';
    
    /**
     * Plugin place type
     */
    const PLACE_PLUGIN = 'plugin';
    
    /**
     * Cdata fields that will be processed, should be written with xpath value
     *
     * @example array(
     *              'title' => '//i:view/i:title',
     *              'description' => '//i:view/i:description',
     *          )
     * @var array
     */
    static private $cdata_fields = array(
        'title'         =>  '//i:view/i:title',
        'description'   =>  '//i:view/i:description',
        'param_html'    =>  '//i:view/i:params/i:param[@name="html"]'
    );
    
    /**
     * Deploy libs for widgets from studio procedure
     *
     * @return void
     * @author Sergey Startsev
     */
    static public function deployLibs()
    {
        $filesystem = new sfFileSystem;
        
        $source_path = sfConfig::get('sf_plugins_dir') . '/appflowerStudioPlugin/lib/command/widget/' . self::LIB_PATH;
        $destination_path = sfConfig::get('sf_lib_dir') . '/' . self::PROJECT_LIB_PATH_ROOT . '/' . self::PROJECT_LIB_PATH;
        
        if (!file_exists($destination_path)) {
            $path = sfConfig::get('sf_lib_dir') . '/' . self::PROJECT_LIB_PATH_ROOT;
            
            if (!file_exists($path)) {
                // should be changed when privacy rules will be reviewed!
                afStudioConsole::getInstance()->execute(array("mkdir {$path}", "chmod -R 777 {$path}"));
            } else {
                // to be ensure that folder has credentials needed to make folders and etc without root privilegies
                afStudioConsole::getInstance()->execute("chmod -R 777 {$path}");
            }
            
            $subpath = explode('/', self::PROJECT_LIB_PATH);
            
            foreach ($subpath as $subfolder) {
                $path .= '/' . $subfolder;
                $result = $filesystem->mkdirs($path);
            }
        }
        
        // synchronize directories
        $filesystem->mirror($source_path, $destination_path, sfFinder::type('any'));
    }
    
    /**
     * Getting widget info
     *
     * @param string $action 
     * @param string $module 
     * @param string $place 
     * @param string $place_type 
     * @return array
     * @author Sergey Startsev
     */
    static public function getInfo($action, $module, $place = 'frontend', $place_type = self::PLACE_APPLICATION)
    {
        $place_path = afStudioUtil::getRootDir() . "/{$place_type}s/{$place}";
        $module_dir = "{$place_path}/modules/{$module}";
        $place_config_path = "{$module_dir}/config";
        
        $actionPath = "{$module_dir}/actions/actions.class.php";
        
	    $predictActions = "{$action}Action.class.php";
	    $predictActionsPath = "{$module_dir}/actions/{$predictActions}";
	    
	    if (file_exists($predictActionsPath)) {
	        $actionPath = $predictActionsPath;
	    }
	    
	    $actionName = pathinfo($actionPath, PATHINFO_BASENAME);
        
        // Info response
        $info = array(
            'place' => $place,
            'placeType' => $place_type,
            'module' => $module,
            'widgetUri' => "{$module}/{$action}",
            'securityPath' => "{$place_config_path}/security.yml",
            'xmlPath' => "{$place_config_path}/{$action}.xml",
            'actionPath' => $actionPath,
            'actionName' => $actionName,
            'name' => $action
        );
        
        return $info;
    }
    
    /**
     * Update fields, make needed fields with cdata
     *
     * @param string $definition 
     * @return string
     * @author Sergey Startsev
     */
    static public function updateCdataFields($definition)
    {
        // create dom document instance
        $dom_xml = new DOMDocument;
        $dom_xml->formatOutput = true;
        $dom_xml->loadXML($definition);
        
        $dom_xml_xpath = new DOMXPath($dom_xml);
        
        // make changes 
        foreach (self::$cdata_fields as $field_name => $path) {
            // getting element
            $elements = $dom_xml_xpath->query($path);
            
            if ($elements) {
                foreach ($elements as $element) {
                    $value = $element->nodeValue;
                    $element->nodeValue = '';
                    $element->appendChild($element->ownerDocument->createCDATASection($value));
                }
            }
        }
        
        // update definition
        $definition = $dom_xml->saveXML();
        
        return $definition;
    }
    
}
