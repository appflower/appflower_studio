<?php

require_once dirname(__DIR__) . '/../vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'AppFlower\Studio' => dirname(__DIR__) . '/vendor',
));
$loader->register();

use AppFlower\Studio\Filesystem\Permissions;

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
        $dir_name = pathinfo($dir, PATHINFO_BASENAME);
        
        if (file_exists($dir)) return afResponseHelper::create()->success(false)->message("Directory '{$dir_name}' already exists. Please choose another one.");
        
        if (!Util::makeDirectory($dir)) {
            $message = afStudioFileCommandHelper::checkFolder($dir_path);
            $message = (is_string($message)) ? $message : "Cannot create directory {$dir_path}";
            
            return afResponseHelper::create()->success(false)->message($message);
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
        $file_name = pathinfo($file, PATHINFO_BASENAME);
        
        if (file_exists($file)) return afResponseHelper::create()->success(false)->message("File '{$file_name}' already exists. Please choose another one.");
        
        if (!Util::makeFile($file)) {
            $message = afStudioFileCommandHelper::checkFolder($file_path);
            $message = (is_string($message)) ? $message : "Cannot create file {$file_path}";
            
            return afResponseHelper::create()->success(false)->message($message);
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

        $permissions = new Permissions();

        $is_writable = $permissions->isWritable(dirname($file));

        if ($is_writable !== true) {
            return $is_writable;
        }

        if (!Util::removeResource($file)) {
            $message = afStudioFileCommandHelper::checkFolder($file_path);
            $message = (is_string($message)) ? $message : 'Cannot delete '. (is_file($file) ? 'file' : 'directory') . ' ' . $file_path;
            
            return afResponseHelper::create()->success(false)->message($message);
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
        
        $new_name = pathinfo($new, PATHINFO_BASENAME);
        
        if (file_exists($new)) return afResponseHelper::create()->success(false)->message("Resource '{$new_name}' already exists. Please choose another one.");
        
        if (!Util::renameResource($old, $new)) {
            $message = afStudioFileCommandHelper::checkFolder($new);
            $message = (is_string($message)) ? $message : 'Cannot rename ' . (is_file($old) ? 'file' : 'directory') . ' ' . $oldname;
            
            return afResponseHelper::create()->success(false)->message($message);
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
        
        $message = afStudioFileCommandHelper::checkFolder($path);
        if (is_string($message)) return afResponseHelper::create()->success(false)->message($message);
        
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
        
        $file = (substr($file, 0, 4) == 'root') ? afStudioUtil::getRootDir() . substr($file, 4) : $file;
        
        $response = afResponseHelper::create();
        
        if ($is_post) {
            if ($file && is_string($code) && is_writable($file) && (afStudioUtil::writeFile($file, $code) !== false)) return $response->success(true);
            
            return $response->success(false);
        }
        
        if ($file && is_string($file_content = @file_get_contents($file))) return $response->success(true)->data(array(), $file_content, 0);
        
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
        $filesystem = afsFileSystem::create();
        
        $helper = $this->getParameter('helper');
        $place = $this->getParameter('place', 'frontend');
        $place_type = $this->getParameter('place_type', 'app');
        
        $helper_folder_path = afStudioUtil::getRootDir() . "/{$place_type}s/{$place}/lib/helper";
        if (!file_exists($helper_folder_path)) {
            $filesystem->mkdirs($helper_folder_path);
            $filesystem->chmod($helper_folder_path, 0777);
        }
        
        $filePath = "{$helper_folder_path}/{$helper}Helper.php";
        
        if (!file_exists($filePath)) {
            try{
                $engine_helper = afStudioUtil::getRootDir() . "/plugins/appFlowerStudioPlugin/modules/appFlowerStudio/templates/_{$helper}Helper.php";
                
                $_helper = (file_exists($engine_helper)) ? file_get_contents($engine_helper, true) : '';
                
                $fp = fopen($filePath,"w");
                fWrite($fp, $_helper);
                fclose($fp);
                $filesystem->chmod($filePath, 0777);
            } catch (Exception $e) {
                $result = false;
                $message = 'Error while saving file to disk!';
            }
            
            $message = 'File created successfully';
        }
        
        return afResponseHelper::create()->success($result)->message($message);
    }
    
    /**
     * Extract archive functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processUnarchive()
    {
        $file = $this->getParameter('file');
        $file = (substr($file, 0, 4) == 'root') ? str_replace('root', afStudioUtil::getRootDir(), substr($file, 0, 4)) . substr($file, 4) : $file;
        
        if (!file_exists($file)) return afResponseHelper::create()->success(false)->message("File that you try to extract doesn't exists"); 
        
        $arch = new Archive_Tar("{$file}", 'gz');
        $status = $arch->extract(dirname($file));
        
        return afResponseHelper::create()->success($status)->message(($status) ? "File has been successfully extracted" : "File can't be extracted");
    }
    
}
