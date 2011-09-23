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
        'i:title',
        'i:confirm',
        'i:area',
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
        'i:description',
        'i:grouping',
    );
    
    /**
     * Sequence for view edit type
     */
    static protected $type_edit = array(
        'i:title',
        'i:confirm',
        'i:area',
        'i:params',
        'i:proxy',
        'i:datasource' => array(
            'i:class',
            'i:method',
        ),
        'i:display',
        'i:fields' => array(
            'i:field' => array(
                'i:value' => array(
                    'i:class',
                    'i:method',
                ),
                'i:tooltip',
                'i:help',
                'i:validator',
                'i:handler',
                'i:window',
                'i:trigger',
            ),
            'i:button',
            'i:link',
            'i:radiogroup',
        ),
        'i:actions',
        'i:moreactions',
        'i:description',
        'i:grouping',
    );
    
    /**
     * Sequence for view show type
     */
    static protected $type_show = array(
        'i:title',
        'i:confirm',
        'i:area',
        'i:params',
        'i:proxy',
        'i:datasource' => array(
            'i:class',
            'i:method',
        ),
        'i:display',
        'i:fields' => array(
            'i:field' => array(
                'i:value' => array(
                    'i:class',
                    'i:method',
                ),
                'i:tooltip',
                'i:help',
                'i:validator',
                'i:handler',
                'i:window',
                'i:trigger',
            ),
            'i:button',
            'i:radiogroup',
        ),
        'i:actions',
        'i:moreactions',
        'i:description',
        'i:grouping',
    );
    
    /**
     * Sequence for view layout type
     */
    static protected $type_layout = array(
        'i:title',
        'i:confirm',
        'i:area',
        'i:params',
        'i:proxy',
        'i:datasource' => array(
            'i:class',
            'i:method',
        ),
        'i:display',
        'i:fields' => array(
            'i:field' => array(
                'i:value' => array(
                    'i:class',
                    'i:method',
                ),
                'i:tooltip',
                'i:help',
                'i:validator',
                'i:handler',
                'i:window',
                'i:trigger',
            ),
            'i:button',
            'i:radiogroup',
        ),
        'i:actions',
        'i:moreactions',
        'i:description',
        'i:grouping',
    );
    
    /**
     * Sequence for view wizard type
     */
    static protected $type_wizard = array(
        'i:title',
        'i:confirm',
        'i:area',
        'i:params',
        'i:proxy',
        'i:datasource' => array(
            'i:class',
            'i:method',
        ),
        'i:display',
        'i:fields',
        'i:actions',
        'i:moreactions',
        'i:description',
        'i:grouping',
    );
    
    /**
     * Sequence for view html type
     */
    static protected $type_html = array(
        'i:title',
        'i:confirm',
        'i:area',
        'i:params',
        'i:proxy',
        'i:datasource' => array(
            'i:class',
            'i:method',
        ),
        'i:display',
        'i:fields',
        'i:actions',
        'i:moreactions',
        'i:description',
        'i:grouping',
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
        
        // if setted part is array of elements - for example i:field, i:field
        if (key($def) === 0 && is_array(current($def))) {
            foreach ($def as $subpart) $definition[] = self::fixingByType($subpart, $type);
            return $definition;
        }
        
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
