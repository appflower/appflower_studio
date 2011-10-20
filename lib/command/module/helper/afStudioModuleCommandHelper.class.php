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
     * Rename module name inside actions
     *
     * @param string $name 
     * @param string $renamed 
     * @param string $place 
     * @param string $type 
     * @return string - console result
     * @author Sergey Startsev
     */
    static public function renameAction($name, $renamed, $place, $type)
    {
        $afConsole = afStudioConsole::getInstance();
        $root = afStudioUtil::getRootDir();
        
        $console = '';
        
        $dir = "{$root}/{$type}s/{$place}/modules/{$renamed}";
        $actionsPath = "{$dir}/actions/actions.class.php";
        
        // rename actions class
        if (file_exists($actionsPath)) self::renameActionContent($actionsPath, $name, $renamed);
        
        // generated lib actions class
        $actionsLibPath = "{$dir}/lib/Base{$name}Actions.class.php";
        $actionsLibPathRenamed = "{$dir}/lib/Base{$renamed}Actions.class.php";
        
        if (file_exists($actionsLibPath)) {
            self::renameActionContent($actionsLibPath, $name, $renamed);
            $console = $afConsole->execute("mv {$actionsLibPath} {$actionsLibPathRenamed}");
        }
        
        return $console;
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
    
}
