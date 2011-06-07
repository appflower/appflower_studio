<?php
/**
 * Plugin command helper class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioPluginCommandHelper
{
    /**
     * Task needed to generate plugins and modules in plugins
     */
    const PLUGIN_GENERATE_MODULES = 'sfTaskExtraPlugin';
    
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
    
}
