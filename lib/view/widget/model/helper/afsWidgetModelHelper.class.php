<?php
/**
 * Widget model helper
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetModelHelper extends afsBaseModelHelper
{
    /**
     * Place application type
     */
    const PLACE_APPLICATION = 'app';
    
    /**
     * Place plugin type
     */
    const PLACE_PLUGIN = 'plugin';
    
    /**
     * Widget type list
     */
    const WIDGET_LIST = 'list';
    
    /**
     * Widget edit type
     */
    const WIDGET_EDIT = 'edit';
    
    /**
     * Possible place types
     *
     * @var array
     */
    static public $place_types = array(
        self::PLACE_APPLICATION,
        self::PLACE_PLUGIN
    );
    
    /**
     * Possible widget types
     *
     * @var array
     */
    static public $widget_types = array(
        self::WIDGET_EDIT,
        self::WIDGET_LIST
    );
    
    /**
     * Retrieve existed widget 
     *
     * @param string $action 
     * @param string $module 
     * @param string $place 
     * @param string $place_type 
     * @return afsWidgetModel
     * @author Sergey Startsev
     */
    static public function retrieve($action, $module, $place, $place_type)
    {
        $widget = new afsWidgetModel;
        
        $widget->setAction($action);
        $widget->setModule($module);
        $widget->setPlace($place);
        $widget->setPlaceType($place_type);
        
        return $widget->load();
    }
    
    /**
     * Rename action name inside module
     *
     * @param string $name 
     * @param string $renamed 
     * @param string $module
     * @param string $place 
     * @param string $type 
     * @return string
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
