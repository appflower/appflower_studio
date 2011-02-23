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

    private $module;
    private $action;
    private $widgetType;
    /**
     * Array representation of Widgets XML
     * @var array
     */
    private $definition;
    
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

    function setDefinitionFromJSON($data)
    {
        $this->definition = json_decode($data, true);
    }

    private function validateAndSaveXml()
    {
        $xmlBuilder = new afsXmlBuilder($this->definition, $this->widgetType);

        $afCU = new afConfigUtils($this->module);
        $path = $afCU->getConfigFilePath($this->action.'.xml');
        if (!$path) {
            $path = $afCU->generateConfigFilePath($this->action.'.xml');
        }
        FirePHP::getInstance(true)->fb($path);

        $tempPath = tempnam(sys_get_temp_dir(), 'studio_wi_wb').'.xml';
        FirePHP::getInstance(true)->fb($tempPath);
        file_put_contents($tempPath, $xmlBuilder->getXml());
        chmod($tempPath, 0777);

        $validator = new XmlValidator(null, false, true);
        $validator->readXmlDocument($tempPath, true);
        $validationStatus = $validator->validateXmlDocument(true);
        if ($validationStatus) {
            if (file_exists($path) && !is_writable($path) || !is_writable(dirname($path))) {
                return 'File was validated properly but I was not able to save it in: '.$path.'. Please check file/dir permissions.';
            }
            rename($tempPath, $path);
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

        $actionFilePath = $afCU->generateActionFilePath($this->action);

        $fileExists = file_exists($actionFilePath);
        $fileWritable = is_writable($actionFilePath);
        $dirWritable = is_writable(dirname($actionFilePath));
        if (!$dirWritable ||
            $dirWritable && $fileExists && !$fileWritable) {
            return 'I need write permissions to '.$actionFilePath.'. Please check file/dir permissions.';
        }

        file_put_contents($actionFilePath, $this->renderActionFileContent());
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

    function getDefinedFieldNames()
    {
        $fieldNames = array();
        if (isset($this->definition['i:fields'])) {
            $fields = $this->definition['i:fields'];
            if (isset($fields['i:field'])) {
                $fields = $fields['i:field'];
                if (is_array($fields)) {
                    foreach ($fields as $field) {
                        $fieldNames[] = $field['name'];
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
}
?>
