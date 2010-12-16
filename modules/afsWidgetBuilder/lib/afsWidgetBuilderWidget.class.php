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
        $xmlBuilder = new afsXmlBuilder($this->definition);
        $xmlBuilder->getXml();
    }
}
?>