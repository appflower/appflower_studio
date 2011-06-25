<?php
/**
 * This class reflects widgets XML file
 * It can read widget definition and convert it to JSON format
 * After widget definition is parsed class allows to get basic information like fields list
 * It can also save changed widget definition coming from client side
 * This class can also create action file for new widgets
 * 
 *
 * @author lukas
 */
class afsWidgetBuilderWidget {
    
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
    
    public function setWidgetType($widgetType) {
       $this->widgetType = $widgetType;
    }

    function __construct($uri)
    {
        $uriParts = explode('/', $uri);
        if (count($uriParts) != 2) {
            throw new Exception("Given widget URI: \"$uri\" looks wrong");
        }

        $this->module = $uriParts[0];
        $this->action = $uriParts[1];
    }

    function loadXml()
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

    function getDefinition()
    {
        return $this->definition;
    }

    function getDefinitionAsJSON()
    {
        return json_encode($this->definition);
    }

    function setDefinitionFromJSON($data, $newWidgetMode = false)
    {
        $this->definition = json_decode($data, true);

        switch($this->widgetType) {
            case 'edit':
                $widgetModifier = new EditWidgetModifier;
                break;
            case 'list':
                $widgetModifier = new ListWidgetModifier;
                break;
            default:
                throw new Exception("I dont know which concrete builder class to use for widget type: ".$this->widgetType);
                break;
        }

        $this->definition = $widgetModifier->modify($this->definition, $newWidgetMode);
    }

    private function validateAndSaveXml()
    {
        $xmlBuilder = new afsXmlBuilder($this->definition, $this->widgetType);
        
        if ($this->isPlugin()) {
            $config_path = $this->getPlaceConfigPath();
            if (!file_exists($config_path)) {
                // for now via console creating config for path
                afStudioConsole::getInstance()->execute("mkdir {$config_path}");
            }
            $path = "{$config_path}/{$this->action}.xml";
        } else {
            $afCU = new afConfigUtils($this->module);
            $path = $this->getPlaceConfigPath() . "/{$this->action}.xml";
            if (!file_exists($path)) {
                afStudioConsole::getInstance()->execute("mkdir {$this->getPlaceConfigPath()}");
            }
        }

        $tempPath = tempnam(sys_get_temp_dir(), 'studio_wi_wb').'.xml';
        FirePHP::getInstance(true)->fb($tempPath);
        afStudioUtil::writeFile($tempPath, $xmlBuilder->getXml());

//        $validator = new XmlValidator(null, false, true);
//        $validator->readXmlDocument($tempPath, true);
//        $validationStatus = $validator->validateXmlDocument(true);
        $validator = new XmlValidator($tempPath);
        $validationStatus = $validator->validateXmlDocument();
        if ($validationStatus) {
            /*if (file_exists($path) && !is_writable($path) || !is_writable(dirname($path))) {
                return 'File was validated properly but I was not able to save it in: '.$path.'. Please check file/dir permissions.';
            }*/
            afStudioUtil::writeFile($path, $xmlBuilder->getXml());
            return true;
        }

        return 'Widget XML is not valid.';
    }

    function save()
    {
        $validationStatusOrError = $this->validateAndSaveXml();
        if ($validationStatusOrError === true) {
            return $this->ensureActionExists();
        }
        return $validationStatusOrError;
    }

    /**
     * checks if action file exists
     * if not - we are createing new action file
     */
    private function ensureActionExists()
    {
        $afCU = new afConfigUtils($this->module);
        if ($afCU->isActionDefined($this->action)) {
            return true;
        }
        
        if ($this->isPlugin()) {
            $actionFilePath = $this->getPlaceModulePath() . "/actions/{$this->action}Action.class.php";
        } else {
            $actionFilePath = $afCU->generateActionFilePath($this->action);
        }

        /*$fileExists = file_exists($actionFilePath);
        $fileWritable = is_writable($actionFilePath);
        $dirWritable = is_writable(dirname($actionFilePath));
        if (!$dirWritable ||
            $dirWritable && $fileExists && !$fileWritable) {
            return 'I need write permissions to '.$actionFilePath.'. Please check file/dir permissions.';
        }*/

        afStudioUtil::writeFile($actionFilePath, $this->renderActionFileContent());
        return true;
    }

    private function renderActionFileContent()
    {
        if ($this->widgetType == 'list') {
            $content =
                '<'.'?'.'php'."\n".
                "class {$this->action}Action extends sfAction" . "\n" .
                "{" . "\n" .
                '    function execute($request)' . "\n" .
                "    {" . "\n" .
                "    }" . "\n" .
                "}";
        } else {
            $content =
                '<'.'?'.'php'."\n".
                "class {$this->action}Action extends simpleWidgetEditAction" . "\n" .
                "{" . "\n" .
                "}";
        }

        return $content;
    }
/*
    function getDefinedFieldNames()
    {
        $fieldNames = array();
        if (isset($this->definition['i:fields'])) {
            $fields = $this->definition['i:fields'];
            if (isset($fields['i:field'])) {
                $fields = $fields['i:field'];
                if (is_array($fields)) {
                    if (isset($fields['name'])) {
                        $fieldNames[] = $fields['name'];
                    } else {
                        foreach ($fields as $field) {
                            $fieldNames[] = $field['name'];
                        }
                    }
                }
            }
        }

        return $fieldNames;
        
    }

    function getDatasourceClassName()
    {
        if (isset($this->definition['i:datasource'])) {
            if (isset($this->definition['i:datasource']['i:class'])) {
                return $this->definition['i:datasource']['i:class'];
            }
        }

        return null;
    }
  */  
    /**
     * Setting place name
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    public function setPlace($place)
    {
        $this->place = $place;
    }
    
    /**
     * Setting place type
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    public function setPlaceType($type)
    {
        $this->place_type = $type;
    }
    
    /**
     * Getting place type
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlaceType()
    {
        return $this->place_type;
    }
    
    /**
     * Getting place name
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlace()
    {
        return $this->place;
    }
    
    /**
     * Generate place path 
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlacePath()
    {
        return afStudioUtil::getRootDir() . "/{$this->place_type}s/{$this->place}";
    }
    
    /**
     * Generate place path to config path of current module
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlaceConfigPath()
    {
        return $this->getPlaceModulePath() . "/config";
    }
    
    /**
     * Getting place modules path
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlaceModulePath()
    {
        return $this->getPlacePath() . "/modules/{$this->module}";
    }
    
    /**
     * Checking is plugin place type or not
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function isPlugin()
    {
        return ($this->getPlaceType() == self::PLACE_PLUGIN);
    }
    
    /**
     * Getting Widget information
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getInfo()
    {
        $module_dir = $this->getPlaceModulePath();
        
        $actionPath = "{$module_dir}/actions/actions.class.php";
        
	    $predictActions = "{$this->action}Action.class.php";
	    $predictActionsPath = "{$module_dir}/actions/{$predictActions}";
	    
	    if (file_exists($predictActionsPath)) {
	        $actionPath = $predictActionsPath;
	    }
	    
	    $actionName = pathinfo($actionPath, PATHINFO_BASENAME);
        
        $info = array(
            'place' => $this->getPlace(),
            'placeType' => $this->getPlaceType(),
            'module' => $this->module,
            'widgetUri' => "{$this->module}/{$this->action}",
            'securityPath' => $this->getPlaceConfigPath() . "/security.yml",
            'xmlPath' => $this->getPlaceConfigPath() . "/{$this->action}.xml",
            'actionPath' => $actionPath,
            'actionName' => $actionName,
            'name' => $this->action
        );
        
        return $info;
    }
    
}
?>
