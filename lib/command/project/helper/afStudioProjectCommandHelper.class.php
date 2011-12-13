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
     * Getting active background image path
     *
     * @param string $place 
     * @param string $place_type 
     * @return void
     * @author Sergey Startsev
     */
    static public function getActiveBackground($place = 'frontend', $place_type = 'app')
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
    
}
