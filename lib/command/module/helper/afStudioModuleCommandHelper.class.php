<?php
/**
 * Studio Module Command Helper class 
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModuleCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Application type
     */
    const TYPE_APPLICATION = 'app';
    
    /**
     * Plugin type
     */
    const TYPE_PLUGIN = 'plugin';
    
    /**
     * Rename module name inside actions
     *
     * @param string $name 
     * @param string $renamed 
     * @param string $place 
     * @param string $type 
     * @return void
     * @author Sergey Startsev
     */
    static public function renameAction($name, $renamed, $place, $type)
    {
        $afConsole = afStudioConsole::getInstance();
        $root = afStudioUtil::getRootDir();
        
        $dir = "{$root}/{$type}s/{$place}/modules/{$renamed}";
        $actionsPath = "{$dir}/actions/actions.class.php";
        
        // rename actions class
        if (file_exists($actionsPath)) self::renameActionContent($actionsPath, $name, $renamed);
        
        // generated lib actions class
        $actionsLibPath = "{$dir}/lib/Base{$name}Actions.class.php";
        if (file_exists($actionsLibPath)) {
            self::renameActionContent($actionsLibPath, $name, $renamed);
            afsFileSystem::create()->rename($actionsLibPath, "{$dir}/lib/Base{$renamed}Actions.class.php");
        }
    }
    
    /**
     * Rename action content
     *
     * @param string $path 
     * @param string $name 
     * @param string $renamed 
     * @return boolean
     * @author Sergey Startsev
     */
    static public function renameActionContent($path, $name, $renamed)
    {
        $actions = file_get_contents($path);
        $actions = str_ireplace("{$name}Actions", "{$renamed}Actions", $actions);
        $actions = str_ireplace("@subpackage {$name}", "@subpackage {$renamed}", $actions);
        $actions = str_ireplace("{$name} actions", "{$renamed} actions", $actions);
        $actions = str_ireplace("{$name} module", "{$renamed} module", $actions);
        
        return afStudioUtil::writeFile($path, $actions);
    }
    
    /**
     * Getting module info
     *
     * @param string $module_name 
     * @param string $app 
     * @return array
     * @author Sergey Startsev
     */
    static public function getModuleInfo($module_name, $app)
    {
        $root = afStudioUtil::getRootDir();
        
        $module = array();
        
        $module['text'] = $module_name;
        $module_dir = "{$root}/apps/{$app}/modules/{$module_name}";
        
        $xmlNames = afStudioUtil::getFiles("{$module_dir}/config/", true, "xml");
        $xmlPaths = afStudioUtil::getFiles("{$module_dir}/config/", false, "xml");
        
        $securityPath = "{$module_dir}/config/security.yml";
        $defaultActionPath = "{$module_dir}/actions/actions.class.php";
        
        $module['type'] = 'module';
        $module['app'] = $app;
        
        if (count($xmlNames) > 0) {
            $k = 0;
            $module['leaf'] = false;
            
            foreach ($xmlNames as $xk => $xmlName) {
                $actionPath = $defaultActionPath;
                
                $widgetName = pathinfo($xmlName, PATHINFO_FILENAME);
                $predictActions = "{$widgetName}Action.class.php";
                $predictActionsPath = "{$module_dir}/actions/{$predictActions}";
                
                if (file_exists($predictActionsPath)) $actionPath = $predictActionsPath;
                
                $module['children'][$k] = array(
                    'app'           => $app,
                    'module'        => $module_name,
                    'widgetUri'     => "{$module_name}/{$widgetName}",
                    'type'          => 'xml',
                    'text'          => $widgetName,
                    'securityPath'  => $securityPath,
                    'xmlPath'       => $xmlPaths[$xk],
                    'actionPath'    => $actionPath,
                    'actionName'    => pathinfo($actionPath, PATHINFO_BASENAME),
                    'name'          => $widgetName,
                    'leaf'          => true
                );
                
                $k++;
            }
        } else {
            $module['leaf'] = true;
            $module['iconCls'] = 'icon-folder';
        }
        
        return $module;
    }
    
    /**
     * Getting grouped module list 
     *
     * @param string $type 
     * @return array
     * @author Sergey Startsev
     */
    static public function getGroupedList($type)
    {
        $root = afStudioUtil::getRootDir();
        $deprecated = ($type == self::TYPE_PLUGIN) ? afStudioPluginCommandHelper::getDeprecatedList() : array();
        
        $data = array();
        foreach(afStudioUtil::getDirectories("{$root}/{$type}s/", true) as $place) {
            if (in_array($place, $deprecated)) continue;
            
            foreach(afStudioUtil::getDirectories("{$root}/{$type}s/{$place}/modules/", true) as $module) {
                $data[] = array(
                    'value' => $module,
                    'text'  => $module,
                    'group' => $place,
                    'type'  => $type,
                );
            }
        }
        
        return $data;
    }
    
    /**
     * Check is valid name or not
     *
     * @param string $name 
     * @return boolean
     * @author Sergey Startsev
     */
    static public function isValidName($name)
    {
        return preg_match('/^[a-zA-Z]+$/si', $name);
    }
    
}
