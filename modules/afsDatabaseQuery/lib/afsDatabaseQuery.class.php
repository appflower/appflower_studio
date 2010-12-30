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
     * @return object
     */
    public static function getAdapter($connection_name)
    {
        $adapter = get_class(Propel::getDatabaseMap($connection_name)->getDBAdapter());
        
        $class_name = $adapter.'Query';
        $oAdapter = new $class_name;
        
        return new $oAdapter;
    }

    /**
     * Getting tables from adapter
     * 
     * @param $connection_name db connection name
     * @return array
     */
    /*
    public static function getTables($connection_name)
    {
        $oAdapter = self::getAdapter($connection_name);
        $oAdapter->setConnection(Propel::getConnection($connection_name));
        
        $aTables = $oAdapter->getTables();
        return $aTables;
    }
    */
    /**
     * Getting generated name of table via table name in db
     * 
     * @param $schemaName Schema name 
     * @return string
     */
    public static function getPhpName($schemaName)
    {
        $name = "";
        $tok = strtok($schemaName, '_');
        while ($tok !== false) {
            $name .= ucfirst($tok);
            $tok = strtok('_');
        }
        return $name;
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
     * Get peer name by table name
     * 
     * @param @table_name Table name
     * @return string
     */
    public static function getPeerName($table_name)
    {
        return self::getPhpName($table_name) . 'Peer';
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
