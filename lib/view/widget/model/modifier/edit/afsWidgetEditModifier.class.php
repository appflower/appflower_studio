<?php
/**
 * Edit widget modifier
 *
 * @author Łukasz Wojciechowski <luwo@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetEditModifier extends afsBaseModelModifier 
{
    /**
     * Datasource class name
     *
     * @var string
     */
    private $datasource;
    
    /**
     * Modify process
     *
     * @param afsBaseModel $model 
     * @return afsBaseModel
     * @author Łukasz Wojciechowski 
     * @author Sergey Startsev
     */
    public function modify(afsBaseModel $model)
    {
        $definition = $model->getDefinition();
        
        $this->datasource = afsWidgetEditModifierHelper::getDatasource($definition);
        
        if ($model->isNew()) {
            $definition = $this->checkAndCreateFieldsUrlAttribute($definition, $model);
            $definition = afsWidgetEditPredictionModifier::create($definition)->fieldTypes()->getDefinition();
        }
        
        $definition = $this->searchForAndModifyForeignTableFields($definition);
        $definition = $this->setFieldsDefaultValuePlaceholder($definition);
        
        $model->setDefinition($definition);
        
        return $model;
    }
    
    /**
     * Getting datasource class name
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getDatasource()
    {
        return $this->datasource;
    }
    
    /**
     * Search and modify foreign table fields
     *
     * @param string $definition 
     * @return array
     * @author Łukasz Wojciechowski 
     */
    private function searchForAndModifyForeignTableFields(Array $definition)
    {
        if (isset($definition['i:fields']) ) {
            $fields = $definition['i:fields'];
            
            if (isset($fields['i:field'])) {
                $fields = $fields['i:field'];
                
                if (is_array($fields) && count($fields) > 0) {
                    if (!is_numeric(key($fields))) $fields = array($fields);
                    
                    foreach ($fields as $fieldKey => $field) {
                        $modifiedField = $this->checkAndModifyForeignTableField($field);
                        if ($modifiedField) $definition['i:fields']['i:field'][$fieldKey] = $modifiedField;
                    }
                }
            }
        }
        
        return $definition;
    }
    
    /**
     * Check and modify foreign table field
     *
     * @param Array $fieldDefinition 
     * @return array
     * @author Łukasz Wojciechowski
     */
    private function checkAndModifyForeignTableField(Array $fieldDefinition)
    {
        $peerClassName = $this->getDatasource();
        
        if (!is_null($peerClassName)) {
            /* @var $tableMap TableMap */
            $tableMap = call_user_func("{$peerClassName}::getTableMap");
            
            $columnName = $fieldDefinition['attributes']['name'];
            
            if ($tableMap->hasColumn($columnName)) {
                /* @var $column ColumnMap */
                $column = $tableMap->getColumn($columnName);
                
                if ($column->isForeignKey()) {
                    $fieldDefinition['attributes']['type'] = 'combo';
                    $fieldDefinition['attributes']['selected'] = '{'.$columnName.'}';
                    
                    $fieldDefinition['i:value'] = array(
                        'attributes' => array('type' => 'orm'),
                        'i:class' => afsWidgetEditModifierHelper::MODEL_CRITERIA_FETCHER,
                        'i:method' => array(
                            'attributes' => array('name' => afsWidgetEditModifierHelper::FETCHER_METHOD),
                            'i:param' => array(
                                array(
                                    'attributes' => array('name' => 'modelName'),
                                    '_content' => $column->getRelation()->getForeignTable()->getPhpName()
                                )
                            )
                        )
                    );
                    
                }
            }
        }
        
        return $fieldDefinition;
    }
    
    /**
     * Search for fields without value and without i:value and set default placeholder value
     *
     * @todo Refactor code responsible for iterating over fields - this piece of
     *       code was copied form very similar searchForAndModifyForeignTableFields() method
     * 
     * @param array $definition 
     * @return array
     * @author Łukasz Wojciechowski 
     */
    private function setFieldsDefaultValuePlaceholder(Array $definition)
    {
        if (isset($definition['i:fields']) ) {
            $fields = $definition['i:fields'];
            
            if (isset($fields['i:field'])) {
                $fields = $fields['i:field'];
                
                if (is_array($fields) && count($fields) > 0) {
                    if (!is_numeric(key($fields))) $fields = array($fields);
                    
                    foreach ($fields as $fieldKey => $field) {
                        $modifiedField = $this->checkAndModifyDefaultValuePlaceholder($field);
                        if ($modifiedField) $definition['i:fields']['i:field'][$fieldKey] = $modifiedField;
                    }
                }
            }
        }
        
        return $definition;
    }
    

    
    /**
     * Check and modify default value placeholder
     *
     * @param Array $fieldDefinition 
     * @return array
     * @author Łukasz Wojciechowski
     */
    private function checkAndModifyDefaultValuePlaceholder(Array $fieldDefinition)
    {
        $peerClassName = $this->getDatasource();
        
        if (!is_null($peerClassName)) {
            /* @var $tableMap TableMap */
            $tableMap = call_user_func("{$peerClassName}::getTableMap");
            
            $columnName = $fieldDefinition['attributes']['name'];
            
            if ($tableMap->hasColumn($columnName)) {
                if ( !isset($fieldDefinition['i:value']) && !isset($fieldDefinition['attributes']['value'])) {
                    $fieldDefinition['attributes']['value'] = '{'.$columnName.'}';
                }
            }
        }
        
        return $fieldDefinition;
    }
    
    
    /**
     * If i:fields url attribute is not set we are generating it with default id parameter
     *
     * @param array $definition 
     * @param afsWidgetModel $widgetModel
     * @return array
     * @author Łukasz Wojciechowski 
     */
    private function checkAndCreateFieldsUrlAttribute(Array $definition, afsWidgetModel $widgetModel)
    {
        if (isset($definition['i:fields']) ) {
            $fields = $definition['i:fields'];
            if (!isset($fields['attributes']['url'])) {
                $fields['attributes']['url']
                    = $widgetModel->getModule() . '/' .$widgetModel->getAction() . '?id={id}';
            }
            $definition['i:fields'] = $fields;
        }
        
        return $definition;
    }
    
}
