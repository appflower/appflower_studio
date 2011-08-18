<?php
/**
 * Database Query class 
 * 
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsDatabaseQuery 
{
    /**
     * Adapter class prefix
     */
    const ADAPTER_PREFIX = 'afsDatabaseQuery';
    
    /**
     * Getting Adaptee class
     * 
     * @param string $connection_name - db connection name
     * @param string $type - Type of created adaptee
     * @return object
     * @author Sergey Startsev
     */
    static public function getAdapter($connection_name, $type)
    {
        $class_name = self::getAdapterName($type);
        if (!class_exists($class_name)) {
            throw new afsDatabaseQueryException("Class '{$class_name}' adapter doesn't exists");
        }
        
        $reflection = new ReflectionClass($class_name);
        
        return $reflection->newInstanceArgs(array($connection_name));
    }
    
    /**
     * Processing query via connection and query type
     * 
     * @param string $query - This query will be executed
     * @param string $connection - Connection name 
     * @param string $type - Query type: sql or propel
     * @param int $offset 
     * @param int $limit
     * @return afResponse
     * @author Sergey Startsev
     */
    static public function processQuery($query, $connection = 'propel', $type = 'sql', $offset = 0, $limit = 50)
    {
        return self::getAdapter($connection, $type)->process($query, $offset, $limit);
    }
    
    /**
     * Getting adapter name rule
     *
     * @param string $type 
     * @return string
     * @author Sergey Startsev
     */
    static public function getAdapterName($type)
    {
        return self::ADAPTER_PREFIX . ucfirst(strtolower($type));
    }
    
    /**
     * Parse dsn field
     * 
     * @param string $dsn - DSN string example:  mysql:dbname=studio;host=localhost
     * @return array
     * @author Sergey Startsev
     */
    static public function parseDSN($dsn)
    {
        $info = array();
        list($info['driver'], $info['query']) = explode(':', $dsn);
        
        if (isset($info['query'])) {
            $opts = explode(';', $info['query']);
            foreach ($opts as $opt) {
                list($key, $value) = explode('=', $opt);
                if (!isset($parsed[$key])) $parsed[$key] = urldecode($value);
            }
        }
        
        return $parsed;
    }
    
    /**
     * Getting tables from parsed yaml schema
     * 
     * @param string $connection_name - db connection name
     * @return array
     * @author Sergey Startsev
     */
    static public function getTables($connection_name)
    {
        $tables = array();
        foreach ((array) self::getSchemas() as $schemaFile => $array) {
            if ($array['connection'] == $connection_name) {
                foreach ($array['classes'] as $phpName => $attributes) {
                    $attributes['modelName'] = $phpName;
                    $attributes['schemaFile'] = $schemaFile;
                    $tables[] = $attributes;
                }
            }
        }
        
        return $tables;
    }
    
    /**
     * Getting schemas array from configs
     * 
     * @return array - Connections and tables
     * @author Sergey Startsev
     */
    static private function getSchemas()
    {
        $aPropelSchemaArray = array();
        $configuration = new ProjectConfiguration(null, new sfEventDispatcher());
        $db_schema = new sfPropelDatabaseSchema();
        
        $dirs = array_merge(array(sfConfig::get('sf_config_dir')), $configuration->getPluginSubPaths('/config'));
        foreach ($dirs as $k => $dir) {
            if (substr_count($dir, 'appFlower') > 0 || substr_count($dir, 'sfPropelPlugin') > 0 || substr_count($dir, 'sfProtoculousPlugin') > 0) {
                unset($dirs[$k]);
            }
        }
        $dirs = array_values($dirs);
        
        $schemas = sfFinder::type('file')->name('*schema.yml')->prune('doctrine')->in($dirs);
        
        foreach ($schemas as $schema) {
            $aOriginalSchemaArray[$schema] = sfYaml::load($schema);

            if (!is_array($aOriginalSchemaArray[$schema])) {
                $aOriginalSchemaArray[$schema];
                continue; // No defined schema here, skipping
            }
    
            if (!isset($aOriginalSchemaArray[$schema]['classes'])) {
                // Old schema syntax: we convert it
                $aPropelSchemaArray[$schema] = $db_schema->convertOldToNewYaml($aOriginalSchemaArray[$schema]);
            }
    
            $customSchemaFilename = str_replace(array(
                str_replace(DIRECTORY_SEPARATOR, '/', sfConfig::get('sf_root_dir')).'/',
                'plugins/',
                'config/',
                '/',
                'schema.yml'
            ), array('', '', '', '_', 'schema.custom.yml'), $schema);
            $customSchemas = sfFinder::type('file')->name($customSchemaFilename)->in($dirs);
    
            foreach ($customSchemas as $customSchema) {
                $aOriginalSchemaArray[$customSchema] = sfYaml::load($customSchema);
                if (!isset($aOriginalSchemaArray[$customSchema]['classes'])) {
                    // Old schema syntax: we convert it
                    $aPropelSchemaArray[$customSchema] = $db_schema->convertOldToNewYaml($$aOriginalSchemaArray[$customSchema]);
                }
            }
        }
        
        return $aPropelSchemaArray;
    }

}
