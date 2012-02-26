<?php

namespace AppFlower\Studio\Integrity\Rule\Model;

use AppFlower\Studio\Integrity\Rule\Base as Base;

/**
 * Model rule functionality
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Model extends Base
{
    /**
     * Original schema definition
     *
     * @var array
     */
    private $original_schema = null;
    
    /**
     * Propel schema definition 
     *
     * @var array
     */
    private $propel_schema = null;
    
    /**
     * Tables list
     *
     * @var array
     */
    private $tables_list = null;
    
    /**
     * Deprecated table names
     *
     * @var array
     */
    private $deprecated_table_names = array(
        'array',
    );
    
    /**
     * Deprecated field names 
     *
     * @var array
     */
    private $deprecated_field_names = array(
        'table_name',
        'database_name',
        'om_class',
        'class_default',
        'num_columns',
    );
    
    /**
     * Deprecated indexes names
     *
     * @var array
     */
    private $deprecated_indexes_names = array(
        'type',
    );
    
    /**
     * Query for show tables
     *
     * @var array
     */
    private $show_tables_query = array(
        'mysql' => 'SHOW TABLES',
        'pgsql' => "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE'",
    );
    
    /**
     * Feilds existings
     *
     * @return void
     * @author Sergey Startsev
     */
    protected function executeFieldsExisting()
    {
        // $this->addMessage($this->getMethodName(__METHOD__, true) . ': test');
    }
    
    /**
     * Checking tables for existings action
     *
     * @return void
     * @author Sergey Startsev
     */
    protected function executeTableExisting()
    {
        $properties_file = \sfConfig::get('sf_config_dir') . DIRECTORY_SEPARATOR . 'propel.ini';
        
        $schema_tables = $this->getTablesList();
        $database = Helper::getProperty($properties_file, 'propel.database.driver');
        
        $exclude = ($migration_table = Helper::getProperty($properties_file, 'propel.migration.table')) ? $migration_table : 'propel_migration';
        
        if (!array_key_exists($database, $this->show_tables_query)) return;
        
        $query = $this->show_tables_query[$database];
        
        $con = \Propel::getConnection();
        $stm = $con->prepare($query);
        $stm->execute();
        
        $result = $stm->fetchAll(\PDO::FETCH_UNIQUE);
        $db_tables = array_keys($result);
        
        if (!is_bool($key = array_search($exclude, $db_tables))) unset($db_tables[$key]);
        if (array_diff($schema_tables, $db_tables)) $this->addMessage('Current database and schema not synchronized');
    }
    
    /**
     * Schema checking action
     *
     * @return void
     * @author Sergey Startsev
     */
    protected function executeSchemaChecking()
    {
        $tables_list = $this->getTablesList();
        
        foreach ($this->getPropelSchema() as $schema_path =>$propel_schema) {
            $error_prefix = "in schema file {$schema_path}, ";
            foreach ($propel_schema['classes'] as $class_name => $class_definition) {
                if (empty($class_definition['columns'])) continue;
                foreach ($class_definition['columns'] as $column_name => $column_definition) {
                    if (is_null($column_definition)) continue;
                    if (is_array($column_definition)) {
                        $this->checkForeign($class_definition, $column_name, $column_definition);
                    }
                    
                    $this->checkFieldName($column_name, "{$error_prefix} in table name '{$class_definition['tableName']}', ");
                }
                
                $this->checkIndexes($class_definition, $error_prefix);
                $this->checkTablesNames($class_definition, $error_prefix);
            }
        }
    }
    
    /**
     * Checking indexes
     *
     * @param Array $fields 
     * @param string $error_prefix 
     * @return void
     * @author Sergey Startsev
     */
    private function checkIndexes(Array $fields, $error_prefix = '')
    {
        if (!array_key_exists('_indexes', $fields)) return;
        
        foreach ($fields['_indexes'] as $key_name => $keys) {
            if (in_array($key_name, $this->deprecated_indexes_names)) {
                $this->addMessage($error_prefix . "in table name '{$table_name}', index name '{$key_name}' deprecated");
            }
        }
    }
    
    /**
     * Checking field name
     *
     * @param string $field_name 
     * @param string $error_prefix 
     * @return void
     * @author Sergey Startsev
     */
    private function checkFieldName($field_name, $error_prefix = '')
    {
        if (in_array($field_name, $this->deprecated_field_names)) {
            $this->addMessage($error_prefix . "field '{$field_name}' deprecated");
        }
    }
    
    /**
     * Checking tables names
     *
     * @param Array $fields 
     * @param string $error_prefix 
     * @return void
     * @author Sergey Startsev
     */
    private function checkTablesNames(Array $fields, $error_prefix = '')
    {
        $table_name = $fields['tableName'];
        if (array_key_exists('_attributes', $fields) && array_key_exists('phpName', $fields['_attributes'])) {
            if (in_array(strtolower($fields['_attributes']['phpName']), $this->deprecated_table_names)) {
                $this->addMessage($error_prefix . "model name '{$fields['_attributes']['phpName']}' deprecated");
            }
        } elseif (in_array(strtolower($table_name), $this->deprecated_table_names)) {
            $this->addMessage($error_prefix . "table name '{$table_name}' deprecated");
        }
    }
    
    /**
     * Checking foreign keys functionality
     *
     * @param Array $class_definition
     * @param string $column_name
     * @param mixed $column_definition
     * @return void
     * @author Sergey Startsev
     */
    private function checkForeign(Array $class_definition, $column_name, $column_definition)
    {
        $tables_list = $this->getTablesList();
        
        if (!array_key_exists('foreignTable', $column_definition)) return;
        
        if (is_null($column_definition['foreignTable'])) {
            $this->addMessage("Foreign table name shouldn't be null. {$class_definition['tableName']}.{$column_name}");
        } else {
            if (!in_array($column_definition['foreignTable'], $tables_list)) {
                $this->addMessage("Foreign table doesn't exists in schema. {$class_definition['tableName']}.{$column_name}");
            }
        }
        
        if (array_key_exists('foreignReference', $column_definition)) {
            if (is_null($column_definition['foreignReference'])) {
                $this->addMessage("Foreign table reference shouldn't be null. {$class_definition['tableName']}.{$column_name}");
            }
        } else {
            $this->addMessage("For foreign table should be defined reference. {$class_definition['tableName']}.{$column_name}");
        }
    }
    
    /**
     * Getting main propel schema
     *
     * @return Array
     * @author Sergey Startsev
     */
    private function getPropelSchema()
    {
        if (is_null($this->propel_schema)) $this->loadSchemas();
        
        return $this->propel_schema;
    }
    
    /**
     * Getting main original schema
     *
     * @return Array
     * @author Sergey Startsev
     */
    private function getOriginalSchema()
    {
        if (is_null($this->original_schema)) $this->loadSchemas();
        
        return $this->original_schema;
    }
    
    /**
     * Getting tables list
     *
     * @return Array
     * @author Sergey Startsev
     */
    private function getTablesList()
    {
        if (is_null($this->tables_list)) {
            $this->tables_list = array();
            foreach ($this->getOriginalSchema() as $schema_path => $schema) {
                if (!is_array($schema)) continue;
                
                $schema_tables_list = current($schema);
                if (array_key_exists('_attributes', $schema_tables_list)) unset($schema_tables_list['_attributes']);
                $this->tables_list = array_merge($this->tables_list, array_keys($schema_tables_list));
            }
        }
        
        return $this->tables_list;
    }
    
    /**
     * Load schemas procedure
     *
     * @return void
     * @author Sergey Startsev
     */
    private function loadSchemas()
    {
        $this->dbSchema = new \sfPropelDatabaseSchema();
        $this->configuration = new \ProjectConfiguration(null, new \sfEventDispatcher());
        
        $dirs = array_merge(array(\sfConfig::get('sf_config_dir')), $this->configuration->getPluginSubPaths('/config'));
        
        $schemas = \sfFinder::type('file')->name('*schema.yml')->prune('doctrine')->maxdepth(0)->in($dirs);
        foreach ($schemas as $schema_path) {
            $schema = (DIRECTORY_SEPARATOR != '/') ? str_replace('/', DIRECTORY_SEPARATOR, $schema_path) : $schema_path;
            $this->original_schema[$schema] = \sfYaml::load($schema);
            
            if (!is_array($this->original_schema[$schema])) continue;
            if (!isset($this->original_schema[$schema]['classes'])) {
                $this->propel_schema[$schema] = $this->dbSchema->convertOldToNewYaml($this->original_schema[$schema]);
            }
            
            $customSchemaFilename = str_replace(array(
                str_replace(DIRECTORY_SEPARATOR, '/', \sfConfig::get('sf_root_dir')).'/',
                'plugins/',
                'config/',
                '/',
                'schema.yml'
            ), array('', '', '', '_', 'schema.custom.yml'), $schema);
            $customSchemas = \sfFinder::type('file')->name($customSchemaFilename)->in($dirs);
            
            foreach ($customSchemas as $customSchema) {
                $this->original_schema[$customSchema] = \sfYaml::load($customSchema);
                if (!isset($this->original_schema[$customSchema]['classes'])) {
                    $this->propel_schema[$customSchema] = $this->dbSchema->convertOldToNewYaml($this->original_schema[$customSchema]);
                }
            }
        }
    }
    
}
