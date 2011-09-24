<?php
/**
 * File command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioFileCommand extends afBaseStudioCommand
{
    /**
     * Getting tree list
     * 
     * @return afResponse
     */
    protected function processGet()
    {
        $path = afStudioFileCommandHelper::getPath($this->getParameter('path'));
        
        $files = sfFinder::type('any')->ignore_version_control()->maxdepth(0)->in($path);
        
        if (count($files) > 0) return afResponseHelper::create()->success(true)->data(array(), afStudioFileCommandHelper::prepareList($files), 0);
        
        return afResponseHelper::create()->success(true);
    }
    
    /**
     * Create new dir
     * 
     * @return afResponse
     */
    protected function processNewdir()
    {
        $dir_path = $this->getParameter('dir');
        $dir = afStudioFileCommandHelper::getPath($dir_path);
        
        if (!Util::makeDirectory($dir)) {
            return afResponseHelper::create()->success(false)->message("Cannot create directory {$dir_path}");
        }
        
        return afResponseHelper::create()->success(true);
    }
    
    /**
     * Create new file
     * 
     * @return afResponse
     */
    protected function processNewfile()
    {
        $file_path = $this->getParameter('file');
        $file = afStudioFileCommandHelper::getPath($file_path);
        
        if (!Util::makeFile($file)) {
            return afResponseHelper::create()->success(false)->message("Cannot create file {$file_path}");
        }
        
        return afResponseHelper::create()->success(true);
    }
    
    /**
     * Delete file 
     * 
     * @return afResponse
     */
    protected function processDelete()
    {
        $file_path = $this->getParameter('file');
        $file = afStudioFileCommandHelper::getPath($file_path);
        
        if (!Util::removeResource($file)) {
            return afResponseHelper::create()->success(false)->message('Cannot delete ' . (is_file($file) ? 'file' : 'directory') . ' ' . $file_path);
        }
        
        return afResponseHelper::create()->success(true);
    }
    
    /**
     * Rename file
     * 
     * @return afResponse
     */
    protected function processRename()
    {
        $oldname = $this->getParameter('oldname');
        $new = afStudioFileCommandHelper::getPath($this->getParameter('newname'));
        $old = afStudioFileCommandHelper::getPath($oldname);
        
        if (!Util::renameResource($old, $new)) {
            return afResponseHelper::create()->success(false)->message('Cannot rename ' . (is_file($old) ? 'file' : 'directory') . ' ' . $oldname);
        }
        
        return afResponseHelper::create()->success(true);
    }
    
    /**
     * Upload files
     * 
     * @return afResponse
     */
    protected function processUpload()
    {
        $path = afStudioFileCommandHelper::getPath($this->getParameter('path'));
        
        if (!empty($_FILES)) {
            foreach ($_FILES as $file => $params) {
                if ($params['size'] > 0) {
                    $extension = substr($params['name'], strrpos($params['name'], '.') + 1);
                    $fileName = Util::stripText(substr($params['name'], 0, (strlen($params['name']) - strlen($extension) - 1))) . '.' . $extension;
                    
                    if (!move_uploaded_file($params["tmp_name"], "{$path}/{$fileName}" )) $errors[$file] = 'File upload error';
                }
            }
        }
        
        if (isset($errors)) return afResponseHelper::create()->success(false)->message($errors);
        
        return afResponseHelper::create()->success(true);
    }
    
    /**
     * Getting file content
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processContent()
    {
        $file = $this->getParameter('file', false);
        $code = $this->getParameter('code', false);
        $is_post = $this->getParameter('is_post', false);
        
        $file = (substr($file, 0, 4) == 'root') ? str_replace('root', afStudioUtil::getRootDir(), substr($file, 0, 4)) . substr($file, 4) : $file;
        
        $response = afResponseHelper::create();
        
        if ($is_post) {
            if ($file && $code && is_writable($file) && afStudioUtil::writeFile($file, $code)) return $response->success(true);
            
            return $response->success(false);
        }
        
        if ($file && $file_content = @file_get_contents($file)) return $response->success(true)->data(array(), $file_content, 0);
        
        return $response->success(false);
    }
    
    /**
     * Checking exists file helper or not
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processIsHelperExists()
    {
        $result = true;
        $message = "";
        
        $helper = $this->getParameter('helper');
        $place = $this->getParameter('place', 'frontend');
        $place_type = $this->getParameter('place_type', 'app');
        
        $filePath = afStudioUtil::getRootDir() . "/{$place_type}s/{$place}/lib/helper/{$helper}Helper.php";
        
        if (!file_exists($filePath)) {
            try{
                $engine_helper = afStudioUtil::getRootDir() . "/plugins/appFlowerStudioPlugin/modules/appFlowerStudio/templates/_{$helper}Helper.php";
                
                $_helper = (file_exists($engine_helper)) ? file_get_contents($engine_helper, true) : '';
                
                $fp = fopen($filePath,"w");
                fWrite($fp, $_helper);
                fclose($fp);
            } catch (Exception $e) {
                $result = false;
                $message = 'Error while saving file to disk!';
            }
            
            $message = 'File created successfully';
        }
        
        return afResponseHelper::create()->success($result)->message($message);
    }
    
    /**
     * Saving helper file
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processSaveHelper()
    {
        $result = true;
        $JDATA = file_get_contents("php://input");
        
        $helper = $this->getParameter('helper');
        $place = $this->getParameter('place', 'frontend');
        $place_type = $this->getParameter('place_type', 'app');
        
        $filePath = afStudioUtil::getRootDir() . "/{$place_type}s/{$place}/lib/helper/{$helper}Helper.php";
        try {
            $fp = fopen($filePath, "w");
            if (!$fp) throw new Exception("file open error");
            if (!fWrite($fp, $JDATA)) throw new Exception("file write error");
            if (!fclose($fp)) throw new Exception("file close error");
        } catch (Exception $e) {
            $result = false;
        }
        
        if ($result) {
            $success = true;
            $message = 'File saved successfully';
            
            afsNotificationPeer::log("File saved successfully [{$filePath}]", $helper);
        } else {
            $success = false;
            $message =  'Error while saving file to disk!';
            
            afsNotificationPeer::log("Error while saving file to disk! [{$filePath}]", $helper);
        }
        
        return afResponseHelper::create()->success($success)->message($message);
    }
    
}
