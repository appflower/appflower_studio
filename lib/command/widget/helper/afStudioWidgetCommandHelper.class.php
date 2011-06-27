<?php
/**
 * Widget command helper class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioWidgetCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * folder from where will be synchronized libs to project
     * should be folder in studio plugin command class, here lib/command/widget/
     */
    const LIB_PATH = 'action';
    
    /**
     * root libs path in project, where will be deployed libs
     */
    const PROJECT_LIB_PATH_ROOT = 'studio';
    
    /**
     * path for deployed libs
     */
    const PROJECT_LIB_PATH = 'widget/action';
    
    /**
     * Deploy libs for widgets from studio
     *
     * @return void
     * @author Sergey Startsev
     */
    static public function deployLibs()
    {
        $filesystem = new sfFileSystem;
        
        $source_path = sfConfig::get('sf_plugins_dir') . '/appflowerStudioPlugin/lib/command/widget/' . self::LIB_PATH;
        $destination_path = sfConfig::get('sf_lib_dir') . '/' . self::PROJECT_LIB_PATH_ROOT . '/' . self::PROJECT_LIB_PATH;
        
        if (!file_exists($destination_path)) {
            
            $path = sfConfig::get('sf_lib_dir') . '/' . self::PROJECT_LIB_PATH_ROOT;
            
            if (!file_exists($path)) {
                // should be changed when privacy rules will be reviewed!
                afStudioConsole::getInstance()->execute(array("mkdir {$path}", "chmod -R 777 {$path}"));
            } else {
                // to be ensure that folder has credentials needed to make folders and etc without root privilegies
                afStudioConsole::getInstance()->execute("chmod -R 777 {$path}");
            }
            
            $subpath = explode('/', self::PROJECT_LIB_PATH);
            
            foreach ($subpath as $subfolder) {
                $path .= '/' . $subfolder;
                $result = $filesystem->mkdirs($path);
            }
        }
        
        // synchronize directories
        $filesystem->mirror($source_path, $destination_path, sfFinder::type('any'));
    }
    
}
