<?php
/**
 * Model command helper class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModelCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Deploy schema changes to DB
     * 
     * @return string - Console results
     * @author Sergey Startsev
     */
    static public function deploy()
    {
        $console = afStudioConsole::getInstance()->execute(array(
            'sf cc',
            'sf appflower:validator-cache frontend cache yes',
            'sf propel:diff',
            'sf propel:migrate',
            'sf propel:build-model',
            'sf propel:build-forms',
        ));
        
        return $console;
    }
    
    /**
     * Update existed schemas from database
     *
     * @return string - Console results
     * @author Sergey Startsev
     */
    static public function updateSchemas()
    {
        $console = afStudioConsole::getInstance()->execute(array(
            'sf cc',
            'sf appflower:validator-cache frontend cache yes',
            'sf afs:update-schema',
            'sf propel:build-model',
            'sf propel:build-forms',
        ));
        
        return $console;
    }
    
    /**
     * Validates Model's name
     * 
     * @param string $name
     * @return boolean
     */
    static public function isValidName($name) 
    {
        return preg_match("/^[^\d]\w*$/i", $name);
    }
    
    /**
     * Removing model files
     *
     * @return void
     * @author Sergey Startsev
     */
    static public function removeModelFiles($model_name)
    {
        $lib_path = sfConfig::get("sf_lib_dir");
        
        $files = array(
            'model' => array(
                'path' => "{$lib_path}/model",
                'file' => "{$model_name}.php",
                'base' => "om",
            ),
            'peer' => array(
                'path' => "{$lib_path}/model",
                'file' => "{$model_name}Peer.php",
                'base' => "om",
            ),
            'query' => array(
                'path' => "{$lib_path}/model",
                'file' => "{$model_name}Query.php",
                'base' => "om",
            ),
            'form' => array(
                'path' => "{$lib_path}/form",
                'file' => "{$model_name}Form.class.php",
            ),
            'map' => array(
                'path' => "{$lib_path}/model/map",
                'file' => "{$model_name}TableMap.php",
            ),
        );
        
        foreach ($files as $file) {
            self::removeFile($file['path'], $file['file'], (array_key_exists('base', $file)) ? $file['base'] : 'base');
        }
    }
    
    /**
     * Remove model file 
     *
     * @param string $path 
     * @param string $file 
     * @param string $base 
     * @return boolean
     * @author Sergey Startsev
     */
    static public function removeFile($path, $file, $base = 'base')
    {
        if (file_exists("{$path}/{$file}") && is_writable($path)) {
            if ($base && file_exists("{$path}/{$base}/Base{$file}") && is_writable("{$path}/{$base}")) {
                unlink("{$path}/{$base}/Base{$file}");
            }
            
            unlink("{$path}/{$file}");
        }
        
        return !file_exists("{$path}/{$file}");
    }
    
    /**
     * Sort models array
     *
     * @param Array $models 
     * @return array
     */
    static public function sortModels(Array $models)
    {
        usort($models, 'self::compareModelNames');
        
        return $models;
    }
    
    /**
     * Comparing callback for sort models method
     *
     * @param string $model1 
     * @param string $model2 
     * @return int
     */
    static private function compareModelNames($model1, $model2)
    {
        $model1Name = strtolower($model1['text']);
        $model2Name = strtolower($model2['text']);
        
        if ($model1Name > $model2Name) return 1;
        if ($model1Name < $model2Name) return -1;
        
        return 0;
    }
    
}
