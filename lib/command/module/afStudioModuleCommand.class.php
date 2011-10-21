<?php
/**
 * Studio Module Command Class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModuleCommand extends afBaseStudioCommand
{
    /**
     * Application type
     */
    const TYPE_APPLICATION = 'app';
    
    /**
     * Plugin type
     */
    const TYPE_PLUGIN = 'plugin';
    
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
        
        $response = afResponseHelper::create();
        $root = afStudioUtil::getRootDir();
        
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
        $type = $this->getParameter('type', self::TYPE_APPLICATION);
        
        $root = afStudioUtil::getRootDir();
        $places = afStudioUtil::getDirectories("{$root}/{$type}s/", true);
        
        $data = array();
        foreach($places as $place) {
            $modules = afStudioUtil::getDirectories("{$root}/{$type}s/{$place}/modules/", true);
            
            foreach($modules as $module) {
                $data[] = array(
                    'value' => $module,
                    'text'  => $module,
                    'group' => $place
                );
            }
        }
        
        $meta = (isset($data[0])) ? array_keys($data[0]) : array();
        $total = count($data);
        
        return afResponseHelper::create()->success(true)->data($meta, $data, $total);
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
