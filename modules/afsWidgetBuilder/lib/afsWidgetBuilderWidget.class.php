<?php
/**
 * This class reflects widgets XML file
 * It can read widget definition and convert it to JSON format
 * It can also save changed widget definition coming from client side
 *
 * @author lukas
 */
class afsWidgetBuilderWidget {

    private $module;
    private $action;
    /**
     * Array representation of Widgets XML
     * @var array
     */
    private $definition;

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
//        echo '<pre>';
//        print_r($this->definition);
//        echo '</pre>';
    }

    function getDefinitionAsJSON()
    {
        return json_encode($this->definition);
    }

    function setDefinitionFromJSON($data)
    {
        $this->definition = json_decode($data, true);
    }

    function validateAndSaveXml()
    {
        class_exists('Xml_Util');
        $options = array(
            'parseAttributes' => true,
            'addDecl' => true,
            'encoding' => 'UTF-8',
            'indent' => '    ',
            'rootName' => 'i:view'
//            ,'defaultTagName' => 'dupa'
            ,'mode' => 'simplexml'
//            ,'classAsTagName' => 'dupa'
//            ,'typeHints' => true
//            ,'scalarAsAttributes' => true
            ,'cdata' => '_content'
        );
        $rootAttributes = array(
            'xmlns:xsi' => $this->definition['xmlns:xsi'],
            'xsi:schemaLocation' => $this->definition['xsi:schemaLocation'],
            'xmlns:i' => $this->definition['xmlns:i'],
            'type' => $this->definition['type']
        );
        $options['rootAttributes'] = $rootAttributes;
        echo '<pre>';
        print_r($this->definition);
        echo '</pre>';
        unset($this->definition['xmlns:xsi']);
        unset($this->definition['xsi:schemaLocation']);
        unset($this->definition['xmlns:i']);
        unset($this->definition['type']);


        $serializer = new XML_Serializer($options);
        $status = $serializer->serialize($this->definition);

        if ($status !== true) {
            throw new Exception($status->getMessage());
        }

        $xml = $serializer->getSerializedData();
        echo "<pre>";
        echo htmlspecialchars($xml);
        echo '</pre>';
        
    }
}
?>