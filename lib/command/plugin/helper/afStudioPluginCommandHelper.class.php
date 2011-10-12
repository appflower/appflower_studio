<?php
/**
 * Plugin command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioPluginCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Task needed to generate plugins and modules in plugins
     */
    const PLUGIN_GENERATE_MODULES = 'sfTaskExtraPlugin';
    
    /**
     * Deprecated plugins list
     *
     * @var array
     */
    static private $deprecated_plugins = array(
        'appFlowerPlugin',
        'appFlowerStudioPlugin',
        'sfPropel15Plugin',
        'sfPropelORMPlugin',
        'sfPropelSqlDiffPlugin',
        'sfTaskExtraPlugin',
        'afGuardPlugin'
    );
    
    /**
     * Getting deprecated plugins list 
     *
     * @return array
     * @author Sergey Startsev
     */
    static public function getDeprecatedList()
    {
        return self::$deprecated_plugins;
    }
    
    /**
     * Checking exists plugin or not
     *
     * @param string $plugin 
     * @return boolean
     * @author Sergey Startsev
     */
    static public function isExists($plugin)
    {
        $root = sfConfig::get('sf_plugins_dir') . '/' . $plugin;
        $exists = is_dir($root) && count(sfFinder::type('any')->in($root)) > 0;
        
        return $exists;
    }
    
    /**
     * Getting sub-folders
     *
     * @param string $dir 
     * @param string $type 
     * @return Array
     */
    static public function getSubFolders($dir, $type = 'module')
    {
        $folders = array();
        
        if (is_dir($dir)) {
            $handler = opendir($dir);
            
            while (($f = readdir($handler))!==false) {
                if (($f != ".") && ($f != "..") && ($f != ".svn") && is_dir($dir . '/' . $f)) {
                    $folders[] = array(
                        'text' => $f,
                        'type' => $type
                    );
                }
            }
        }
        
        return $folders;
    }
    
    /**
     * Getting files
     *
     * @param string $plugin 
     * @param string $modulename 
     * @param string $pro_name 
     * @return Array
     */
    static public function getFiles($plugin, $modulename, $pro_name)
    {
        $root_dir = afStudioUtil::getRootDir();
        
        $dir = "{$root_dir}/plugins/{$plugin}/modules/{$modulename}/config/";
        
        $base_mod_dir   = "{$root_dir}/plugins/{$plugin}/modules/{$modulename}";
        $securityPath   = "{$base_mod_dir}/config/security.yml";
        $defaultActionPath = "{$base_mod_dir}/actions/actions.class.php";
        
        $files = array();
        
        if (is_dir($dir)) {
            $handler = opendir($dir);
            
            while (($f = readdir($handler)) !== false) {
                if (!is_dir($dir . $f) && strpos($f, $pro_name) > 0) {
                    
                    $actionPath = $defaultActionPath;
                    
                    $widgetName = pathinfo($f, PATHINFO_FILENAME);
                    $predictActions = "{$widgetName}Action.class.php";
                    $predictActionsPath = "{$base_mod_dir}/actions/{$predictActions}";
                    
                    if (file_exists($predictActionsPath)) $actionPath = $predictActionsPath;
                    
                    $actionName = pathinfo($actionPath, PATHINFO_BASENAME);
                    
                    $files[] = array(
                        'text'          => $f,
                        'type'          => 'xml',
                        'widgetUri'     => $modulename . '/' . str_replace('.xml', '', $f),
                        'securityPath'  => $securityPath,
                        'actionPath'    => $actionPath,
                        'actionName'    => $actionName,
                        'widgetName'    => $widgetName,
                        'leaf'          => true
                    );
                }
            }
        }
        
        return $files;
    }
    
}
