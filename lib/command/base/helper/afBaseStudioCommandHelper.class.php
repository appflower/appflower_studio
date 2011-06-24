<?php 
/**
 * Base command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afBaseStudioCommandHelper
{
    /**
     * Helper folder in command environment
     */
    const FOLDER = 'helper';
    
    /**
     * Load helper class
     *
     * @param string $name 
     * @return boolead
     * @author Sergey Startsev
     */
    static public function load($name)
    {
        $class = "afStudio" . ucfirst($name) . "CommandHelper.class.php";
        $path = sfConfig::get('sf_plugins_dir') . "/appFlowerStudioPlugin/lib/command/{$name}/helper/{$class}";
        
        if (file_exists($path)) {
            require($path);
            
            return true;
        }
        
        return false;
    }
    
}
