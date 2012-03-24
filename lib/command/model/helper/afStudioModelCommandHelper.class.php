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
     * Rename model files
     *
     * @param string $native_name 
     * @param string $new_name 
     * @return array - status and message
     * @author Sergey Startsev
     */
    static public function renameModel($native_name, $new_name)
    {
        $lib_path = sfConfig::get("sf_lib_dir");
        
        $messages = array();
        
        $files = array(
            'model' => array(
                'path'      => "{$lib_path}/model",
                'file'      => ".php",
                'postfix'   => "",
                'pattern'   => "/class {$native_name} extends Base{$native_name}.*?\{\s*?(.*?)\s*?\}/sim",
            ),
            'peer' => array(
                'path'      => "{$lib_path}/model",
                'file'      => ".php",
                'postfix'   => "Peer",
                'pattern'   => "/class {$native_name}Peer extends Base{$native_name}Peer.*?\{\s*?(.*?)\s*?\}/sim",
            ),
            'query' => array(
                'path'      => "{$lib_path}/model",
                'file'      => ".php",
                'postfix'   => "Query",
                'pattern'   => "/class {$native_name}Query extends Base{$native_name}Query.*?\{\s*?(.*?)\s*?\}/sim",
            ),
            'form' => array(
                'path'      => "{$lib_path}/form",
                'file'      => ".class.php",
                'postfix'   => "Form",
                'pattern'   => "/public function configure\(\).*?\{\s*?(.*?)\s*?\}/sim",
            ),
        );
        
        $filesystem = afsFileSystem::create();
        
        foreach ($files as $file) {
            if (file_exists("{$file['path']}/{$native_name}{$file['postfix']}{$file['file']}") &&
                self::isModifiedContent("{$file['path']}/{$native_name}{$file['postfix']}{$file['file']}", $file['pattern']) &&
                $filesystem->copy("{$file['path']}/{$native_name}{$file['postfix']}{$file['file']}", "{$file['path']}/{$new_name}{$file['postfix']}{$file['file']}")
            ) {
                self::renameModelContent(
                    "{$file['path']}/{$new_name}{$file['postfix']}{$file['file']}", 
                    "{$native_name}{$file['postfix']}", 
                    "{$new_name}{$file['postfix']}"
                );
                
                $messages[] = "In {$native_name}{$file['postfix']} has been found custom code, please check {$new_name}{$file['postfix']} for correct work";
            }
        }
        
        return array(true, implode("\n", $messages));
    }
    
    /**
     * Rename model content
     *
     * @param string $path 
     * @param string $name 
     * @param string $renamed 
     * @return bool
     * @author Sergey Startsev
     */
    static public function renameModelContent($path, $name, $renamed)
    {
        $content = file_get_contents($path);   
        $content = str_ireplace($name, $renamed, $content);
        
        return afStudioUtil::writeFile($path, $content);
    }
    
    /**
     * Checking is modified content by pattern 
     *
     * @param string $path 
     * @param string $pattern 
     * @return bool
     * @author Sergey Startsev
     */
    static public function isModifiedContent($path, $pattern)
    {
        return (preg_match($pattern, file_get_contents($path), $matched) && array_key_exists(1, $matched) && !empty($matched[1]));
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
