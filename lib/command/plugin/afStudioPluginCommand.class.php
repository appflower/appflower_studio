<?php
/**
 * Studio Plugin Command Class
 *
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioPluginCommand extends afBaseStudioCommand
{
	/**
	 * Get list action
	 */
	protected function processGetList()
	{
	    $root_dir = afStudioUtil::getRootDir();
	    
	    $datas = array();
		$pluginFolders = $this->getSubFolders("{$root_dir}/plugins", 'plugin');
		        
		foreach ($pluginFolders as $pluginFolder) {
			$plugin = $pluginFolder["text"];
			$moduleFolders = $this->getSubFolders("{$root_dir}/plugins/{$plugin}/modules/");

			$mod_datas = array();
			
			foreach ($moduleFolders as $moduleFolder) {
				$modulename = $moduleFolder["text"];
				$configfiles = $this->getFiles($plugin, $modulename, ".xml");
				if (count($configfiles) > 0) {
					$moduleFolder["children"] = $configfiles;
					array_push($mod_datas, $moduleFolder);
				}
			}

            // if (count($mod_datas) > 0) {
				$pluginFolder["children"] = $mod_datas;
				array_push($datas, $pluginFolder);
            // }
            
		}
		
		if (count($datas) > 0) {
			$this->result = $datas;
		} else {
            $this->result = array('success' => true);
	    }
	}
	
	/**
	 * Rename plugin functionality
	 */
	protected function processRenamePlugin()
	{
	    $filesystem = new sfFileSystem();
	    $afConsole = afStudioConsole::getInstance();
	    
	    $root_dir = afStudioUtil::getRootDir();
	    
	    $oldValue = $this->getParameter('oldValue');
		$newValue = $this->getParameter('newValue');
		
		$console = $afConsole->execute('afs fix-perms');
		
		$oldModuleDir = $root_dir . '/plugins/' . $oldValue . '/';
		$newModuleDir = $root_dir . '/plugins/' . $newValue . '/';
		
		$filesystem->rename($oldModuleDir, $newModuleDir);
		
		if (!file_exists($oldModuleDir) && file_exists($newModuleDir)) {			
			$console .= $afConsole->execute('sf cc');
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Renamed plugin from <b>{$oldValue}</b> to <b>{$newValue}</b>!")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("Can't rename plugin from <b>{$oldValue}</b> to <b>{$newValue}</b>!");
		                        
	    }
	    
	    $this->result = $this->result->asArray();
	}
	
	/**
	 * Delete plugin
	 */
	protected function processDeletePlugin()
	{
	    $name = $this->getParameter('name');
	    
	    $pluginDir = afStudioUtil::getRootDir() . '/plugins/' . $name . '/';
		
		$afConsole = afStudioConsole::getInstance();
		
		$console = $afConsole->execute('afs fix-perms');
		$console .= $afConsole->execute('rm -rf '.$pluginDir);
		
		if (!file_exists($pluginDir)) {	
			$console .= $afConsole->execute('sf cc');		
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Deleted plugin <b>{$name}</b>")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("Can't delete plugin <b>{$name}</b>!");
	    }
	    
	    $this->result = $this->result->asArray();
	}
	
	/**
	 * Rename module
	 */
	protected function processRenameModule()
	{
	    $oldValue = $this->getParameter('oldValue');
		$newValue = $this->getParameter('newValue');
		$pluginName = $this->getParameter('pluginName');
		
		$filesystem = new sfFileSystem();
		$afConsole = afStudioConsole::getInstance();
		
		$console = $afConsole->execute('afs fix-perms');
		
		$oldModuleDir = afStudioUtil::getRootDir() . '/plugins/' . $pluginName . '/modules/' . $oldValue . '/';
		$newModuleDir = afStudioUtil::getRootDir() . '/plugins/' . $pluginName . '/modules/' . $newValue . '/';
		
		$filesystem->rename($oldModuleDir, $newModuleDir);
		
		if (!file_exists($oldModuleDir) && file_exists($newModuleDir)) {			
			$console .= $afConsole->execute('sf cc');
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Renamed module from <b>{$oldValue}</b> to <b>{$newValue}</b>!")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("Can't rename module from <b>{$oldValue}</b> to <b>{$newValue}</b>!");
	    }
	    
	    $this->result = $this->result->asArray();
	}
	
	/**
	 * Delete module 
	 */
	protected function processDeleteModule()
	{
	    $moduleName = $this->getParameter('moduleName');
		$pluginName = $this->getParameter('pluginName');
		
		$moduleDir = afStudioUtil::getRootDir() . '/plugins/' . $pluginName . '/modules/' . $moduleName . '/';
		
		$afConsole = afStudioConsole::getInstance();
		
		$console = $afConsole->execute(array(
		    'afs fix-perms',
		    "rm -rf {$moduleDir}"
		));
		
		if (!file_exists($moduleDir)) {	
			$console .= $afConsole->execute('sf cc');		
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Deleted module <b>{$moduleName}</b>")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("Can't delete module <b>{$moduleName}</b>!");
		}
		
		$this->result = $this->result->asArray();
	}
	
	/**
	 * Rename xml
	 */
	protected function processRenameXml()
	{
	    $oldValue = $this->getParameter('oldValue');
		$newValue = $this->getParameter('newValue');
		$pluginName = $this->getParameter('pluginName');
		$moduleName = $this->getParameter('moduleName');
		
		$filesystem = new sfFileSystem();
		$afConsole = afStudioConsole::getInstance();
		
		$console = $afConsole->execute('afs fix-perms');
		
		$oldName = afStudioUtil::getRootDir() . '/plugins/' . $pluginName . '/modules/' . $moduleName . '/config/' . $oldValue;
		$newName = afStudioUtil::getRootDir() . '/plugins/' . $pluginName . '/modules/' . $moduleName . '/config/' . $newValue;
		
		$filesystem->rename($oldName, $newName);
		
		if (!file_exists($oldName) && file_exists($newName)) {			
			$console .= $afConsole->execute('sf cc');
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Renamed page from <b>{$oldValue}</b> to <b>{$newValue}</b>!")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("Can't rename page from <b>{$oldValue}</b> to <b>{$newValue}</b>!");
		}
		
		$this->result = $this->result->asArray();
	}
	
	/**
	 * Delete xml
	 */
	protected function processDeleteXml()
	{
	    $moduleName = $this->getParameter('moduleName');
		$pluginName = $this->getParameter('pluginName');
		$xmlName = $this->getParameter('xmlName');
		
		$root = afStudioUtil::getRootDir();
		$afConsole = afStudioConsole::getInstance();
		
		$xmlDir = "{$root}/plugins/{$pluginName}/modules/{$moduleName}/config/{$xmlName}";
		
		$console = $afConsole->execute(array(
            'afs fix-perms',
            "rm -rf {$xmlDir}"
		));
		
		if (!file_exists($xmlDir)) {	
			$console .= $afConsole->execute('sf cc');		
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Deleted page <b>{$xmlName}</b>")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("Can't delete page <b>{$xmlName}</b>!");
		}
		
		$this->result = $this->result->asArray();
	}
	
	/**
	 * Add plugin functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processAddPlugin()
	{
	    $name = $this->getParameter('name');
	    
	    $filesystem = new sfFileSystem();
	    
	    $root = sfConfig::get('sf_root_dir');
        $afConsole = afStudioConsole::getInstance();
        
		$dir = "{$root}/plugins/{$name}";
		
		if (!empty($name)) {
		    if (substr($name, -6) == 'Plugin') {
		        
		        if (!file_exists($dir)) {
                    $dirs = array(
                        $dir,
                        "{$dir}/config",
                        "{$dir}/modules",
                        // "{$dir}/lib",
                    );

                    // Should be changed when security policy will be reviewed
                    $dirs = implode(' ', $dirs);
                    $console = $afConsole->execute("mkdir -m 775 {$dirs}");

                    if (file_exists($dir)) {
                        // create config file with auto enable all modules in current plugin
                        $created = afStudioUtil::writeFile(
                            "{$dir}/config/config.php", 
                            afStudioPluginCommandTemplate::config($name) // Config file definition
                        );

                        $this->result = afResponseHelper::create()
                                            ->success(true)
                                            ->message("Plugin '{$name}' successfully created")
                                            ->console($console);
                    } else {
                        $this->result = afResponseHelper::create()->success(false)->message("Some problems to create dirs via console")->console($console);
                    }
        	    } else {
        	        $this->result = afResponseHelper::create()->success(false)->message("Plugin '{$name}' already exists");
        	    }
		        
		    } else {
		        $this->result = afResponseHelper::create()->success(false)->message("Plugin '{$name}' should Contains 'Plugin in the end'");
		    }
	    } else {
	        $this->result = afResponseHelper::create()->success(false)->message('Please enter plugin name');
	    }
	    
	    $this->result = $this->result->asArray();
	}
	
	/**
	 * Getting sub-folders
	 *
	 * @param string $dir 
	 * @param string $type 
	 * @return Array
	 */
	private function getSubFolders($dir, $type = 'module')
	{
		$folders = array();

		if (is_dir($dir)) {
			$handler = opendir($dir);
			
			while (($f = readdir($handler))!==false) {
				if (($f != ".") && ($f != "..") && ($f != ".svn") && is_dir($dir . '/' . $f)) {
					$folders[] = array(
					   'text' => $f,
					   'type' => $type
					);
				}
			}
		}
		
		return $folders;
	}
    
    /**
     * Getting files
     *
     * @param string $plugin 
     * @param string $modulename 
     * @param string $pro_name 
     * @return Array
     */
	private function getFiles($plugin, $modulename, $pro_name)
	{
		$root_dir = afStudioUtil::getRootDir();
		
		$dir = "{$root_dir}/plugins/{$plugin}/modules/{$modulename}/config/";
		
		$base_mod_dir   = "{$root_dir}/apps/{$plugin}/modules/{$modulename}";
		$securityPath   = "{$base_mod_dir}/config/security.yml";
		$actionPath     = "{$base_mod_dir}/actions/actions.class.php";
		
		$files = array();
		
		if (is_dir($dir)) {
			$handler = opendir($dir);
			
			while (($f = readdir($handler)) !== false) {
				if (!is_dir($dir . $f) && strpos($f, $pro_name) > 0) {
				    
				    $files[] = array(
				        'text'          => $f,
				        'type'          => 'xml',
				        'widgetUri'     => $modulename . '/' . str_replace('.xml', '', $f),
				        'securityPath'  => $securityPath,
				        'actionPath'    => $actionPath,
				        'leaf'          => true
				    );
				}
			}
		}
		
		return $files;
	}
    
}
