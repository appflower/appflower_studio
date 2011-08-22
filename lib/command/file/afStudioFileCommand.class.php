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
     */
    protected function processGet()
    {
        $path = $this->hasParameter('path') ? str_replace('root', afStudioUtil::getRootDir(), $this->getParameter('path')) : null;
        $files = sfFinder::type('any')->ignore_version_control()->maxdepth(0)->in($path);
        
        if (count($files) > 0) {
            foreach ($files as $file) {
                $this->result[] = array(
                    'text' => basename($file),
                    'leaf' => (is_file($file) ? true : false)
                );
            }
        } else {
            $this->result = array('success' => true);
        }
    }
    
    /**
     * Create new dir
     */
    protected function processNewdir()
    {
        $dir = $this->hasParameter('dir') ? str_replace('root', afStudioUtil::getRootDir(), $this->getParameter('dir')) : null;
        
        if (!Util::makeDirectory($dir)) {
            $this->result = array(
                'success' => false,
                'error' => 'Cannot create directory ' . $this->getParameter('dir')
            );
        }
        
        return array('success' => true);
    }
    
    /**
     * Create new file
     */
    protected function processNewfile()
    {
        $file = $this->hasParameter('file') ? str_replace('root', afStudioUtil::getRootDir(), $this->getParameter('file')) : null;
        
        if (!Util::makeFile($file)) {
            $this->result = array(
                'success' => false, 
                'error' => 'Cannot create file ' . $this->getParameter('file')
            );
        }
        
        return array('success' => true);
    }
    
    /**
     * Delete file 
     */
    protected function processDelete()
    {
        $file = $this->hasParameter('file') ? str_replace('root', afStudioUtil::getRootDir(), $this->getParameter('file')) : null;
        
        if (!Util::removeResource($file)) {
            $this->result = array(
                'success' => false,
                'error' => 'Cannot delete ' . (is_file($file) ? 'file' : 'directory') . ' ' . $this->getParameter('file')
            );
        }
        
        return array('success' => true);
    }
    
    /**
     * Rename file
     */
    protected function processRename()
    {
        $new = $this->hasParameter('newname') ? str_replace('root', afStudioUtil::getRootDir(), $this->getParameter('newname')) : null;
        $old = $this->hasParameter('oldname') ? str_replace('root', afStudioUtil::getRootDir(), $this->getParameter('oldname')) : null;
        
        if (!Util::renameResource($old, $new)) {
            $this->result = array(
                'success' => false,
                'error' => 'Cannot rename ' . (is_file($old) ? 'file' : 'directory') . ' ' . $this->getParameter('oldname')
            );
        }
        
        return array('success' => true);
    }
    
    /**
     * Upload files
     */
    protected function processUpload()
    {
        $path = $this->hasParameter('path') ? str_replace('root', afStudioUtil::getRootDir(), $this->getParameter('path')) : null;
        
        if (!empty($_FILES)) {
            foreach ($_FILES as $file => $params) {
                if ($params['size'] > 0) {
                    $extension = substr($params['name'], strrpos($params['name'], '.') + 1);
                    
                    $fileName = Util::stripText(substr($params['name'], 0, (strlen($params['name']) - strlen($extension) - 1))) . '.' . $extension;
                    
                    if (!$this->request->moveFile($file, "{$path}/{$fileName}", 0777)) $errors[$file] = 'File upload error';
                }
            }
        }
        
        if (isset($errors)) return array('success' => false, 'errors' => $errors);
        
        return array('success' => true);
    }
    
}
