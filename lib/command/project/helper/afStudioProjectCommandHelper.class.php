<?php
/**
 * Studio project command helper class 
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioProjectCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Config app appflower identificator
     */
    const CONFIG_APP_APPFLOWER = 'appFlower';
    
    /**
     * Config app desktop background image
     */
    const CONFIG_DESKTOP_BACKGROUND_IMAGE = 'desktopBackgroundImage';
    
    /**
     * Config app desktop background color
     */
    const CONFIG_DESKTOP_BACKGROUND_COLOR= 'desktopBackgroundColor';
    
    /**
     * Background type image
     */
    const BACKGROUND_TYPE_IMAGE = 'image';
    
    /**
     * Background type color
     */
    const BACKGROUND_TYPE_COLOR = 'color';
    
    /**
     * Default helper place
     */
    const DEFAULT_HELPER_PLACE = 'appFlowerExtjsThemePlugin';
    
    /**
     * Default helper place type
     */
    const DEFAULT_HELPER_PLACE_TYPE = 'plugin';
    
    /**
     * Name to helper name association
     *
     * @var array
     */
    static public $name_to_helper = array(
        'menu' => 'desktop_start_menu',
        'links' => 'desktop_links',
    );
    
    /**
     * Returns Prepared commands results - for now just imploded values
     * 
     * @return string
     * @author Sergey Startsev
     */
    static public function processRun()
    {
        $commands = array(
            'sf propel:build-model',
            'sf appflower:validator-cache frontend cache yes',
            'sf cc',
        );
        
        return afStudioConsole::getInstance()->execute($commands);
    }
    
    /**
     * Getting active background parameter
     *
     * @param string $place 
     * @param string $place_type 
     * @param string $type 
     * @return string
     * @author Sergey Startsev
     */
    static public function getActiveBackground($place = 'frontend', $place_type = 'app', $type = self::BACKGROUND_TYPE_IMAGE)
    {
        $method_name = "getActiveBackground" . ucfirst($type);
        if (!method_exists(__CLASS__, $method_name)) throw new afStudioProjectCommandHelperException("Method '{$method_name}' not defined");
        
        if (!($value = call_user_func(array(__CLASS__, $method_name), $place, $place_type))) {
            $value = call_user_func(array(__CLASS__, $method_name), self::DEFAULT_HELPER_PLACE, self::DEFAULT_HELPER_PLACE_TYPE);
        }
        
        return $value;
    }
    
    /**
     * Getting active background image path
     *
     * @param string $place 
     * @param string $place_type 
     * @return string
     * @author Sergey Startsev
     */
    static public function getActiveBackgroundImage($place = 'frontend', $place_type = 'app')
    {
        $app_path = sfConfig::get('sf_root_dir') . "/{$place_type}s/{$place}/config/app.yml";
        
        if (file_exists($app_path)) {
            $app_config = sfYaml::load($app_path);
            if (array_key_exists(self::CONFIG_APP_APPFLOWER, $app_config['all']) && array_key_exists(self::CONFIG_DESKTOP_BACKGROUND_IMAGE, $app_config['all'][self::CONFIG_APP_APPFLOWER])) {
                return $app_config['all'][self::CONFIG_APP_APPFLOWER][self::CONFIG_DESKTOP_BACKGROUND_IMAGE];
            }
        }
        
        return null;
    }
    
    /**
     * Getting active background color
     *
     * @param string $place 
     * @param string $place_type 
     * @return string
     * @author Sergey Startsev
     */
    static public function getActiveBackgroundColor($place = 'frontend', $place_type = 'app')
    {
        $app_path = sfConfig::get('sf_root_dir') . "/{$place_type}s/{$place}/config/app.yml";
        
        if (file_exists($app_path)) {
            $app_config = sfYaml::load($app_path);
            if (array_key_exists(self::CONFIG_APP_APPFLOWER, $app_config['all']) && array_key_exists(self::CONFIG_DESKTOP_BACKGROUND_COLOR, $app_config['all'][self::CONFIG_APP_APPFLOWER])) {
                return $app_config['all'][self::CONFIG_APP_APPFLOWER][self::CONFIG_DESKTOP_BACKGROUND_COLOR];
            }
        }
        
        return null;
    }
    
    /**
     * Getting php helper path
     *
     * @param string $name 
     * @param string $place 
     * @param string $place_type 
     * @return string
     * @author Sergey Startsev
     */
    static public function getPhpHelperPath($name, $place = 'frontend', $place_type = 'app')
    {
        if (!array_key_exists($name, self::$name_to_helper)) return false;
        
        return sfConfig::get("sf_{$place_type}s_dir") . "/{$place}/lib/helper/afExtjs" . sfInflector::camelize(self::$name_to_helper[$name]) . 'Helper.php';
    }
    
}
