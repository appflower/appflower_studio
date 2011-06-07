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
				
				$xmlNames = afStudioUtil::getFiles("{$root}/apps/{$app}/modules/{$module}/config/", true, "xml");
                $xmlPaths = afStudioUtil::getFiles("{$root}/apps/{$app}/modules/{$module}/config/", false, "xml");
                                            
                $securityPath = "{$root}/apps/{$app}/modules/{$module}/config/security.yml";
                $actionPath = "{$root}/apps/{$app}/modules/{$module}/actions/actions.class.php";
                
                $k = 0;
				
				$data[$i]['children'][$j]['type'] = 'module';
				$data[$i]['children'][$j]['app'] = $app;

				if (count($xmlNames) > 0) {
					$data[$i]['children'][$j]['leaf'] = false;
					
					foreach ($xmlNames as $xk => $xmlName) {
					    $data[$i]['children'][$j]['children'][$k] = array(
					        'app'           => $app,
					        'module'        => $module,
					        'widgetUri'     => $module . '/' . str_replace('.xml', '', $xmlName),
					        'type'          => 'xml',
					        'text'          => $xmlName,
					        'securityPath'  => $securityPath,
					        'xmlPath'       => $xmlPaths[$xk],
					        'actionPath'    => $actionPath,
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
    		$afConsole->execute(
    		    "mv {$oldDir} {$newDir}"
    		);
            
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
     * Get grouped list 
     */
    protected function processGetGrouped()
    {
        $root = afStudioUtil::getRootDir();
		$apps = afStudioUtil::getDirectories("{$root}/apps/", true);
		
		$data = array();
		foreach($apps as $app) {
			$modules = afStudioUtil::getDirectories("{$root}/apps/{$app}/modules/", true);
			
			foreach($modules as $module) {
				$data[] = array(
				    'value' => $module,
				    'text'  => $module,
				    'group' =>$app
				);
			}
		}
		
		if (count($data) > 0) {
			$this->result = $data;
		} else {
		    $this->result = array('success' => true);
		}
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
		                    ->message("For creating modules in plugin you should install '" . afStudioPluginModuleHelper::PLUGIN_GENERATE_MODULE . "' plugin");
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
    
}
