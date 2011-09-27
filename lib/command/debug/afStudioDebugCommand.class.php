<?php
/**
 * Studio Debug Command Class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioDebugCommand extends afBaseStudioCommand
{
    /**
     * Limit count
     */
    const LIMIT = 4094;
    
    /**
     * File Processing
     *
     * @author Sergey Startsev
     */
    protected function processFile()
    {
        $file_name  = $this->getParameter('file_name');
        $start      = $this->getParameter('start', 0);
        $limit      = $this->getParameter('limit', 1);
        
        $limit *= self::LIMIT;
        
        $aResponse = array();
        
        if (!empty($file_name)) {
            $oDebugPager = new afStudioDebugCommandPager($this->getFileLen($file_name), $start, $limit);
            $aResponse['total'] = $oDebugPager->getLastPage();
            $aResponse['data'][] = array('text' => $this->getContent($file_name, $oDebugPager->getPage() * self::LIMIT, $oDebugPager->getNext() * self::LIMIT));
        } else {
            $aResponse['data'][] = array('text' => 'file not checked');
            $aResponse['total'] = 1;
        }
        
        $aResponse['success'] = true;
        
        return $aResponse;
    }
    
    /**
     * Last processing
     *
     * @author Sergey Startsev
     */
    protected function processLast()
    {
        $file_name  = $this->getParameter('file_name');
        $start      = $this->getParameter('start', 0);
        $limit      = $this->getParameter('limit', 1);
        
        $limit *= self::LIMIT;
        
        $aResponse = array();
        
        if (empty($file_name)) {
            $aFiles = $this->getFiles();
            $file_name = $aFiles[0];
        }
        
        $oDebugPager = new afStudioDebugCommandPager($this->getFileLen($file_name), 0, self::LIMIT);
        $aResponse['last_page'] = $oDebugPager->getLastPage() - 1;
        
        $aResponse['success'] = true;
        
        return $aResponse;
    }
    
    /**
     * List processing 
     *
     * @author Sergey Startsev
     */
    protected function processMain()
    {
        $file_name  = $this->getParameter('file_name');
        $start      = $this->getParameter('start', 0);
        $limit      = $this->getParameter('limit', 1);
        
        $limit *= self::LIMIT;
        
        $aResponse = array();
        
        $aResponse['files'] = $this->getFiles();
        
        if (!empty($aResponse['files'])) {
            $oDebugPager = new afStudioDebugCommandPager($this->getFileLen($aResponse['files'][0]), $start, $limit);
            
            $aResponse['total'] = $oDebugPager->getLastPage();
            $aResponse['data'][] = array('text' => $this->getContent($aResponse['files'][0], $oDebugPager->getPage() * self::LIMIT, $oDebugPager->getNext() * self::LIMIT));
        } else {
            $aResponse['data'][] = array('text' => 'no logs');
            $aResponse['total'] = 1;
        }
        
        $aResponse['success'] = true;
        
        return $aResponse;
    }
    
    /**
     * Getting file content 
     *
     * @param string $file 
     * @param int $start 
     * @param int $end 
     * @return string
     * @author Sergey Startsev
     */
    private function getContent($file, $start = 0, $end = 0)
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
                    
                    // Display page content from string begining
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
                    
                    // Displaying full line to end
                    while (substr($result, -1, 1) != "\n") {
                        $nLastSymbols++;
                        fseek($fh, $start);
                        $result = fread($fh, $nLastSymbols);
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
     *
     * @return array
     * @author Sergey Startsev
     */
    private function getFiles()
    {
        $dir = sfConfig::get('sf_root_dir') . '/log/';
        
        if (is_dir($dir)) {
            $aFiles = array();
            if ($dh = opendir($dir)) {
                while (($file = readdir($dh)) !== false) {
                    if ($file != '.' && $file != '..' && $file != '.svn' && is_file($dir . $file) && $file != '.gitignore') {
                        $modification = filemtime($dir . $file);
                        $aFiles[$modification] = $file;
                    }
                }
                closedir($dh);
            }
            
            krsort($aFiles);
            $aFiles = array_values($aFiles);
            
            return $aFiles;
        }
        
        return false;
    }
    
    /**
     * Get log-file length
     *
     * @param string $file_name 
     * @return int
     * @author Sergey Startsev
     */
    private function getFileLen($file_name)
    {
        return filesize( sfConfig::get('sf_root_dir') . '/log/' . $file_name );
    }
    
}
