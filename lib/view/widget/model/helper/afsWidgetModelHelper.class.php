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
     * Getting widget info
     *
     * @param string $action 
     * @param string $module 
     * @param string $place 
     * @param string $place_type 
     * @return array
     * @author Sergey Startsev
     */
    static public function getInfo(afsWidgetModel $widget)
    {
        $module_dir = $widget->getPlaceModulePath();
        $place_config_path = $widget->getPlaceConfigPath();
        
        $action = $widget->getAction();
        $module = $widget->getModule();
        $place = $widget->getPlace();
        $place_type = $widget->getPlaceType();
        
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
     * Fix order in definition
     *
     * @param Array $definition 
     * @return array
     * @author Sergey Startsev
     */
    static public function fixOrder(Array $def)
    {
        $newDefinition = array();
        
        if (isset($def['i:title'])) {
            $newDefinition['i:title'] = $def['i:title'];
            unset($def['i:title']);
        }
        
        if (isset($def['i:params'])) {
            $newDefinition['i:params'] = $def['i:params'];
            unset($def['i:params']);
        }
        
        if (isset($def['i:proxy'])) {
            $newDefinition['i:proxy'] = $def['i:proxy'];
            unset($def['i:proxy']);
        }
        
        if (isset($def['i:datasource'])) {
            $newDefinition['i:datasource'] = $def['i:datasource'];
            unset($def['i:datasource']);
            $newDS = array();
            if (isset($newDefinition['i:datasource']['i:class'])) {
                $newDS['i:class'] = $newDefinition['i:datasource']['i:class'];
                unset($newDefinition['i:datasource']['i:class']);
            }
            if (isset($newDefinition['i:datasource']['i:method'])) {
                $newDS['i:method'] = $newDefinition['i:datasource']['i:method'];
                unset($newDefinition['i:datasource']['i:method']);
            }
            
            foreach ($newDefinition['i:datasource'] as $key => $value) {
                $newDS[$key] = $value;
            }
            
            $newDefinition['i:datasource'] = $newDS;
        }
        
        if (isset($def['i:fields'])) {
            $newDefinition['i:fields'] = $def['i:fields'];
            unset($def['i:fields']);
        }
        
        if (isset($def['i:rowactions'])) {
            $newDefinition['i:rowactions'] = $def['i:rowactions'];
            unset($def['i:rowactions']);
        }
        
        if (isset($def['i:actions'])) {
            $newDefinition['i:actions'] = $def['i:actions'];
            unset($def['i:actions']);
        }
        
        if (isset($def['i:moreactions'])) {
            $newDefinition['i:moreactions'] = $def['i:moreactions'];
            unset($def['i:moreactions']);
        }
        
        if (isset($def['i:description'])) {
            $newDefinition['i:description'] = $def['i:description'];
            unset($def['i:description']);
        }
        
        if (is_array($def)) {
            foreach ($def as $elName => $el) {
                $newDefinition[$elName] = $el;
            }
        }
        
        return $newDefinition;
    }
    
}
