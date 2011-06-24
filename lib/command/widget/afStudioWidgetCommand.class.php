<?php
/**
 * Studio Widget Command Class
 *
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioWidgetCommand extends afBaseStudioCommand
{
    
    /**
     * Place type application
     */
    const PLACE_APPLICATION = 'app';
    
    /**
     * Plugin place type
     */
    const PLACE_PLUGIN = 'plugin';
    
    private $module;
    private $action;
    private $widgetType;
    
    /**
     * Array representation of Widgets XML
     * 
     * @var array
     */
    private $definition;
    
    /**
     * Place name
     *
     * @example frontend, appFlowerStudioPlugin
     */
    private $place;
    
    /**
     * Place type
     *
     * @example app, plugin
     */
    private $place_type;
    
    
    
    
    
    
    
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
            $afsWBW = new afsWidgetBuilderWidget($this->getParameter('uri'));
            $afsWBW->loadXml();
            
            $data = $afsWBW->getDefinition();

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
        $response = afResponseHelper::create();
        
        try {
            $afsWBW = new afsWidgetBuilderWidget($this->getParameter('uri'));
            
            $data = $this->getParameter('data');
            $widgetType = $this->getParameter('widgetType');
            $createNewWidget = ($this->getParameter('createNewWidget') == 'true' ? true : false);
            
            $afsWBW->setPlaceType($this->getParameter('placeType', 'app'));
            $afsWBW->setPlace($this->getParameter('place', 'frontend'));

            $afsWBW->setWidgetType($widgetType);
            $afsWBW->setDefinitionFromJSON($data, $createNewWidget);
            
            $validationStatusOrError = $afsWBW->save();
            
            if ($validationStatusOrError === true) {
                $message = $createNewWidget ? 'Widget was succesfully created' : 'Widget was succesfully saved';
                
                $response->success(true)->message($message)->data(array(), $afsWBW->getInfo(), 0);
            } else {
                $response->success(false)->message($validationStatusOrError);
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
	    $oldValue = $this->getParameter('oldValue');
		$newValue = $this->getParameter('newValue');
		$place = $this->getParameter('place');
		$module = $this->getParameter('module');
		$type    = $this->getParameter('type', 'app');
		
		$filesystem = new sfFileSystem();
		$root = afStudioUtil::getRootDir();
		$afConsole = afStudioConsole::getInstance();
		
		$console = $afConsole->execute('afs fix-perms');
		
		$module_dir = "{$root}/{$type}s/{$place}/modules/{$module}";
        
		$oldName = "{$module_dir}/config/{$oldValue}";
		$newName = "{$module_dir}/config/{$newValue}";
		
		$console .= afStudioModuleCommandHelper::renameAction(
		    pathinfo($oldValue, PATHINFO_FILENAME), 
		    pathinfo($newValue, PATHINFO_FILENAME), 
		    $module,
		    $place, 
		    $type
		);
		
		if (!file_exists($newName)) {
            // $filesystem->rename($oldName, $newName);
            $console .= $afConsole->execute("mv {$oldName} {$newName}");
            
    		if (!file_exists($oldName) && file_exists($newName)) {			
    			$console .= $afConsole->execute('sf cc');
                
    			$this->result = afResponseHelper::create()
    			                    ->success(true)
    			                    ->message("Renamed page from <b>{$oldValue}</b> to <b>{$newValue}</b>!")
    			                    ->console($console);
    		} else {
    		    $this->result = afResponseHelper::create()->success(false)->message("Can't rename page from <b>{$oldValue}</b> to <b>{$newValue}</b>!");
    		}
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("View {$newValue} already exists");
		}
		
		return $this->result->asArray();
	}
	
	/**
	 * Delete xml functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processDelete()
	{
		$place = $this->getParameter('place');
		$module = $this->getParameter('module');
		$type = $this->getParameter('type', 'app');
		$name = $this->getParameter('name');
		
		$root = afStudioUtil::getRootDir();
		$afConsole = afStudioConsole::getInstance();
		
		$module_dir = "{$root}/{$type}s/{$place}/modules/{$module}";
		$xmlDir = "{$module_dir}/config/{$name}";
		
		$actionName = pathinfo($name, PATHINFO_FILENAME);
		$actionDir = "{$module_dir}/actions/{$actionName}Action.class.php";
		
		$console = $afConsole->execute(array(
            'afs fix-perms',
            "rm -rf {$xmlDir}",
            "rm -rf {$actionDir}"
		));
		
		$response = afResponseHelper::create();
		
		if (!file_exists($xmlDir)) {
			$console .= $afConsole->execute('sf cc');
			
			$this->result = $response->success(true)->message("Deleted page <b>{$name}</b>")->console($console);
		} else {
		    $this->result = $response->success(false)->message("Can't delete page <b>{$name}</b>!");
		}
		
		return $this->result->asArray();
	}
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    private function loadXml()
    {
        $afCU = new afConfigUtils($this->module);
        $path = $afCU->getConfigFilePath("{$this->action}.xml");

        if (!is_readable($path)) {
            throw new Exception("Could not find widget XML file");
        }

        $options = array(
            'parseAttributes' => true
        /*
          	'attributesArray' => 'attributes',
        	'mode' => 'simplexml',
        	'complexType' => 'array'
        */
        );

        $unserializer = new XML_Unserializer($options);
        $status = $unserializer->unserialize($path, true);

        if ($status !== true) {
            throw new Exception($status->getMessage());
        }

        $this->definition = $unserializer->getUnserializedData();
    }
    
    
    
    public function setWidgetType($widgetType) {
       $this->widgetType = $widgetType;
    }
    
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
