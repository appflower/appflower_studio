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
    /**
     * @var SimpleXml
     */
    private $rootNode;

    function  __construct($definition, $widgetType)
    {
        $this->definition = $definition;
        $this->fixElementsOrder();
        $this->createRootNode($widgetType);
        $this->build();
    }

    /**
     * order of elements in XML file is important and this method job is to take care of it
     */
    private function fixElementsOrder()
    {
        $newDefinition = array();
        $def = $this->definition;
        if (isset($def['i:title'])) {
            $newDefinition['i:title'] = $def['i:title'];
            unset($def['i:title']);
        }

        if (isset($def['i:params'])) {
            $newDefinition['i:params'] = $def['i:params'];
            unset($def['i:params']);
        }

        if (isset($def['i:proxy'])) {
            $newDefinition['i:proxy'] = $def['i:proxy'];
            unset($def['i:proxy']);
        }

        if (isset($def['i:datasource'])) {
            $newDefinition['i:datasource'] = $def['i:datasource'];
            unset($def['i:datasource']);
            $newDS = array();
            if (isset($newDefinition['i:datasource']['i:class'])) {
                $newDS['i:class'] = $newDefinition['i:datasource']['i:class'];
                unset($newDefinition['i:datasource']['i:class']);
            }
            if (isset($newDefinition['i:datasource']['i:method'])) {
                $newDS['i:method'] = $newDefinition['i:datasource']['i:method'];
                unset($newDefinition['i:datasource']['i:method']);
            }

            foreach ($newDefinition['i:datasource'] as $key => $value) {
                $newDS[$key] = $value;
            }

            $newDefinition['i:datasource'] = $newDS;
        }

        if (isset($def['i:fields'])) {
            $newDefinition['i:fields'] = $def['i:fields'];
            unset($def['i:fields']);
        }

        if (isset($def['i:rowactions'])) {
            $newDefinition['i:rowactions'] = $def['i:rowactions'];
            unset($def['i:rowactions']);
        }

        if (isset($def['i:actions'])) {
            $newDefinition['i:actions'] = $def['i:actions'];
            unset($def['i:actions']);
        }

        if (isset($def['i:moreactions'])) {
            $newDefinition['i:moreactions'] = $def['i:moreactions'];
            unset($def['i:moreactions']);
        }

        if (isset($def['i:description'])) {
            $newDefinition['i:description'] = $def['i:description'];
            unset($def['i:description']);
        }

        if (is_array($def)) {
            foreach ($def as $elName => $el) {
                $newDefinition[$elName] = $el;
            }
        }

        $this->definition = $newDefinition;
    }

    private function createRootNode($widgetType)
    {
        $this->rootNode = new SimpleXMLElement("<?xml version=\"1.0\" encoding=\"UTF-8\"?><i___view></i___view>");
        $this->rootNode->addAttribute('type', $widgetType);
        $this->rootNode->addAttribute('xmlns___xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        $this->rootNode->addAttribute('xsi___schemaLocation', 'http://www.appflower.com/schema/appflower.xsd');
        $this->rootNode->addAttribute('xmlns___i', 'http://www.appflower.com/schema/');
    }
    
    /**
     * Initiates parsing of widget definition in array format
     */
    private function build()
    {
        $this->parseRow($this->definition, $this->rootNode);
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
                        if ($data['_content'] != '') {
                            $element = $parentElement->addChild($key, $data['_content']);
                        } else {
                            $element = $parentElement->addChild($key);
                        }
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
        foreach ($childsAttributes as $childAttributes) {
            $childElValue = null;
            foreach ($childAttributes as $key => $value) {
                if ($key == '_content') {
                    if ($value != '') {
                        $childElValue = $value;
                    }
                    break;
                }
            }
            if (isset($childAttributes['_content'])) {
                unset($childAttributes['_content']);
            }
            if ($childElValue) {
                $childEl = $parentElement->addChild($childsName, $childElValue);
            } else {
                $childEl = $parentElement->addChild($childsName);
            }
            $this->parseRow($childAttributes, $childEl);
        }
    }

    /**
     * returns genereated XML
     */
    function getXml()
    {
        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;
        $dom->loadXML($this->rootNode->asXML());


        $xml = str_replace('___',':',$dom->saveXML());
        return $xml;
    }
}
?>