<?php
/**
 * Database Query class 
 * 
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsDatabaseQuery 
{
    /**
     * Getting Adaptee class
     * 
     * @param string $connection_name - db connection name
     * @param string $type - Type of created adaptee
     * @return object
     * @author Sergey Startsev
     */
    public static function getAdapter($connection_name, $type)
    {
        $class_name = 'afsDatabaseQuery' . ucfirst(strtolower($type));
        $oAdapter = new $class_name($connection_name);
        
        return $oAdapter;
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
    public static function processQuery($query, $connection = 'propel', $type = 'sql', $offset = 0, $limit = 50)
    {
        return self::getAdapter($connection, $type)->process($query, $offset, $limit);
    }
    
    /**
     * Parse dsn field
     * 
     * @param string $dsn - DSN string example:  mysql:dbname=studio;host=localhost
     * @return string
     * @author Sergey Startsev
     */
    public static function parseDSN($dsn)
    {
        $info = array();
        list($info['driver'], $info['query']) = explode(':', $dsn);
        
        if (isset($info['query'])) {
            $opts = explode(';', $info['query']);
                foreach ($opts as $opt) {
                    list($key, $value) = explode('=', $opt);
                    if (!isset($parsed[$key])) {
                        $parsed[$key] = urldecode($value);
                    }
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
    public static function getTables($connection_name)
    {
        $aPropelSchemaArray = self::getSchemas();
        
        $tables = array();
        
        if(count($aPropelSchemaArray)>0)
        {
        
            foreach ($aPropelSchemaArray as $schemaFile => $array)
            {
                if (count($array)>0 && isset($array['connection']) && $array['connection'] == $connection_name) {
                    foreach ($array['classes'] as $phpName => $attributes)
                    {
                        $attributes['modelName'] = $phpName;
                        $attributes['schemaFile'] = $schemaFile;
                        $tables[] = $attributes;
                    }
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
    private static function getSchemas()
    {
        $configuration = new ProjectConfiguration(null, new sfEventDispatcher());
        $finder = sfFinder::type('file')->name('*schema.yml')->prune('doctrine');
        $dirs = array_merge(array(sfConfig::get('sf_config_dir')), $configuration->getPluginSubPaths('/config'));
        
        $db_schema = new sfPropelDatabaseSchema();
        
        foreach ($dirs as $k => $dir) {
            if(substr_count($dir, 'appFlower')>0 || substr_count($dir, 'sfPropelPlugin') > 0 || substr_count($dir, 'sfProtoculousPlugin') > 0) {
                unset($dirs[$k]);
            }
        }
        
        $dirs = array_values($dirs);
        
        $schemas = $finder->in($dirs);
        
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
                if (!isset($aOriginalSchemaArray[$customSchema]['classes']))
                {
                    // Old schema syntax: we convert it
                    $aPropelSchemaArray[$customSchema] = $db_schema->convertOldToNewYaml($$aOriginalSchemaArray[$customSchema]);
                }
            }
        }
        
        return $aPropelSchemaArray;
    }

}

