<?php
/**
 * Studio Module Command Helper class 
 * 
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModuleCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Rename action name inside module
     *
     * @param string $name 
     * @param string $renamed 
     * @param string $module
     * @param string $place 
     * @param string $type 
     * @return string - console result
     * @author Sergey Startsev
     */
    static public function renameAction($name, $renamed, $module, $place, $type)
    {
        $root = afStudioUtil::getRootDir();
        $afConsole = afStudioConsole::getInstance();
        
		$console = '';
		
		$module_dir = "{$root}/{$type}s/{$place}/modules/{$module}";
		$action_dir = "{$module_dir}/actions";
		
		$predictActions = "{$name}Action.class.php";
	    $predictActionsPath = "{$module_dir}/actions/{$predictActions}";
	    
	    $oldName = "{$name}Action.class.php";
	    $newName = "{$renamed}Action.class.php";
	    
	    $oldPath = "{$action_dir}/{$oldName}";
	    $newPath = "{$action_dir}/{$newName}";
	    
	    if (file_exists($oldPath)) {
	        $action = file_get_contents($oldPath);
		    $action = str_ireplace("{$name}Action", "{$renamed}Action", $action);
		    
		    afStudioUtil::writeFile($oldPath, $action);
	        
	        $console .= $afConsole->execute("mv {$oldPath} {$newPath}");
	    }
		
		return $console;
    }
    
}
