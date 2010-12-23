<?php

/**
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     startsev.sergey@gmail.com
 */
class afsDatabaseQueryActions extends sfActions
{
	public function preExecute()
	{
		$this->realRoot=sfConfig::get('sf_root_dir');
    }
    
    /**
     * Rendering json
     */
    protected function renderJson($result)
    {
         return $this->renderText(json_encode($result));
    }
    
    /**
     * Getting database list and all tables in this database
     */
    public function executeDatabaseList(sfWebRequest $request)
    {
        $aConfiguration = Propel::getConfiguration();
        
        // Extract default connection
        $sDefault = '';
        if (isset($aConfiguration['datasources']['default'])) {
            $sDefault = $aConfiguration['datasources']['default'];
            unset($aConfiguration['datasources']['default']);
        }
        
        /*
            array( 0=>array( text=>"Database1(10)", children=>array(#1), #2), 1=>array(text=>"Database2(5)",) [, ...] )
                где 
            #1 - same array as Database  children with leaf=>true (tables)
            #2 - additional properties
        */
                
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
        
        return $this->renderJson($aDatabases);
    }

    /**
     * Getting table information (columns types, foreign keys, etc.)
     */
    public function executeTable(sfWebRequest $request)
    {
        $table_name = $request->getParameter('name', false);
        
        if (!empty($table_name)) {
            $oPeer = afsDatabaseQuery::getPhpName($table_name) . 'Peer';
            $oTable = Propel::getDatabaseMap($oPeer::DATABASE_NAME)->getTable($table_name);
            
        } else {
            $oTable = false;
        }
        
        var_dump($oTable->getColumns());
        die;
        
        return $this->renderJson($oTable);
    }
    
    
}
