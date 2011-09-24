<?php
/**
 * Xml definition helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsXmlDefinitionHelper extends afsBaseDefinitionHelper 
{
    /**
     * Cdata fields that will be processed, should be written with xpath value
     *
     * @example array(
     *              'title' => '//i:view/i:title',
     *              'description' => '//i:view/i:description',
     *          )
     * @var array
     */
    static private $cdata_fields = array(
        'title'         =>  '//i:view/i:title',
        'description'   =>  '//i:view/i:description',
        'param_html'    =>  '//i:view/i:params/i:param[@name="html"]'
    );
    
    /**
     * Update fields, make needed fields with cdata
     *
     * @param string $definition 
     * @return string
     * @author Sergey Startsev
     */
    static public function updateCdataFields($definition)
    {
        $default_internal_errors = libxml_use_internal_errors(true);
        
        // create dom document instance
        $dom_xml = new DOMDocument;
        $dom_xml->formatOutput = true;
        $dom_xml->loadXML($definition);
        
        $dom_xml_xpath = new DOMXPath($dom_xml);
        
        // make changes 
        foreach (self::$cdata_fields as $field_name => $path) {
            // getting element
            $elements = $dom_xml_xpath->query($path);
            
            if ($elements) {
                foreach ($elements as $element) {
                    $value = $element->nodeValue;
                    $element->nodeValue = '';
                    $element->appendChild($element->ownerDocument->createCDATASection($value));
                }
            }
        }
        
        libxml_clear_errors();
        libxml_use_internal_errors($default_internal_errors);
        
        return $dom_xml->saveXML();
    }
}
