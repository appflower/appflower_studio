<?php
/**
 * Widget model validator class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetModelValidator extends afsBaseModelValidator
{
    /**
     * Implode errors symbol - used to glue when errors defined as array 
     */
    const IMPLODE_ERRORS_SYMBOL = '<br />';
    
    /**
     * Deprecated fields in edit view
     *
     * @example 'i:fields' => array(
     *              'i:field' => array(
     *                  'attributes' => array(
     *                      'name' => 'id',
     *                  ),
     *              ),
     *          ),
     * 
     * @var array
     */
    private $edit_deprecated_fields = array();
    
    /**
     * Params that should be unique
     *
     * @var array
     */
    private $unique_params_places = array(
        'i:params' => array(
            'i:param' => array(
                'attributes' => array(
                    'name',
                ),
            ),
        ),
        'i:datasource' => array(
            'attributes' => array(
                'type',
            ),
            'i:method' => array(
                'attributes' => array(
                    'name',
                ),
                'i:param' => array(
                    'attributes' => array(
                        'name',
                    ),
                ),
            ),
        ),
        'i:fields' => array(
            'i:field' => array(
                'attributes' => array(
                    'name',
                ),
                'i:validator' => array(
                    'attributes' => array(
                        'name',
                    ),
                    'i:param' => array(
                        'attributes' => array(
                            'name',
                        ),
                    ),
                ),
            ),
            'i:column' => array(
                'attributes' => array(
                    'name',
                ),
            ),
            'i:button' => array(
                'attributes' => array(
                    'name',
                ),
            ),
            'i:link' => array(
                'attributes' => array(
                    'name',
                ),
            ),
            'i:radiogroup' => array(
                'attributes' => array(
                    'name',
                ),
            ),
        ),
        'i:actions' => array(
            'i:action' => array(
                'attributes' => array(
                    'name',
                ),
            ),
        ),
        'i:grouping' => array(
            'i:set' => array(
                'i:ref' => array(
                    'attributes' => array(
                        'to',
                    ),
                ),
            ),
        ),
    );
    
    /**
     * Private constructor
     *
     * @author Sergey Startsev
     */
    private function __construct() {}
    
    /**
     * Fabric method - create self 
     *
     * @param afsWidgetModel $widget 
     * @return afsWidgetModelValidator
     * @author Sergey Startsev
     */
    static public function create(afsWidgetModel $widget)
    {
        $instance = new self;
        $instance->model = $widget;
        
        return $instance;
    }
    
    /**
     * Validate unique params in definition
     *
     * @return mixed
     * @author Sergey Startsev
     */
    protected function validateUniqueParams()
    {
        $errors = $this->checkUniqueAttributeField($this->getDefinition(), $this->unique_params_places);
        
        if (empty($errors)) return true;
        
        return implode(self::IMPLODE_ERRORS_SYMBOL, $errors);
    }
    
    /**
     * Validate does definition contains deprecated fields
     *
     * @return mixed
     * @author Sergey Startsev
     */
    protected function validateDeprecated()
    {
        $errors = array();
        $definition = $this->getDefinition();
        
        if ($this->getModel()->getType() == afsWidgetModelHelper::WIDGET_EDIT) {
            if (isset($definition['i:datasource'])) {
                $primary_key_rule = $this->getPrimaryKeyRule($definition);
                if ($primary_key_rule) {
                    $errors = $this->checkDeprecatedField($definition, $primary_key_rule);
                }
            }
            $errors = array_merge($errors, $this->checkDeprecatedField($definition, $this->edit_deprecated_fields));
        }
        
        if (empty($errors)) return true;
        
        return implode(self::IMPLODE_ERRORS_SYMBOL, $errors);
    }
    
    /**
     * Validate attributes dependencies
     *
     * @return mixed
     * @author Sergey Startsev
     */
    protected function validateAttributesDependency()
    {
        $errors = array();
        $definition = $this->getDefinition();
        
        if ($this->getModel()->getType() == afsWidgetModelHelper::WIDGET_EDIT) {
            if (isset($definition['i:fields']) && is_array($definition['i:fields'])) {
                
                foreach ($definition['i:fields'] as $field) {
                    if (key($field) === 0) {
                        foreach ($field as $sub_field) {
                            if ($message = $this->checkIncludeDependency($sub_field)) $errors[] = $message;
                        }
                        continue;
                    }
                    
                    if ($message = $this->checkIncludeDependency($field)) $errors[] = $message;
                }
            }
        }
        
        if (empty($errors)) return true;
        
        return implode(self::IMPLODE_ERRORS_SYMBOL, $errors);
    }
    
    /**
     * Check include attr dependencies
     *
     * @param Array $field 
     * @return string
     * @author Sergey Startsev
     */
    private function checkIncludeDependency(Array $field)
    {
        $errors = null;
        
        if (array_key_exists('attributes', $field) && 
            array_key_exists('type', $field['attributes']) && 
            $field['attributes']['type'] == 'include' && 
            !isset($field['attributes']['url'])
        ) {
            $errors = "If defined 'include' attribute than should be also defined 'url' attribute";
        }
        
        return $errors;
    }
    
    /**
     * Checking that all attr defined unique
     *
     * @param Array $definition 
     * @param Array $rules 
     * @return array
     * @author Sergey Startsev
     */
    private function checkUniqueAttributeField(Array $definition, Array $rules)
    {
        $errors = array();
        foreach ($rules as $rule_key => $rule) {
            if (is_array($rule)) {
                if (!isset($definition[$rule_key])) continue;
                
                if (key($definition[$rule_key]) === 0 && is_array(current($definition[$rule_key]))) {
                    if (array_key_exists('attributes', $rule)) {
                        $exist_table = array();
                        foreach ($rule['attributes'] as $subrule) {
                            foreach ($definition[$rule_key] as $field) {
                                if (array_key_exists($subrule, $field['attributes'])) {
                                    if (!array_key_exists($field['attributes'][$subrule], $exist_table)) {
                                        $exist_table[$field['attributes'][$subrule]] = 1;
                                        continue;
                                    }
                                    
                                    $exist_table[$field['attributes'][$subrule]]++;
                                }
                            }
                        }
                        
                        foreach ($exist_table as $attr_name => $attr_count) {
                            if ($attr_count > 1) $errors[] = "Attribute value '{$attr_name}' defined more than once in '{$rule_key}'";
                        }
                        continue;
                    }
                    
                    foreach ($definition[$rule_key] as $subpart) $errors = array_merge($errors, $this->checkUniqueAttributeField($subpart, $rule));
                    continue;
                }
                
                $errors = array_merge($errors, $this->checkUniqueAttributeField($definition[$rule_key], $rule));
            }
        }
        
        return $errors;
    }
    
    /**
     * Checking that definition contains deprecated fields
     *
     * @param Array $definition 
     * @param Array $rules 
     * @return array
     * @author Sergey Startsev
     */
    private function checkDeprecatedField(Array $definition, Array $rules)
    {
        $errors = array();
        foreach ($rules as $rule_key => $rule) {
            if (is_array($rule)) {
                if (!isset($definition[$rule_key])) continue;
                
                if (key($definition[$rule_key]) === 0 && is_array(current($definition[$rule_key]))) {
                    foreach ($definition[$rule_key] as $subpart) $errors = array_merge($errors, $this->checkDeprecatedField($subpart, $rule));
                    continue;
                }
                
                $errors = array_merge($errors, $this->checkDeprecatedField($definition[$rule_key], $rule));
                continue;
            }
            
            if ((is_string($rule_key) && isset($definition[$rule_key]) && $definition[$rule_key] === $rule) || isset($definition[$rule])) {
                $errors[] = "Field/attribute '{$rule_key}'='{$rule}' deprecated";
            }
        }
        
        return $errors;
    }
    
    /**
     * Process getting datasource class
     *
     * @param Array $definition 
     * @return string
     * @author Sergey Startsev
     */
    private function getDatasource(Array $definition)
    {
        if (isset($definition['i:datasource'])) {
            if (isset($definition['i:datasource']['i:class'])) {
                return $definition['i:datasource']['i:class'];
            }
        }
        
        return null;
    }
    
    /**
     * Getting rule for primary key
     *
     * @param Array $definition 
     * @return array
     * @author Sergey Startsev
     */
    private function getPrimaryKeyRule(Array $definition)
    {
        $datasource = $this->getDatasource($definition);
        if (!$datasource) return null;
        
        $pk = 'id';
        if (method_exists($datasource, 'getTableMap')) {
            $table_map = call_user_func(array($datasource, 'getTableMap'));
            $pk = key($table_map->getPrimaryKeys());
            
            if (method_exists($datasource, 'translateFieldName')) {
                $pk = call_user_func(array($datasource, 'translateFieldName'), $pk, BasePeer::TYPE_RAW_COLNAME, BasePeer::TYPE_FIELDNAME);
            }
        }
        
        $primary_key_rule = array(
            'i:fields' => array(
                'i:field' => array(
                    'attributes' => array(
                        'name' => $pk,
                    ),
                ),
            ),
        );
        
        return $primary_key_rule;
    }
    
}
