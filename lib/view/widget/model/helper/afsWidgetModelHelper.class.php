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
     * Widget show type
     */
    const WIDGET_SHOW = 'show';
    
    /**
     * Possible place types
     *
     * @var array
     */
    static public $place_types = array(
        self::PLACE_APPLICATION,
        self::PLACE_PLUGIN,
    );
    
    /**
     * Possible widget types
     *
     * @var array
     */
    static public $widget_types = array(
        self::WIDGET_EDIT,
        self::WIDGET_LIST,
        self::WIDGET_SHOW,
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
     * @param afsWidgetModel $widget
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
            'place'         => $place,
            'placeType'     => $place_type,
            'module'        => $module,
            'widgetUri'     => "{$module}/{$action}",
            'securityPath'  => "{$place_config_path}/security.yml",
            'xmlPath'       => "{$place_config_path}/{$action}.xml",
            'actionPath'    => $actionPath,
            'actionName'    => $actionName,
            'name'          => $action
        );
        
        return $info;
    }
    
    /**
     * Try to find action 
     *
     * @param string $action 
     * @param string $module 
     * @return mixed - array/boolean
     * @author Sergey Startsev
     */
    static public function find($action, $module)
    {
        $root_dir = afStudioUtil::getRootDir();
        
        foreach (array('app', 'plugin') as $type) {
            foreach(afStudioUtil::getDirectories("{$root_dir}/{$type}s/", true) as $place) {
                $modules_dir = "{$root_dir}/{$type}s/{$place}/modules";
                if (in_array($module, afStudioUtil::getDirectories($modules_dir, true))) {
                    if (in_array("{$action}.xml", afStudioUtil::getFiles("{$modules_dir}/{$module}/config/", true, "xml"))) {
                        return array(
                            'place'     => $place,
                            'placeType' => $type,
                        );
                    }
                }
            }
        }
        
        return false;
    }
    
}
