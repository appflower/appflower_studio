<?php 
/**
 * Widget model order helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetModelOrderHelper extends afsBaseModelHelper
{
    /**
     * Sequence for view list type
     */
    static protected $type_list = array(
        'i:scripts',
        'i:title',
        'i:confirm',
        'i:params',
        'i:proxy',
        'i:datasource' => array(
            'i:class',
            'i:method',
        ),
        'i:display',
        'i:fields',
        'i:rowactions',
        'i:actions',
        'i:moreactions',
        'i:cache',
        'i:description',
        'i:alternateDescriptions',
        'i:grouping',
    );
    
    /**
     * Sequence for view edit type
     */
    static protected $type_edit = array(
        'i:scripts',
        'i:title',
        'i:confirm',
        'i:datasource' => array(
            'i:class',
            'i:method',
        ),
		'i:fields',
		'i:actions',
		'i:description',
		'i:alternateDescriptions',
		'i:grouping',
    );
    
    /**
     * Sequence for view show type
     */
    static protected $type_show = array(
        'i:scripts',
		'i:title',
		'i:confirm',
		'i:datasource' => array(
            'i:class',
            'i:method',
        ),
		'i:display',
		'i:fields',
		'i:actions',
		'i:cache',
		'i:description',
		'i:alternateDescriptions',
		'i:grouping',
    );
    
    /**
     * Sequence for view wizard type
     */
    static protected $type_wizard = array(
        'i:title',
		'i:confirm',
		'i:datastore',
		'i:area',
		'i:actions',
		'i:grouping',
		'i:widgetCategories',
		'i:extrahelp',
    );
    
    /**
     * Sequence for view html type
     */
    static protected $type_html = array(
        'i:scripts',
		'i:title',
		'i:confirm',
		'i:params',
		'i:options',
		'i:actions',
		'i:moreactions',
		'i:description',
		'i:alternateDescriptions',
    );
    
    /**
     * Sequence for view info type
     */
    static protected $type_info = array(
        'i:title',
		'i:confirm',
		'i:body',
		'i:actions',
		'i:description',
		'i:alternateDescriptions',
    );
    
    /**
     * Fixing delegator - getting type rules from static var 
     *
     * @param Array $def 
     * @param string $type 
     * @return array
     * @author Sergey Startsev
     */
    static public function fixing(Array $def, $type)
    {
        $type_var = "type_{$type}";
        if (!property_exists(__CLASS__, $type_var)) return $def;
        
        return self::fixingByType($def, self::$$type_var);
    }
    
    /**
     * Fixing view by type
     *
     * @param Array $def 
     * @param Array $type 
     * @return array
     * @author Sergey Startsev
     */
    static protected function fixingByType(Array $def, Array $type)
    {
        $definition = array();
        
        foreach ($type as $key => $element) {
            if (is_array($element)) {
                if (isset($def[$key])) {
                    $definition[$key] = self::fixingByType($def[$key], $element);
                    unset($def[$key]);
                }
                
                continue;
            }
            
            if (isset($def[$element])) {
                $definition[$element] = $def[$element];
                unset($def[$element]);
            }   
        }
        
        if (is_array($def)) foreach ($def as $elName => $el) $definition[$elName] = $el;
        
        return $definition;
    }
    
}
