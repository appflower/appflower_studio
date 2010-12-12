<?php

class afStudioDebug 
{
    
    public static function get_content($file)
    {
        $nLastSymbols = 4094;
        
        $result = '';
        
        $file_name = sfConfig::get('sf_root_dir') . '/log/' . $file;
        if (file_exists($file_name) && is_readable ($file_name)) {
            $file_size = filesize($file_name);
            if ($file_size) {
                $fh = fopen($file_name, "rb");
                
                if ($file_size > $nLastSymbols) {
                    
                    $file_log_begin = $file_size - $nLastSymbols;
                    fseek($fh, $file_log_begin);
                    
                    $result = fread($fh, $nLastSymbols);
                    
                    if ($result[0] != "\n") {
                        
                        while ($result[0] != "\n") {
                            $file_log_begin -= 1;
                            $nLastSymbols += 1;
                            fseek($fh, $file_log_begin);
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
    
}



?>