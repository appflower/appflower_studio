<?php
/**
 * Xml definition class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsXmlDefinition extends afsBaseDefinition
{
    /**
     * Definition name
     */
    protected $definition_name = 'xml';
    
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
        'contentName' => '_content'
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
     * Create instance
     *
     * @return afsXmlDefinition
     * @author Sergey Startsev
     */
    static public function create()
    {
        return new self;
    }
    
    /**
     * Pack definition procedure
     *
     * @return mixed
     * @author Sergey Startsev
     */
    protected function doPack(Array $definition)
    {
        // $definition = $this->getDefinition();
        
        // build definition via widget type
        $xmlBuilder = new afsXmlBuilder($definition, 'edit');
        $definition = $xmlBuilder->getXml();
        
        /*
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
        */
        
        return $definition;
        
        // $this->setDefinition($definition);
    }
    
    /**
     * Unpack definition procedure
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function doUnpack($definition)
    {
        // $definition = $this->getDefinition();
        
        $options = array(
            'parseAttributes' => true
        );
        
        $unserializer = new XML_Unserializer($options);
        $status = $unserializer->unserialize($definition, false);
        
        if ($status !== true) {
            throw new Exception($status->getMessage());
        }
        
        $definition = $unserializer->getUnserializedData();
        
        return $definition;
        // $this->setDefinition($definition);
        
        // $this->setDefinition($definition);
        
        /*
        $unserializer = new XML_Unserializer($this->unserialize_options);
        // $status = $unserializer->unserialize($path, true);
        $status = $unserializer->unserialize($definition, false);
        
        if ($status) {
            $this->setDefinition($unserializer->getUnserializedData());
        } else {
            throw new afsWidgetModelException($status->getMessage());
        }
        */
    }
    
    /**
     * Validate definition
     *
     * @param string $definition 
     * @return boolean
     * @author Sergey Startsev
     */
    protected function doValidatePacked()
    {
        $definition = $this->getDefinition();
        
        $tempPath = tempnam(sys_get_temp_dir(), 'studio_wi_wb').'.xml';
        
        afStudioUtil::writeFile($tempPath, $definition);
        
        $validator = new XmlValidator($tempPath);
        $status = $validator->validateXmlDocument();
        
        return $status;
    }
    
}
