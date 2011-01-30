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
                'name' => $aDsnInfo['dbname'],
            	'tables_num' => count($aTables),
            	'connection' =>  $db_connection
            );
            
            $tables = array();
            foreach ((array)$aTables as $sTable) {
                $tables[] = $sTable;
            }
            
            $database['tables'] = $tables;
            
            $aDatabases[] = $database;
        }
        
        return $aDatabases;
    }
    
    /**
     * Returns ExtJS data for DBStructureTree component
     * @return array the tree structure
     */
    public function getExtDatabaseStructureTree()
    {
    	$tree = array();
    	
    	$dbList = $this->processDatabaseList();
    	foreach ($dbList as $db) {
    		$treeNode = array(
                'text'    => $db['name'] . ' (' . $db['tables_num'] . ')',
    			'connection' => $db['connection'],
                'iconCls' => 'icon-tree-db',
                'expanded' => true
            );

            $tables = array();
            foreach ($db['tables'] as $t) {
                $tables[] = array(
                	'text' => $t['tableName'],
                	'model' => $t['modelName'],
                	'schema' => $t['schemaFile'],
                	'iconCls' => 'icon-tree-table', 
                	'leaf' => true
                );
            }
            
    		$treeNode['children'] = $tables;    		
    		$tree[] = $treeNode;
    	}
    	
    	return $tree;
    }
    
    /**
     * Execute query helper method
     * 
     * @param $query Query which will be processed
     * @param $connection Connection name for executing query
     * @param $type Type of query (sql, propel)
     * @param $offset Offset for query
     * @param $limit Limit for query
     * @return array
     */
    public function processQuery($query, $connection, $type = 'sql', $offset = 0, $limit = 50)
    {
        $result = afsDatabaseQuery::processQuery($query, $connection, $type, $offset, $limit);
        
        if ($result['success'] && $result['type'] == 'success') {
            
            $nTotal = $result['content']['count'];
            
            if (isset($result['content']['result'][0])) {
                $aFields = array_keys($result['content']['result'][0]);
                
                $return = array(
                                'success' => true,
                                'type' => 'success',
                                'meta' => $aFields,
                                'data' => $result['content']['result']
                );
            }
        } else {
            $return = $result;
        }
        
        return $return;
    }
    
    
    
}

