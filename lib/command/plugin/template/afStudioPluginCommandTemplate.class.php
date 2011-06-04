<?php
/**
 * Studio plugin command template class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioPluginCommandTemplate
{
    /**
     * Get config definition
     *
     * @param string $name - plugin name
     * @return string
     * @author Sergey Startsev
     */
    static public function config($name)
    {
        $definition = '<'.'?'.'php'."\n".
            '$modules = sfFinder::type(\'directory\')->maxdepth(0)->ignore_version_control()->relative()->in(sfConfig::get(\'sf_plugins_dir\') . "/' . $name . '/modules/");' . "\n\n" .
            "sfConfig::set(  'sf_enabled_modules', " . "\n" .
            '    array_merge(' . "\n" .
            "        sfConfig::get('sf_enabled_modules')," . "\n" .
            '        $modules' . "\n" .
            '    )' . "\n" .
            ");";
        
        return $definition;
    }
    
}
