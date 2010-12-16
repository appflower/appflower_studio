<?php
/**
 * It turns out that using PEAR XML Serializer to transform XML -> JSON -> XML
 * is not as easy as it looks :|
 * Anyone who can achieve this - you have a beer from me :D
 *
 * Responsibility of this class is to build well formatted XML from widget
 * definition in array format
 *
 * @author lukas
 */
class afsXmlBuilder {
    private $definition;
    private $xml;

    function  __construct($definition) {
        $this->definition = $definition;
    }

    /**
     * Initiates parsing of widget definition in array format
     */
    private function build()
    {
        $elements = array();
        $root = new SimpleXMLElement("<i___view></i___view>");
//        echo "<pre>";
//        print_r($this->definition);
//        echo "</pre>";
        $this->parseRow($this->definition, $root);
        $this->xml = str_replace('___',':',$root->asXML());
//        echo $this->xml;
//        file_put_contents( '/tmp/file.xml', $this->xml);
    }

    /**
     * Recurring function that creates xml file element
     */
    private function parseRow($rowArray, $parentElement)
    {
        $content = null;
        $simpleAttributes = array();
        $complexAttributes = array();
        foreach ($rowArray as $key => $value) {
            if (substr($key, 0, 2) == 'i:') {
                $complexAttributes[$key] = $value;
            } else {
                $simpleAttributes[$key] = $value;
            }
        }

        foreach ($simpleAttributes as $name => $value) {
            if (is_array($value)) {
                echo '.';
            } else {
                $parentElement->addAttribute($name, $value);
            }
        }

        foreach ($complexAttributes as $key => $data) {
            $key = str_replace(':', '___', $key);
            if (is_array($data)) {
                if ($this->isNumeric($data)) {
                    $this->addManyChilds($parentElement, $key, $data);
                } else {
                    if (isset($data['_content'])) {
                        $element = $parentElement->addChild($key, $data['_content']);
                        unset($data['_content']);
                    } else {
                        $element = $parentElement->addChild($key);
                    }
                    $this->parseRow($data, $element);
                }
            } else {
                $element = $parentElement->addChild($key, $data);
            }
        }

    }

    /**
     * If some array from widget definition is typical numeric indexed array
     * we want to treat it special - this function checks array keys
     */
    function isNumeric($array)
    {
        $keys = array_keys($array);
        foreach ($keys as $key) {
            if (!is_numeric($key)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Adds many xml elements of the same name like i:column or i:action, etc...
     */
    function addManyChilds($parentElement, $childsName, $childsAttributes)
    {
        if ($childsName == 'column') {
            isset($childsAttributes['da']);
        }
        foreach ($childsAttributes as $childAttributes) {
            $childEl = $parentElement->addChild($childsName);
            foreach ($childAttributes as $key => $value) {
                $childEl->addAttribute($key, $value);
            }
        }
    }

    /**
     * returns genereated XML
     */
    function getXml()
    {
        if (!$this->xml) {
            $this->build();
        }
        
        return $this->xml;
    }
}
?>
