<?php
/**
 * Database Query Helper class 
 * 
 * @author startsev.sergey@gmail.com
 */
class afsDatabaseQueryHelper
{
    
    /**
     * Databases and tables list helper
     * 
     * @return array
     */
    public function processDatabaseList()
    {
        $aConfiguration = Propel::getConfiguration();
        
        // Extract default connection
        $sDefault = '';
        if (isset($aConfiguration['datasources']['default'])) {
            $sDefault = $aConfiguration['datasources']['default'];
            unset($aConfiguration['datasources']['default']);
        }
        
        $aDatabases = array();
        
        // Generating response 
        foreach ($aConfiguration['datasources'] as $db_connection => $db_connecttion_info) {
            $sDsn = $db_connecttion_info['connection']['dsn'];
            
            $aDsnInfo = afsDatabaseQuery::parseDSN($sDsn);
            $aTables = afsDatabaseQuery::getTables($db_connection);
            
            // Generate list of databases and tables
            $database = array(
                'text'    => $aDsnInfo['dbname'] . ' (' . count($aTables) . ')',
                'iconCls' => 'icon-tree-db',
                'expanded' => true
            );
            
            $tables = array();
            foreach ((array)$aTables as $sTable) {
                $tables[] = array('text' => $sTable, 'iconCls' => 'icon-tree-table', 'leaf' => true);
            }
            
            $database['children'] = $tables;
            
            $aDatabases[] = $database;
        }
        
        return $aDatabases;
    }
    
    /**
     * Getting table information (columns types, foreign keys, etc.) Helper
     */
    public function processTable($connection_name, $table_name)
    {
        if (!empty($table_name)) {
            $oPeer = afsDatabaseQuery::getPeerName($table_name);
            
            $oTable = Propel::getDatabaseMap($oPeer::DATABASE_NAME)->getTable($table_name);
            
        } else {
            $oTable = false;
        }
        
        // $oDatabase;
        
        var_dump($oTable->getColumns());
    }
    
}

