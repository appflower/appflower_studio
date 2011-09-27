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
    );
    
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
     * Getting deprecated plugins list 
     *
     * @return array
     * @author Sergey Startsev
     */
    static public function getDeprecatedList()
    {
        return self::$deprecated_plugins;
    }
    
}
