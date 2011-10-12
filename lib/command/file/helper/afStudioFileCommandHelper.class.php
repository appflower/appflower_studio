<?php 
/**
 * File command helper
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioFileCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * File text 
     */
    const FILE_TEXT = 'text';
    
    /**
     * File leaf
     */
    const FILE_LEAF = 'leaf';
    
    /**
     * File path root identificator
     */
    const PATH_ROOT_IDENTIFICATOR = 'root';
    
    /**
     * Prepare file list for Ext response
     *
     * @param Array $files 
     * @return array
     * @author Sergey Startsev
     */
    static public function prepareList(Array $files)
    {
        $data = array();
        foreach ($files as $file) {
            $data[] = array(
                self::FILE_TEXT => basename($file),
                self::FILE_LEAF => (is_file($file) ? true : false)
            );
        }
        
        return $data;
    }
    
    /**
     * Getting full file path with replaces 'root' token 
     *
     * @param string $file 
     * @return string
     * @author Sergey Startsev
     */
    static public function getPath($file)
    {
         return str_replace(self::PATH_ROOT_IDENTIFICATOR, afStudioUtil::getRootDir(), $file);
    }
    
    /**
     * Check folder for processing
     *
     * @param string $dir_path 
     * @return mixed
     * @author Sergey Startsev
     */
    static public function checkFolder($dir_path)
    {
        $path = self::getPath($dir_path);
        $extension = pathinfo($dir_path, PATHINFO_EXTENSION);
        $is_file = !empty($extension);
        
        if (!is_writable(dirname($path))) {
            return  "Please check permissions on '" . dirname($dir_path) . "' folder. Folder is not writable. ".
                    "Script can't create '" . pathinfo($dir_path, PATHINFO_BASENAME) . "' " . ($is_file ? 'file' : 'folder') . ".";
        }
        
        return true;
    }
    
}
