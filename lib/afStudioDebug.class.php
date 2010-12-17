<?php

/**
 * Debug manipulation class
 */
class afStudioDebug 
{
    
    /**
     * Get file content using limits "start" and "end"
     */    
    public static function get_content($file, $start = 0, $end = 0)
    {
        $result = '';
        
        $file_name = sfConfig::get('sf_root_dir') . '/log/' . $file;
        if (file_exists($file_name) && is_readable ($file_name)) {
            $file_size = filesize($file_name);
            if ($file_size) {
                $fh = fopen($file_name, "rb");
                
                if ($start < $file_size ) {
                    
                    $nLastSymbols = $end - $start;
                    
                    fseek($fh, $start);
                    
                    $result = fread($fh, $nLastSymbols);
                    
                    if ($result[0] != "\n") {
                        
                        while ($start > 0 && $result[0] != "\n") {
                            $start -= 1;
                            $nLastSymbols += 1;
                            fseek($fh, $start);
                            $result = fread($fh, $nLastSymbols);
                        }
                        
                        if ($start == 0) {
                            fseek($fh, $start);
                            $result = fread($fh, $nLastSymbols);
                        }
                    }
                    
                    $result = trim($result);
                    
                } else {
                    $result = fread($fh, $file_size);
                }
                
                fclose($fh);
            } else {
                $result = 'log empty';
            }
        } else { 
            $result = "log doesn't exists";
        }
        
        $current_encoding = mb_detect_encoding($result, "UTF-8, ASCII, ISO-8859-1");
        if ($current_encoding != 'UTF-8') {
            $result = iconv($current_encoding, 'UTF-8', $result);
        }
        
        $result = nl2br($result);
        
        return $result;
    }

    
    /**
     * Get file names existed in log folder
     */
    public static function get_files()
    {
        $dir = sfConfig::get('sf_root_dir') . '/log/';
        
        if (is_dir($dir)) {
            $aFiles = array();
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    if ($file != '.' && $file != '..' && $file != '.svn' && is_file($dir . $file)) {
                        $modification = filemtime($dir . $file);
                        $aFiles[$modification] = $file;
                    }
                }
                closedir($dh);
            }
            
            krsort($aFiles);
            $aFiles = array_values($aFiles);
            
            return $aFiles;
        } else {
            return false;
        }
    }
    
    /**
     * Get log-file length
     */
    public static function get_file_len($file_name)
    {
        return strlen(file_get_contents(sfConfig::get('sf_root_dir') . '/log/' . $file_name));
    }
    
}



?>