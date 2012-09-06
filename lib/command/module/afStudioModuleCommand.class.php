<?php

require_once dirname(__DIR__) . '/../vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'AppFlower\Studio' => dirname(__DIR__) . '/vendor',
));
$loader->register();

use AppFlower\Studio\Filesystem\Permissions;

/**
 * Studio Module Command Class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModuleCommand extends afBaseStudioCommand
{
    /**
     * Get module list
     * 
     * @return afResponse
     */
    protected function processGetList()
    {
        $root = afStudioUtil::getRootDir();
        
        $data = array();
        $apps = afStudioUtil::getDirectories("{$root}/apps/", true);
        
        $i = 0;
        foreach ($apps as $app) {
            $data[$i]['text'] = $app;
            $data[$i]['type'] = 'app';
            
            foreach (afStudioUtil::getDirectories("{$root}/apps/{$app}/modules/", true) as $module) {
                $data[$i]['children'][] = afStudioModuleCommandHelper::getModuleInfo($module, $app);
            }
            $i++;
        }
        
        return afResponseHelper::create()->success(true)->data(array(), $data, 0);
    }
    
    /**
     * Add module functionality
     * 
     * controller for different adding type
     * @example: place = frontend, name = name of module that will be added to place, type = app   (will be generated inside frontend application)
     *           place = CreatedPlugin, name = module name, type = plugin (will be generated inside plugin)
     * @return afResponse
     * @author Sergey Startsev 
     */
    protected function processAdd()
    {
        $type   = $this->getParameter('type');
        $place  = $this->getParameter('place');
        $name   = $this->getParameter('name');

        $permissions = new Permissions();

        $is_writable = $permissions->isWritable(sfConfig::get('sf_apps_dir').'/'.$place.'/modules/');

        if ($is_writable !== true) {
            return $is_writable;
        }

        if (!afStudioModuleCommandHelper::isValidName($name)) {
             return afResponseHelper::create()->success(false)->message("Module name not valid, should contains only upper and lower case alphabet characters");
        }
        
        if ($place && $name && $type) {
            $method = 'addTo' . ucfirst($type);
            if (!method_exists($this, $method)) throw new afStudioModuleCommandException("You should create method for '{$type}' type in add processing");
            
            return call_user_func(array($this, $method), $place, $name);
        }
        
        return afResponseHelper::create()->success(false)->message("Can't create new module <b>{$name}</b> inside <b>{$place}</b> {$type}!");
    }
    
    /**
     * Delete module functionality
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processDelete()
    {
        $type   = $this->getParameter('type');
        $place  = $this->getParameter('place');
        $name   = $this->getParameter('name');

        $permissions = new Permissions();

        $are_writable = $permissions->areWritable(array(
            sfConfig::get('sf_apps_dir').'/'.$place.'/modules/',
            sfConfig::get('sf_apps_dir').'/'.$place.'/modules/'.$name,
        ));

        if ($are_writable !== true) {
            return $are_writable;
        }

        $response = afResponseHelper::create();
        $console = afStudioConsole::getInstance();
        
        if (!$type || !$place || !$name) return $response->success(false)->message("Can't delete module <b>{$name}</b> inside <b>{$place}</b> {$type}!");
        
        $moduleDir = afStudioUtil::getRootDir() . "/{$type}s/{$place}/modules/{$name}/";
        
        afsFileSystem::create()->remove($moduleDir);
        
        if (file_exists($moduleDir)) return $response->success(false)->message("Can't delete module <b>{$name}</b> inside <b>{$place}</b> {$type}!");
        
        return $response->success(true)->message("Deleted module <b>{$name}</b> inside <b>{$place}</b> {$type}!")->console($console->execute('sf cc'));
    }
    
    /**
     * Rename module functionality
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processRename()
    {
        $type    = $this->getParameter('type');
        $place   = $this->getParameter('place');
        $name    = $this->getParameter('name');
        $renamed = $this->getParameter('renamed');

        $permissions = new Permissions();

        $is_writable = $permissions->isWritable(sfConfig::get('sf_apps_dir').'/'.$place.'/modules/');

        if ($is_writable !== true) {
            return $is_writable;
        }

        $response = afResponseHelper::create();
        $root = afStudioUtil::getRootDir();
        
        if (!afStudioModuleCommandHelper::isValidName($renamed)) {
             return afResponseHelper::create()->success(false)->message("Module name not valid, should contains only upper and lower case alphabet characters");
        }
        
        $oldDir = "{$root}/{$type}s/{$place}/modules/{$name}/";
        $newDir = "{$root}/{$type}s/{$place}/modules/{$renamed}/";
        
        if (file_exists($newDir)) return $response->success(false)->message("Module <b>{$renamed}</b> already exists inside <b>{$place}</b> {$type}!");
        
        afsFileSystem::create()->rename($oldDir, $newDir);
        
        // Rename in actions class 
        afStudioModuleCommandHelper::renameAction($name, $renamed, $place, $type);
        
        if (!file_exists($oldDir) && file_exists($newDir)) {
            $console = afStudioConsole::getInstance()->execute(array(
                'afs fix-perms',
                'sf cc',
            ));
            return $response->success(true)->message("Renamed module from <b>{$name}</b> to <b>{$renamed}</b> inside <b>{$place}</b> {$type}!")->console($console);
        }
        
        return $response->success(false)->message("Can't rename module from <b>{$name}</b> to <b>{$renamed}</b> inside <b>{$place}</b> {$type}!");
    }
    
    /**
     * Set wdiget as homepage functionality
     * 
     * @return afResponse
     * @author Lukasz Wojciechowski
     */
    protected function processSetAsHomepage()
    {
        $widgetUri  = $this->getParameter('widgetUri');

        $permissions = new Permissions();

        $is_readable_and_writable = $permissions->isReadableAndWritable(sfConfig::get('sf_apps_dir').'/frontend/config/routing.yml');

        if ($is_readable_and_writable !== true) {
            return $is_readable_and_writable;
        }

        $response   = afResponseHelper::create();
        $rm         = new RoutingConfigurationManager;
        
        if ($rm->setHomepageUrlFromWidgetUri($widgetUri)) {
            return $response->success(true)->message("Homepage for your project is now set to <b>{$widgetUri}</b>");
        }
        
        return $response->success(false)->message("Can't set <b>{$widgetUri}</b> as homepage. An error occured.");
    }
    
    /**
     * Get grouped list for applications and plugins 
     * 
     * @example by request parameter 'type' separated to get list grouped modules:  type = app, or type = plugin
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGetGrouped()
    {
        $type = $this->getParameter('type', array(afStudioModuleCommandHelper::TYPE_APPLICATION, afStudioModuleCommandHelper::TYPE_PLUGIN));
        
        $data = array();
        if (is_array($type)) {
            foreach ($type as $type_value) $data = array_merge($data, afStudioModuleCommandHelper::getGroupedList($type_value));
        } else {
            $data = afStudioModuleCommandHelper::getGroupedList($type);
        }
        
        return afResponseHelper::create()->success(true)->data((isset($data[0])) ? array_keys($data[0]) : array(), $data, count($data));
    }
    
    /**
     * Adding new module to plugin functionality
     *
     * @param string $plugin - plugin name that will contain new module
     * @param string $name - module name
     * @return afResponse
     * @author Sergey Startsev
     */
    private function addToPlugin($plugin, $module)
    {
        afStudioModuleCommandHelper::load('plugin');
        $response = afResponseHelper::create();
        
        if (!afStudioPluginCommandHelper::isExists(afStudioPluginCommandHelper::PLUGIN_GENERATE_MODULES)) {
            return $response->success(false)->message("For creating module in plugins should be installed '". afStudioPluginCommandHelper::PLUGIN_GENERATE_MODULES ."' plugin");
        }
        
        $afConsole = afStudioConsole::getInstance();
        
        if (!$plugin || !$module) return $response->success(false)->message("Can't create new module <b>{$module}</b> inside <b>{$plugin}</b> plugin!");
        if (!afStudioPluginCommandHelper::isExists($plugin)) return $response->success(false)->message("Plugin '{$plugin}' doesn't exists");
        
        $console = $afConsole->execute("sf generate:plugin-module {$plugin} {$module}");
        $isCreated = $afConsole->wasLastCommandSuccessfull();
        
        if ($isCreated) {
            afsFileSystem::create()->chmod(sfConfig::get('sf_plugins_dir') . "/{$plugin}/modules/{$module}", 0664, 0000, true);
            
            $console .= $afConsole->execute('sf cc');
            $message = "Created module <b>{$module}</b> inside <b>{$plugin}</b> plugin!";
        } else {
            $message = "Could not create module <b>{$module}</b> inside <b>{$plugin}</b> plugin!";
        }
        
        return $response->success($isCreated)->message($message)->console($console);
    }
    
    /**
     * Adding to module functionality
     *
     * @param string $application - application name 
     * @param string $name - module name
     * @return afResponse
     * @author Sergey Startsev
     */
    private function addToApp($application, $module)
    {
        $afConsole = afStudioConsole::getInstance();
        
        if (!$application || !$module) {
            return afResponseHelper::create()->success(false)->message("Can't create new module <b>{$module}</b> inside <b>{$application}</b> application!");
        }
        
        $console = $afConsole->execute("sf generate:module {$application} {$module}");
        $isCreated = $afConsole->wasLastCommandSuccessfull();
        
        if ($isCreated) {
            $console .= $afConsole->execute('sf cc');
            $message = "Created module <b>{$module}</b> inside <b>{$application}</b> application!";
        } else {
            $message = "Could not create module <b>{$module}</b> inside <b>{$application}</b> application!";
        }
        
        return afResponseHelper::create()->success($isCreated)->message($message)->console($console);
    }
    
}
