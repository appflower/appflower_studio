<?php

require_once dirname(__DIR__) . '/../vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'AppFlower\Studio' => dirname(__DIR__) . '/vendor',
));
$loader->register();

use AppFlower\Studio\Filesystem\Permissions;

/**
 * Studio Plugin Command Class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioPluginCommand extends afBaseStudioCommand
{
    /**
     * Get list modules, actions 
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGetList()
    {
        $root_dir = afStudioUtil::getRootDir();
        
        $data = array();
        $pluginFolders = afStudioPluginCommandHelper::getSubFolders("{$root_dir}/plugins", 'plugin');
        
        $deprecated = afStudioPluginCommandHelper::getDeprecatedList();
        
        foreach ($pluginFolders as $pluginFolder) {
            $plugin = $pluginFolder["text"];
            
            if (in_array($plugin, $deprecated)) continue;
            
            $moduleFolders = afStudioPluginCommandHelper::getSubFolders("{$root_dir}/plugins/{$plugin}/modules/");
            $mod_datas = array();
            
            foreach ($moduleFolders as $moduleFolder) {
                $modulename = $moduleFolder["text"];
                $configfiles = afStudioPluginCommandHelper::getFiles($plugin, $modulename, ".xml");
                
                $moduleFolder["children"] = $configfiles;
                if (count($configfiles) == 0) {
                    $moduleFolder["leaf"] = true;
                    $moduleFolder["iconCls"] = "icon-folder";
                }
                array_push($mod_datas, $moduleFolder);
            }
            
            $pluginFolder["children"] = $mod_datas;
            if (count($mod_datas) == 0) {
                $pluginFolder["leaf"] = true;
                $pluginFolder["iconCls"] = "icon-folder";
            }
            array_push($data, $pluginFolder);
        }
        
        $meta = (isset($data[0])) ? array_keys($data[0]) : array();
        $total = count($data);
        
        return afResponseHelper::create()->success(true)->data($meta, $data, $total);
    }
    
    /**
     * Rename plugin functionality
     * 
     * @return afResponse
     */
    protected function processRename()
    {
        $response = afResponseHelper::create();
        $root_dir = afStudioUtil::getRootDir();

        $permissions = new Permissions();

        $are_writable = $permissions->areWritable(array(
            $root_dir."/plugins/",
        ));

        if ($are_writable !== true) {
            return $are_writable;
        }

        $oldValue = $this->getParameter('oldValue');
        $newValue = $this->getParameter('newValue');
        
        $oldDir = "{$root_dir}/plugins/{$oldValue}/";
        $newDir = "{$root_dir}/plugins/{$newValue}/";
        
        if (file_exists($newDir)) return $response->success(false)->message("Plugin '{$newValue}' already exists");
        
        afsFileSystem::create()->rename($oldDir, $newDir);
        
        if (!file_exists($oldDir) && file_exists($newDir)) {
            $console_result = afStudioConsole::getInstance()->execute(array(
                'afs fix-perms',
                'sf cc',
            ));
            
            return $response->success(true)->message("Renamed plugin from <b>{$oldValue}</b> to <b>{$newValue}</b>!")->console($console_result);
        }
        
        return $response->success(false)->message("Can't rename plugin from <b>{$oldValue}</b> to <b>{$newValue}</b>!");
    }
    
    /**
     * Delete plugin
     * 
     * @return afResponse
     */
    protected function processDelete()
    {
        $name = $this->getParameter('name');
        
        $pluginDir = afStudioUtil::getRootDir() . "/plugins/{$name}/";
        $response = afResponseHelper::create();

        $permissions = new Permissions();

        $are_writable = $permissions->areWritable(array(
            afStudioUtil::getRootDir()."/plugins/",
            $pluginDir,
        ));

        if ($are_writable !== true) {
            return $are_writable;
        }

        afsFileSystem::create()->remove($pluginDir);
        if (!file_exists($pluginDir)) {
            $console_result = afStudioConsole::getInstance()->execute(array(
                'afs fix-perms',
                'sf cc',
            ));
            return $response->success(true)->message("Deleted plugin <b>{$name}</b>")->console($console_result);
        }
        
        return $response->success(false)->message("Can't delete plugin <b>{$name}</b>!");
    }
    
    /**
     * Add plugin functionality
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processAdd()
    {
        $name = $this->getParameter('name');
        
        $root       = sfConfig::get('sf_root_dir');
        $console    = afStudioConsole::getInstance();
        $response   = afResponseHelper::create();
        $filesystem = afsFileSystem::create();

        $permissions = new Permissions();

        $are_writable = $permissions->areWritable(array(
            $root."/plugins/",
        ));

        if ($are_writable !== true) {
            return $are_writable;
        }

        $dir = "{$root}/plugins/{$name}";
        
        if (empty($name)) return $response->success(false)->message('Please enter plugin name');
        if (substr($name, -6) != 'Plugin') return $response->success(false)->message("Plugin '{$name}' should Contains 'Plugin' in the end");
        if (file_exists($dir)) return $response->success(false)->message("Plugin '{$name}' already exists");
        
        $dirs = array(
            $dir,
            "{$dir}/config",
            "{$dir}/modules",
        );
        foreach ($dirs as $dir) $filesystem->mkdirs($dir);
        
        if (file_exists($dir)) {
            // create config file with auto enable all modules in current plugin
            $created = afStudioUtil::writeFile("{$dir}/config/config.php", afStudioPluginCommandTemplate::config($name));
            
            $console_result = $console->execute(array(
                'afs fix-perms',
                'sf cc',
            ));
            
            return $response->success(true)->message("Plugin '{$name}' successfully created")->console($console_result);
        }
        
        return $response->success(false)->message("Some problems to create dirs, please check permissions, and run fix-perms task");
    }
    
}
