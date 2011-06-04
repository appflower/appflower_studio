<?php
/**
 * Studio Module Command Class
 *
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModuleCommand extends afBaseStudioCommand
{
	/**
	 * Get module list
	 */
	protected function processGetList()
	{
	    $root = afStudioUtil::getRootDir();
	    
	    $data = array();
		$apps = afStudioUtil::getDirectories("{$root}/apps/", true);
							
		$i=0;
		
		foreach($apps as $app) {
			$data[$i]['text'] = $app;
			$data[$i]['type'] = 'app';
															
			$modules = afStudioUtil::getDirectories("{$root}/apps/{$app}/modules/", true);
			
			$j=0;
			
			foreach($modules as $module)
			{
				$data[$i]['children'][$j]['text']=$module;
				
				$xmlNames = afStudioUtil::getFiles("{$root}/apps/{$app}/modules/{$module}/config/", true, "xml");
                $xmlPaths = afStudioUtil::getFiles("{$root}/apps/{$app}/modules/{$module}/config/", false, "xml");
                                            
                $securityPath = "{$root}/apps/{$app}/modules/{$module}/config/security.yml";
                $actionPath = "{$root}/apps/{$app}/modules/{$module}/actions/actions.class.php";
                
                $k=0;
				
				$data[$i]['children'][$j]['type'] = 'module';
				$data[$i]['children'][$j]['app'] = $app;

				if (count($xmlNames) > 0) {
					$data[$i]['children'][$j]['leaf'] = false;
					
					foreach ($xmlNames as $xk => $xmlName) {
						$data[$i]['children'][$j]['children'][$k]['app'] = $app;
						$data[$i]['children'][$j]['children'][$k]['module'] = $module;
						$data[$i]['children'][$j]['children'][$k]['widgetUri'] = $module.'/'.str_replace('.xml', '', $xmlName);
						$data[$i]['children'][$j]['children'][$k]['type'] = 'xml';
						$data[$i]['children'][$j]['children'][$k]['text'] = $xmlName;
                        $data[$i]['children'][$j]['children'][$k]['securityPath'] = $securityPath;
						$data[$i]['children'][$j]['children'][$k]['xmlPath'] = $xmlPaths[$xk];
                        $data[$i]['children'][$j]['children'][$k]['actionPath'] = $actionPath;
						$data[$i]['children'][$j]['children'][$k]['leaf'] = true;
						
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
	 */
	protected function processAdd()
	{
	    $app = $this->getParameter('app');
	    $moduleName = $this->getParameter('name');
	    
	    $afConsole = afStudioConsole::getInstance();
	    
	    if ($app && $moduleName) {
			$console = $afConsole->execute('sf generate:module '.$app.' '.$moduleName);
            $commandOk = $afConsole->wasLastCommandSuccessfull();
            
            if ($commandOk) {
                $console .= $afConsole->execute('sf cc');		
                $message = 'Created module <b>'.$moduleName.'</b> inside <b>'.$app.'</b> application!';
            } else {
                $message = 'Could not create module <b>'.$moduleName.'</b> inside <b>'.$app.'</b> application!';
            }
			
            $this->result = afResponseHelper::create()->success($commandOk)->message($message)->console($console);
		} else {
			$this->result = afResponseHelper::create()->success(false)->message("Can't create new module <b>{$moduleName}</b> inside <b>{$app}</b> application!");
		}
		
		$this->result = $this->result->asArray();
	}
	
	/**
	 * Delete module functionality
	 */
	protected function processDelete()
	{
	    $app = $this->getParameter('app');
	    $moduleName = $this->getParameter('name');
	    
	    $afConsole = afStudioConsole::getInstance();
	    
	    $moduleDir = sfConfig::get('sf_root_dir') . "/apps/{$app}/modules/{$moduleName}/";
		
		$console = $afConsole->execute('afs fix-perms');
		$console .= $afConsole->execute("rm -rf {$moduleDir}");
		
		if (!file_exists($moduleDir)) {
			$console .= $afConsole->execute('sf cc');
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Deleted module <b>{$moduleName}</b> inside <b>{$app}</b> application!")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create(false)->message("Can't delete module <b>{$moduleName}</b> inside <b>{$app}</b> application!");
		}
		
		$this->result = $this->result->asArray();
	}
	
	/**
	 * Rename module
	 */
	protected function processRename()
	{
	    $app = $this->getParameter('app');
	    $moduleName = $this->getParameter('name');
	    $renamedModuleName = $this->getParameter('renamed');
	    
	    $filesystem = new sfFileSystem();
	    $afConsole = afStudioConsole::getInstance();
	    
		$console = $afConsole->execute('afs fix-perms');
		
		$oldModuleDir = sfConfig::get('sf_root_dir') . "/apps/{$app}/modules/{$moduleName}/";
		$newModuleDir = sfConfig::get('sf_root_dir') . "/apps/{$app}/modules/{$renamedModuleName}/";
		
		$filesystem->rename($oldModuleDir, $newModuleDir);
		
		if (!file_exists($oldModuleDir) && file_exists($newModuleDir)) {			
			$console .= $afConsole->execute('sf cc');
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Renamed module from <b>{$moduleName}</b> to <b>{$renamedModuleName}</b> inside <b>{$app}</b> application!")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()
		                        ->success(false)
		                        ->message("Can't rename module from <b>{$moduleName}</b> to <b>{$renamedModuleName}</b> inside <b>{$app}</b> application!");
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
    
}
