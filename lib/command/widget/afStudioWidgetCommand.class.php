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
     * Widget type
     *
     * @example list, edit
     */
    private $type;
    
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
     * Serialization options 
     */
    private $serialize_options = array(
        'rootName' => 'i:view',
        'attributesArray' => 'attributes',
        'indent' => '    ',
        'mode' => 'simplexml',
        'addDecl' => true,
        'encoding' => 'UTF-8',
        'contentName' => '_content',
        // 'cdata' => true
    );
    
    /**
     * Unserialization options
     */
    private $unserialize_options = array(
        'parseAttributes' => true,
        'attributesArray' => 'attributes',
        'mode' => 'simplexml',
        'complexType' => 'array',
        'contentName' => '_content'
    );
    
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
            
            $this->setPlaceType($this->getParameter('placeType', 'app'));
            $this->setPlace($this->getParameter('place', 'frontend'));
            
            $this->load();
            
            $data = $this->getDefinition();

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
            
            $this->setPlaceType($this->getParameter('placeType', 'app'));
            $this->setPlace($this->getParameter('place', 'frontend'));
            $this->setType($this->getParameter('widgetType'));
            
            $this->setDefinition($data, $createNewWidget);
            
            $saveResponse = $this->save();
            
            if ($saveResponse->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                $message = $createNewWidget ? 'Widget was succesfully created' : 'Widget was succesfully saved';
                
                $response
                    ->success(true)
                    ->message($message)
                    ->data(array(), afStudioWidgetCommandHelper::getInfo($this->getAction(), $this->getModule(), $this->getPlace(), $this->getPlaceType()), 0);
                
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
     * Getting definition
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function getDefinition()
    {
        return $this->definition;
    }
    
    /**
     * Getting definition as json
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getDefinitionAsJSON()
    {
        return json_encode($this->definition);
    }
    
    /**
     * Set definition, apply rules to definitions
     *
     * @param string $data - json data
     * @param boolean $newWidgetMode 
     * @author Sergey Startsev
     */
    protected function setDefinition(Array $definition, $newWidgetMode = false)
    {
        // set definition
        $this->definition = $definition;
        
        // get widget type
        $type = $this->getType();
        
        // make modofier class name
        $modifier = ucfirst(strtolower($type)) . 'WidgetModifier';
        
        // apply modifier via delegate
        if (class_exists($modifier)) {
            $modifier = new $modifier;
            $this->definition = $modifier->modify($this->definition, $newWidgetMode);
        } else {
            throw new afStudioWidgetCommandException("I dont know which concrete builder class to use for widget type: {$type}");
        }
    }
    
    /**
     * Getting action
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getAction()
    {
        return $this->action;
    }
    
    /**
     * Getting module
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getModule()
    {
        return $this->module;
    }
    
    /**
     * Setting widget type
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    protected function setType($type)
    {
        $this->type = $type;
    }
    
    /**
     * Getting widget type
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getType()
    {
        return $this->type;
    }
    
    /**
     * Setting place name
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    protected function setPlace($place)
    {
        $this->place = $place;
    }
    
    /**
     * Setting place type
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    protected function setPlaceType($type)
    {
        $this->place_type = $type;
    }
    
    /**
     * Getting place type
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlaceType()
    {
        return $this->place_type;
    }
    
    /**
     * Getting place name
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlace()
    {
        return $this->place;
    }
    
    /**
     * Generate place path 
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlacePath()
    {
        return afStudioUtil::getRootDir() . "/{$this->place_type}s/{$this->place}";
    }
    
    /**
     * Generate place path to config path of current module
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlaceConfigPath()
    {
        return $this->getPlaceModulePath() . "/config";
    }
    
    /**
     * Getting place modules path
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlaceModulePath()
    {
        return $this->getPlacePath() . "/modules/{$this->getModule()}";
    }
    
    /**
     * Checking is plugin place type or not
     *
     * @return boolean
     * @author Sergey Startsev
     */
    protected function isPlugin()
    {
        return ($this->getPlaceType() == afStudioWidgetCommandHelper::PLACE_PLUGIN);
    }
    
    /**
     * Load definition from url params
     *
     * @author Sergey Startsev
     */
    private function load()
    {
        // getting widget file path
        $path = $this->getPlaceConfigPath() . "/{$this->getAction()}.xml";
        
        if (!is_readable($path)) {
            throw new afStudioWidgetCommandException("Could not find widget XML file");
        }
        
        /*
        $options = array(
            'parseAttributes' => true
        );
        
        $unserializer = new XML_Unserializer($options);
        $status = $unserializer->unserialize($path, true);

        if ($status !== true) {
            throw new Exception($status->getMessage());
        }
        
        $this->definition = $unserializer->getUnserializedData();
        */
        
        $unserializer = new XML_Unserializer($this->unserialize_options);
        $status = $unserializer->unserialize($path, true);
        
        if ($status) {
            $this->definition = $unserializer->getUnserializedData();
        } else {
            throw new afStudioWidgetCommandException($status->getMessage());
        }
        
        return $this->definition;
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
    
    /**
     * Save widget definition
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    private function save()
    {
        /*
        // build definition via widget type
        $xmlBuilder = new afsXmlBuilder($this->getDefinition(), $this->getType());
        $definition = $xmlBuilder->getXml();
        */
        
        // Needs to define/initialize xml serialize constants
        $oXmlUtil = new XML_Util;
        
        $serializer = new XML_Serializer($this->serialize_options);
        $status = $serializer->serialize($this->getDefinition());
        
        if (!$status) {
            throw new afStudioWidgetCommandException("Definition can't be serialized");
        }
        // getting serialized definition
        $definition = $serializer->getSerializedData();
        
        // update fields that should be wrapped with cdata
        $definition = afStudioWidgetCommandHelper::updateCdataFields($definition);
        
        
        // prepare folder for definition saving 
        $config_path = $this->getPlaceConfigPath();
        if (!file_exists($config_path)) {
            // for now via console creating config for path
            afStudioConsole::getInstance()->execute("mkdir {$config_path}");
        }
        $path = "{$config_path}/{$this->getAction()}.xml";
        
        // validate
        $status = $this->validate($definition);
        
        // save
        $response = afResponseHelper::create();
        if ($status) {
            afStudioUtil::writeFile($path, $definition);
            afStudioWidgetCommandHelper::deployLibs();
            
            // check exists action or not
            $response->success($this->ensureActionExists());
        } else {
            $response->success(false)->message('Widget XML is not valid.');
        }
        
        return $response;
    }
    
    /*
        TODO : move validation to separate class
    */
    private function validate($definition)
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'studio_wi_wb').'.xml';
        
        afStudioUtil::writeFile($tempPath, $definition);
        
        $validator = new XmlValidator($tempPath);
        $status = $validator->validateXmlDocument();
        
        return $status;
    }
    
    /**
     * checks if action file exists
     * if not - we are createing new action file
     * 
     * @return boolean
     * @author Lukasz Wojciechowski
     */
    private function ensureActionExists()
    {
        $afCU = new afConfigUtils($this->getModule());
        if ($afCU->isActionDefined($this->getAction())) {
            return true;
        }
        
        if ($this->isPlugin()) {
            $actionFilePath = $this->getPlaceModulePath() . "/actions/{$this->getAction()}Action.class.php";
        } else {
            $actionFilePath = $afCU->generateActionFilePath($this->getAction());
        }
        
        afStudioUtil::writeFile(
            $actionFilePath, 
            afStudioWidgetCommandTemplate::action($this->getAction(), $this->getType())
        );
        
        return true;
    }
    
}
