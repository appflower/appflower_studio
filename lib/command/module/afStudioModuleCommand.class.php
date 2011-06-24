<?php
/**
 * Studio Module Command Class
 *
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
															
			$modules = afStudioUtil::getDirectories("{$root}/apps/{$app}/modules/", true);
			
			$j = 0;
			
			foreach ($modules as $module) {
				$data[$i]['children'][$j]['text'] = $module;
				$module_dir = "{$root}/apps/{$app}/modules/{$module}";
				
				$xmlNames = afStudioUtil::getFiles("{$module_dir}/config/", true, "xml");
                $xmlPaths = afStudioUtil::getFiles("{$module_dir}/config/", false, "xml");
                                            
                $securityPath = "{$module_dir}/config/security.yml";
                $defaultActionPath = "{$module_dir}/actions/actions.class.php";
                
                $k = 0;
				
				$data[$i]['children'][$j]['type'] = 'module';
				$data[$i]['children'][$j]['app'] = $app;

				if (count($xmlNames) > 0) {
					$data[$i]['children'][$j]['leaf'] = false;
					
					foreach ($xmlNames as $xk => $xmlName) {
					    $actionPath = $defaultActionPath;
					    
					    $widgetName = pathinfo($xmlName, PATHINFO_FILENAME);
					    $predictActions = "{$widgetName}Action.class.php";
					    $predictActionsPath = "{$module_dir}/actions/{$predictActions}";
					    
					    if (file_exists($predictActionsPath)) {
					        $actionPath = $predictActionsPath;
					    }
					    
					    $actionName = pathinfo($actionPath, PATHINFO_BASENAME);
					    
					    $data[$i]['children'][$j]['children'][$k] = array(
					        'app'           => $app,
					        'module'        => $module,
					        'widgetUri'     => $module . '/' . str_replace('.xml', '', $xmlName),
					        'type'          => 'xml',
					        'text'          => $xmlName,
					        'securityPath'  => $securityPath,
					        'xmlPath'       => $xmlPaths[$xk],
					        'actionPath'    => $actionPath,
					        'actionName'    => $actionName,
					        'name'          => $widgetName,
					        'leaf'          => true
					    );
					    
						$k++;
					}
				} else {
					$data[$i]['children'][$j]['leaf'] = true;
					$data[$i]['children'][$j]['iconCls'] = 'icon-folder';
				}
				
				$j++;
			}
			
			$i++;
		}
		
		if (count($data) > 0) {
			$this->result = $data;
		} else {
		    $this->result = array('success' => true);
		}
	}
	
	/**
	 * Add module functionality
	 * 
	 * controller for different adding type
	 * @example: place = frontend, name = name of module that will be added to place, type = app   (will be generated inside frontend application)
	 *           place = CreatedPlugin, name = module name, type = plugin (will be generated inside plugin)
	 * @author Sergey Startsev 
	 */
	protected function processAdd()
	{
	    $type   = $this->getParameter('type');
	    $place  = $this->getParameter('place');
	    $name   = $this->getParameter('name');
	    
	    if ($place && $name && $type) {
	        
	        $method = 'addTo' . ucfirst($type);
    	    if (method_exists($this, $method)) {
    	        $afResponse = call_user_func_array(
    	            array($this, $method), 
    	            array($place, $name)
    	        );
    	    } else {
    	        throw new afStudioModuleCommandException("You should create method for '{$type}' type in add processing");
    	    }
		} else {
			$afResponse = afResponseHelper::create()->success(false)->message("Can't create new module <b>{$name}</b> inside <b>{$place}</b> {$type}!");
		}
	    
	    $this->result = $afResponse->asArray();
	}
	
	/**
	 * Delete module functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processDelete()
	{
	    $type   = $this->getParameter('type');
	    $place  = $this->getParameter('place');
	    $name   = $this->getParameter('name');
	    
	    if ($type && $place && $name) {
	        $afConsole = afStudioConsole::getInstance();

    	    $moduleDir = afStudioUtil::getRootDir() . "/{$type}s/{$place}/modules/{$name}/";

    		$console = $afConsole->execute(array(
    		    'afs fix-perms',
    		    "rm -rf {$moduleDir}"
    		));

    		if (!file_exists($moduleDir)) {
    			$console .= $afConsole->execute('sf cc');

    			$this->result = afResponseHelper::create()
    			                    ->success(true)
    			                    ->message("Deleted module <b>{$name}</b> inside <b>{$place}</b> {$type}!")
    			                    ->console($console);
    		} else {
    		    $this->result = afResponseHelper::create(false)->message("Can't delete module <b>{$name}</b> inside <b>{$place}</b> {$type}!");
    		}
	    } else {
	        $this->result = afResponseHelper::create(false)->message("Can't delete module <b>{$name}</b> inside <b>{$place}</b> {$type}!");
	    }
	    
		$this->result = $this->result->asArray();
	}
	
	/**
	 * Rename module functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processRename()
	{
	    $type    = $this->getParameter('type');
	    $place   = $this->getParameter('place');
	    $name    = $this->getParameter('name');
	    $renamed = $this->getParameter('renamed');
	    
	    $filesystem = new sfFileSystem();
	    $root = afStudioUtil::getRootDir();
	    $afConsole = afStudioConsole::getInstance();
	    
		$console = $afConsole->execute('afs fix-perms');
		
		$oldDir = "{$root}/{$type}s/{$place}/modules/{$name}/";
		$newDir = "{$root}/{$type}s/{$place}/modules/{$renamed}/";
		
		if (!file_exists($newDir)) {
		    // $filesystem->rename($oldDir, $newDir);
    		$console .= $afConsole->execute("mv {$oldDir} {$newDir}");
    		
            // Rename in actions class 
    		$console .= $this->renameModuleAction($name, $renamed, $place, $type);
    		
    		if (!file_exists($oldDir) && file_exists($newDir)) {			
    			$console .= $afConsole->execute('sf cc');
                
    			$this->result = afResponseHelper::create()
    			                    ->success(true)
    			                    ->message("Renamed module from <b>{$name}</b> to <b>{$renamed}</b> inside <b>{$place}</b> {$type}!")
    			                    ->console($console);
    		} else {
    		    $this->result = afResponseHelper::create()
    		                        ->success(false)
    		                        ->message("Can't rename module from <b>{$name}</b> to <b>{$renamed}</b> inside <b>{$place}</b> {$type}!");
    		}
		} else {
		    $this->result = afResponseHelper::create()
		                        ->success(false)
		                        ->message("Module <b>{$renamed}</b> already exists inside <b>{$place}</b> {$type}!");
		}
        
		$this->result = $this->result->asArray();
	}
    
    /**
     * Get grouped list for applications and plugins 
     * 
     * @example by request parameter 'type' separated to get list grouped modules:  type = app, or type = plugin
     * @return array
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
		
        return afResponseHelper::create()->success(true)->data($meta, $data, $total)->asArray();		
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
        
        if (afStudioPluginCommandHelper::isExists(afStudioPluginCommandHelper::PLUGIN_GENERATE_MODULES)) {
            $afConsole = afStudioConsole::getInstance();
	        
    	    if ($plugin && $module) {
    	        if (afStudioPluginCommandHelper::isExists($plugin)) {
    	            $console = $afConsole->execute("sf generate:plugin-module {$plugin} {$module}");
                    $isCreated = $afConsole->wasLastCommandSuccessfull();
                    
                    if ($isCreated) {
                        $console .= $afConsole->execute('sf cc');
                        $message = "Created module <b>{$module}</b> inside <b>{$plugin}</b> plugin!";
                    } else {
                        $message = "Could not create module <b>{$module}</b> inside <b>{$plugin}</b> plugin!";
                    }
                    $afResponse = afResponseHelper::create()->success($isCreated)->message($message)->console($console);
    	        } else {
    	            $afResponse = afResponseHelper::create()->success(false)->message("Plugin '{$plugin}' doesn't exists");
    	        }
    		} else {
    			$afResponse = afResponseHelper::create()->success(false)->message("Can't create new module <b>{$module}</b> inside <b>{$application}</b> plugin!");
    		}
		} else {
		    $afResponse = afResponseHelper::create()
		                    ->success(false)
		                    ->message("For creating modules in plugin you should install '" . afStudioPluginCommandHelper::PLUGIN_GENERATE_MODULES . "' plugin");
		}
		
		return $afResponse;
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
	    
	    if ($application && $module) {
			$console = $afConsole->execute("sf generate:module {$application} {$module}");
            $isCreated = $afConsole->wasLastCommandSuccessfull();
            
            if ($isCreated) {
                $console .= $afConsole->execute('sf cc');		
                $message = "Created module <b>{$module}</b> inside <b>{$application}</b> application!";
            } else {
                $message = "Could not create module <b>{$module}</b> inside <b>{$application}</b> application!";
            }
			
            $afResponse = afResponseHelper::create()->success($isCreated)->message($message)->console($console);
		} else {
			$afResponse = afResponseHelper::create()->success(false)->message("Can't create new module <b>{$module}</b> inside <b>{$application}</b> application!");
		}
		
		return $afResponse;
    }
    
    /**
     * Rename module name inside actions
     *
     * @param string $name 
     * @param string $renamed 
     * @param string $place 
     * @param string $type 
     * @return string - console result
     * @author Sergey Startsev
     */
    private function renameModuleAction($name, $renamed, $place, $type)
    {
        $afConsole = afStudioConsole::getInstance();
        $root = afStudioUtil::getRootDir();
		
		$console = '';
		
		$dir = "{$root}/{$type}s/{$place}/modules/{$renamed}";
		$actionsPath = "{$dir}/actions/actions.class.php";
		
        // rename actions class
		if (file_exists($actionsPath)) {
		    $actions = file_get_contents($actionsPath);
		    $actions = str_ireplace("{$name}Actions", "{$renamed}Actions", $actions);
		    $actions = str_ireplace("@subpackage {$name}", "@subpackage {$renamed}", $actions);
		    $actions = str_ireplace("{$name} actions", "{$renamed} actions", $actions);
		    
		    afStudioUtil::writeFile($actionsPath, $actions);
		}
		
        // generated lib actions class
		$actionsLibPath = "{$dir}/lib/Base{$name}Actions.class.php";
		$actionsLibPathRenamed = "{$dir}/lib/Base{$renamed}Actions.class.php";
		
		if (file_exists($actionsLibPath)) {
		    $actions = file_get_contents($actionsLibPath);
		    $actions = str_ireplace("{$name}Actions", "{$renamed}Actions", $actions);
		    $actions = str_ireplace("@subpackage  {$name}", "@subpackage  {$renamed}", $actions);
		    $actions = str_ireplace("{$name} module", "{$renamed} module", $actions);
		    
		    afStudioUtil::writeFile($actionsLibPath, $actions);
		    
		    $console = $afConsole->execute("mv {$actionsLibPath} {$actionsLibPathRenamed}");
		}
		
		return $console;
    }
    
}
