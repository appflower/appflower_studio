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
    
    /**
     * Processing query via connection and query type
     * 
     * @param $query This query will be executed
     * @param $connection Connection name 
     * @param $type Query type: sql or propel
     * @return mixed
     */
    public static function processQuery($query, $connection = 'propel', $type = 'sql')
    {
        /**
         * TODO: separate via adapter instead case
         */
        
        switch ($type) {
            
            case 'sql':
                
                /**
                 * TODO: Prepare sql query
                 */
                
                $con = Propel::getConnection($connection);
                $stm = $con->prepare($query);
                $stm->execute();
                
                $result = $stm->fetchAll(PDO::FETCH_ASSOC);
                break;
                
            case 'propel':
                /**
                 * TODO: Prepare query to execute
                 */
                 
                eval('$execute_query = ' . $query);
                
                // $execute_query = TimeZonesQuery::create()->joinafGuardUserProfile('FirstName')->find();
                // $execute_query = TimeZonesQuery::create()->withColumn('TimeZones.Id', 'temp_id')->find();
                // $execute_query = TimeZonesQuery::create()->withColumn('TimeZones.Id', 'temp_id')->findPk(1);
                
                $sClass = get_class($execute_query);
                
                if ($sClass == 'PropelObjectCollection') {
                    $oFormatter = $execute_query->getFormatter();
                    
                    $aResult = (array)$execute_query;
                    
                    if (count($aResult) > 0) {
                        $aObject = $execute_query[0];
                        $aFields = self::getFields($aObject);
                        
                        $result = self::prepareList($aResult);
                    } else {
                        $result = false;
                    }
                } else {
                    $result = self::prepareOutput($execute_query);
                }
                break;
        }
        
        return $result;
    }

    public static function getFields($oCollection, $type = 'all')
    {
        if (is_object($oCollection)) {
            $aFields = array();
            
            $aNative = $oCollection->toArray('fieldName');
            $aVirtual = $oCollection->getVirtualColumns();
            
            switch ($type) {
                case 'native':
                    $aFields = array_keys($aNative);
                    break;
                
                case 'virtual':
                    $aFields = array_keys($aVirtual);
                    break;
                    
                case 'all':
                default:
                    $aFields = array_keys(array_merge($aNative, $aVirtual));
                    break;
            }
            
            return $aFields;
        } else {
            return false;
        }
    }
    
    public static function prepareOutput($object)
    {
        return array_merge($object->toArray('fieldName'), $object->getVirtualColumns());
    }
    
    public static function prepareList($aList)
    {
        $aResult = array();
        foreach ((array)$aList as $object) {
            $aResult[] = self::prepareOutput($object);
        }
        
        return $aResult;
    }
    

}

