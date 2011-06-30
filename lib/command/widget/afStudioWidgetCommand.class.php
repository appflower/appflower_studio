<?php
/**
 * Studio Widget Command Class
 *
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioWidgetCommand extends afBaseStudioCommand
{
    /**
     * Current module
     */
    private $module;
    
    /**
     * Current action
     */
    private $action;
    
    /**
     * Get widget functionality
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processGet()
    {
        $response = afResponseHelper::create();
        
        try {
            $this->parseUri($this->getParameter('uri'));
            
            $place_type = $this->getParameter('placeType', 'app');
            $place = $this->getParameter('place', 'frontend');
            
            $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $place_type);
            
            $data = $widget->getDefinition();
            
            $response->success(true)->data(array(), $data, 0);
        } catch( Exception $e ) {
            $response->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    /**
     * Save widget functionality
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processSave()
    {
        // create reponse object
        $response = afResponseHelper::create();
        
        try {
            $this->parseUri($this->getParameter('uri'));
            
            $data = $this->getParameter('data');
            $createNewWidget = ($this->getParameter('createNewWidget') == 'true' ? true : false);
            $place = $this->getParameter('place', 'frontend');
            $place_type = $this->getParameter('placeType', 'app');
            $type = $this->getParameter('widgetType');
            
            // retrieve widget object
            $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $place_type);
            
            $widget->setType($type);
            $widget->setIsNewMode($createNewWidget);
            
            $widget->setDefinition($data);
            
            // apply modifiers
            $widget->modify();
            
            $saveResponse = $widget->save();
            
            if ($saveResponse->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                $message = $createNewWidget ? 'Widget was succesfully created' : 'Widget was succesfully saved';
                
                $response
                    ->success(true)
                    ->message($message)
                    ->data(array(), afStudioWidgetCommandHelper::getInfo($this->action, $this->module, $place, $place_type), 0);
                
            } else {
                $response->success(false)->message($saveResponse->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
            }
        } catch( Exception $e ) {
            $response->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    /**
	 * Rename xml functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processRename()
	{
        // getting parameters
	    $oldValue   = $this->getParameter('oldValue');
		$newValue   = $this->getParameter('newValue');
		$place      = $this->getParameter('place');
		$module     = $this->getParameter('module');
		$type       = $this->getParameter('type', 'app');
		
        // initialize syst vars
		$filesystem = new sfFileSystem();
		$root = afStudioUtil::getRootDir();
		$afConsole = afStudioConsole::getInstance();
		
        // fix permissions
		$console = $afConsole->execute('afs fix-perms');
		
        // init paths
		$module_dir = "{$root}/{$type}s/{$place}/modules/{$module}";
        
		$oldName = "{$module_dir}/config/{$oldValue}";
		$newName = "{$module_dir}/config/{$newValue}";
		
		afStudioWidgetCommandHelper::load('module');
		
		$console .= afStudioModuleCommandHelper::renameAction(
		    pathinfo($oldValue, PATHINFO_FILENAME), 
		    pathinfo($newValue, PATHINFO_FILENAME), 
		    $module,
		    $place, 
		    $type
		);
		
		$response = afResponseHelper::create();
		
		if (!file_exists($newName)) {
            // $filesystem->rename($oldName, $newName);
            $console .= $afConsole->execute("mv {$oldName} {$newName}");
            
    		if (!file_exists($oldName) && file_exists($newName)) {			
    			$console .= $afConsole->execute('sf cc');
    			
    			$resopnse->success(true)->message("Renamed page from <b>{$oldValue}</b> to <b>{$newValue}</b>!")->console($console);
    		} else {
    		    $response->success(false)->message("Can't rename page from <b>{$oldValue}</b> to <b>{$newValue}</b>!");
    		}
		} else {
		    $response->success(false)->message("View {$newValue} already exists");
		}
		
		return $response->asArray();
	}
	
	/**
	 * Delete xml functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processDelete()
	{
        // init params 
		$place  = $this->getParameter('place');
		$module = $this->getParameter('module');
		$type   = $this->getParameter('type', 'app');
		$name   = $this->getParameter('name');
		
        // init vars
		$root = afStudioUtil::getRootDir();
		$afConsole = afStudioConsole::getInstance();
		
        // init paths
		$module_dir = "{$root}/{$type}s/{$place}/modules/{$module}";
		$xmlDir = "{$module_dir}/config/{$name}";
		
		$actionName = pathinfo($name, PATHINFO_FILENAME);
		$actionDir = "{$module_dir}/actions/{$actionName}Action.class.php";
		
		$console = $afConsole->execute(array(
            'afs fix-perms',
            "rm -rf {$xmlDir}",
            "rm -rf {$actionDir}"
		));
		
        // init response object
		$response = afResponseHelper::create();
		
		if (!file_exists($xmlDir)) {
			$console .= $afConsole->execute('sf cc');
			
			$response->success(true)->message("Deleted page <b>{$name}</b>")->console($console);
		} else {
		    $response->success(false)->message("Can't delete page <b>{$name}</b>!");
		}
		
		return $response->asArray();
	}
    
    /**
     * Parse input uri
     *
     * @param string $uri 
     * @author Sergey Startsev
     */
    private function parseUri($uri)
    {
        $uriParts = explode('/', $uri);
        
        if (count($uriParts) != 2) {
            throw new afStudioWidgetCommandException("Given widget URI: '{$uri}' looks wrong");
        }

        $this->module = $uriParts[0];
        $this->action = $uriParts[1];
    }
    
}
