<?php
/**
 * Xml definition class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsXmlDefinition extends afsBaseDefinition
{
    const IDENTIFICATOR_ERROR = 'ERROR';
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
        'contentName' => '_content',
        'guessTypes' => true
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
     * Assign root attributes
     * 
     * @param string $type
     * @return afsXmlDefinition
     * @author Sergey Startsev
     */
    public function rootAttributes($type)
    {
        $definition = array(
            'attributes' => array(
                'type' => $type,
                'xmlns:i' => 'http://www.appflower.com/schema/',
                'xmlns:xsi' => 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:schemaLocation' => 'http://www.appflower.com/schema/appflower.xsd'
            )
        );
        
        $this->setDefinition(array_merge($definition, $this->getDefinition()));
        
        return $this;
    }
    
    /**
     * Pack definition procedure
     *
     * @return mixed
     * @author Sergey Startsev
     */
    protected function doPack(Array $definition)
    {
        // Needs to define/initialize xml serialize constants
        $oXmlUtil = new XML_Util;
        
        $serializer = new XML_Serializer($this->serialize_options);
        $status = $serializer->serialize($this->getDefinition());
        
        if (!$status) {
            throw new afsXmlDefinitionException("Definition can't be serialized");
        }
        // getting serialized definition
        $definition = $serializer->getSerializedData();
        
        // update fields that should be wrapped with cdata
        $definition = afsXmlDefinitionHelper::updateCdataFields($definition);
        
        return $definition;
    }
    
    /**
     * Unpack definition procedure
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function doUnpack($definition)
    {
        $unserializer = new XML_Unserializer($this->unserialize_options);
        
        // check unserialize status
        $status = $unserializer->unserialize($definition, false);
        
        if (!$status) {
            throw new afsXmlDefinitionException($status->getMessage());
        }
        
        // get unserialized data
        $definition = $unserializer->getUnserializedData();
        
        return $definition;
    }
    
    /**
     * Validate definition
     *
     * @param string $definition 
     * @return mixed - success: boolean, unsuccess: string - message error
     * @author Sergey Startsev
     */
    protected function doValidatePacked()
    {
        $definition = $this->getDefinition();
        
        $tempPath = tempnam(sys_get_temp_dir(), 'studio_wi_wb').'.xml';
        afStudioUtil::writeFile($tempPath, $definition);
        
        $validator = new XmlValidator($tempPath);
        $status = $validator->validateXmlDocument();
        
        unlink($tempPath);
        
        $status = $validator->validateXmlDocument(true);
        
        if ($status[0] == self::IDENTIFICATOR_ERROR) {
            $return = trim($status[1]->getMessage());
        } else {
            $return = true;
        }
        
        return $return;
    }
    
}
