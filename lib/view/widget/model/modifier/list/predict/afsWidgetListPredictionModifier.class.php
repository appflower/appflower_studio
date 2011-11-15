<?php
/**
 * Widget list prediction modifier
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetListPredictionModifier extends afsBasePredictionModifier
{
    /**
     * Default field filter
     */
    const DEFAULT_FIELD_FILTER = 'string';
    
    /**
     * Field type filter map
     *
     * @var array
     */
    private $field_type_filter_map = array(
        'DATE'          => 'date',
        'TIMESTAMP'     => 'date',
        'LONGVARCHAR'   => 'text',
        'VARCHAR'       => 'string',
        'INTEGER'       => 'numeric',
        'NUMERIC'       => 'numeric',
        'TINYINT'       => 'numeric',
        'BIGINT'        => 'numeric',
        'FLOAT'         => 'numeric',
        'REAL'          => 'numeric',
        'DOUBLE'        => 'numeric',
        'DECIMAL'       => 'numeric',
        'BOOLEAN'       => 'TRUE_FALSE_NUMERIC',
    );
    
    /**
     * Private constructor
     */
    private function __construct() {}
    
    /**
     * Fabric method creator
     *
     * @param array $definition 
     * @return afsWidgetListPredictionModifier
     * @author Sergey Startsev
     */
    static public function create(array $definition = array())
    {
        $instance = new self;
        $instance->setDefinition($definition);
        
        return $instance;
    }
    
    /**
     * Process filtering definition
     *
     * @param boolean $is_remote 
     * @return afsWidgetListPredictionModifier
     * @author Sergey Startsev
     */
    public function filtering($is_remote = true)
    {
        if (array_key_exists('i:fields', $this->definition)) {
            $this->definition['i:fields']['attributes']['remoteFilter'] = (($is_remote) ? 'true' : 'false');
        }
        
        $fields = $this->getFields();
        
        $definition = $this->getDefinition();
        $modelName = afsWidgetListModifierHelper::getDatasource($definition);
        
        if (!is_null($modelName)) {
            $peerClassName = "{$modelName}Peer";
            $tableName = $peerClassName::TABLE_NAME;
            $tableMap = call_user_func("{$modelName}Peer::getTableMap");
            
            foreach ($fields as &$field) {
                $columnName = $field['attributes']['name'];
                if (!$tableMap->hasColumn($columnName)) continue;
                
                $column = $tableMap->getColumn($columnName);
                if ($column->isForeignKey()) {
                    $field['attributes']['filter'] = $this->getForeignFilter($tableName, $columnName, $column->getRelation()->getForeignTable()->getPhpName());
                    continue;
                }
                
                $field['attributes']['filter'] = $this->getFilter($tableName, $columnName, $column->getType());
            }
        }
        
        $this->setFields($fields);
        
        return $this;
    }
    
    /**
     * Process sorting fields 
     *
     * @param boolean $is_remote 
     * @return afsWidgetListPredictionModifier
     * @author Sergey Startsev
     */
    public function sorting($is_remote = true)
    {
        if (array_key_exists('i:fields', $this->definition)) {
            $this->definition['i:fields']['attributes']['remoteSort'] = (($is_remote) ? 'true' : 'false');
        }
        
        return $this;
    }
    
    /**
     * Getting filter from map
     *
     * @param string $table_name 
     * @param string $column_name 
     * @param string $column_type 
     * @return string
     * @author Sergey Startsev
     */
    private function getFilter($table_name, $column_name, $column_type)
    {
        $type = (array_key_exists($column_type, $this->field_type_filter_map)) ? $this->field_type_filter_map[$column_type] : self::DEFAULT_FIELD_FILTER;
        
        return "[type:{$type},dataIndex:{$table_name}.{$column_name}]";
    }
    
    /**
     * Getting foreign filter definition
     *
     * @param string $table_name 
     * @param string $column_name 
     * @param string $foreign_table 
     * @return string
     * @author Sergey Startsev
     */
    private function getForeignFilter($table_name, $column_name, $foreign_table)
    {
        return "[class:ModelCriteriaFetcher,method:filterData,param:{$foreign_table},dataIndex:{$table_name}.{$column_name}]";
    }
    
    /**
     * Getting fields list
     *
     * @return array
     * @author Sergey Startsev
     */
    private function getFields()
    {
        $fields = array();
        if (isset($this->definition['i:fields']) ) {
            $fields = $this->definition['i:fields']['i:column'];
            if (!is_numeric(key($fields))) $fields = array($fields);
        }
        
        return $fields;
    }
    
    /**
     * Update fields list
     *
     * @param Array $fields 
     * @return void
     * @author Sergey Startsev
     */
    private function setFields(Array $fields)
    {
        $this->definition['i:fields']['i:column'] = $fields;
    }
    
}
