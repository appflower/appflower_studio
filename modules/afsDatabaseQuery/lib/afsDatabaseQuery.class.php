<?php
/**
 * Database Query class 
 * 
 * @author startsev
 */
class afsDatabaseQuery 
{
    /**
     * getting Adaptee class
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
     */
    public static function getTables($connection_name)
    {
        $oAdapter = self::getAdapter($connection_name);
        $oAdapter->setConnection(Propel::getConnection($connection_name));
        
        $aTables = $oAdapter->getTables();
        return $aTables;
    }
    
    /**
     * Getting generated name of table via table name in db
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
  
}

