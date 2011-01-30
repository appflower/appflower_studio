<?php
/**
 * Database Query class 
 * 
 * @author startsev.sergey@gmail.com
 */
class afsDatabaseQuery 
{
    /**
     * Getting Adaptee class
     * 
     * @param $connection_name db connection name
     * @param $type Type of created adaptee
     * @return object
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
     * @param $query This query will be executed
     * @param $connection Connection name 
     * @param $type Query type: sql or propel
     * @param $offset 
     * @param $limit
     * @return mixed
     */
    public static function processQuery($query, $connection = 'propel', $type = 'sql', $offset = 0, $limit = 50)
    {
        $oAdapter = self::getAdapter($connection, $type);
        $aResult = $oAdapter->process($query, $offset, $limit);
        return $aResult;
    }
    
    /**
     * Parse dsn field
     * 
     * @param $dsn DSN string example:  mysql:dbname=studio;host=localhost
     * @return string
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
     * @param $connection_name db connection name
     * @return array
     */
    public static function getTables($connection_name)
    {
        $oStudioModels = new afStudioModelsCommand();
        
        $tables = array();
        foreach ($oStudioModels->propelSchemaArray as $schemaFile => $array)
        {
            if ($array['connection'] == $connection_name) {
                foreach ($array['classes'] as $phpName => $attributes)
                {
                    $attributes['modelName'] = $phpName;
                    $attributes['schemaFile'] = $schemaFile;
                    $tables[] = $attributes;
                }
            }
        }
        
        return $tables;
    }

}

