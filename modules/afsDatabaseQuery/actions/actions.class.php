<?php

/**
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     startsev.sergey@gmail.com
 */
class afsDatabaseQueryActions extends sfActions
{
    private $oDBQueryHelper;
    
    private $modelName;
    private $modelQueryClass;
    
	public function preExecute()
	{
		$this->realRoot = sfConfig::get('sf_root_dir');
        
        // initialize query helper
        $this->oDBQueryHelper = new afsDatabaseQueryHelper();
    }
    
    /**
     * Rendering json
     */
    protected function renderJson($result)
    {
        $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
        return $this->renderText(json_encode($result));
    }
    
    /**
     * Getting database list and all tables in this database
     */
    public function executeDatabaseList(sfWebRequest $request)
    {
        $aDatabases = $this->oDBQueryHelper->getExtDatabaseStructureTree();
        return $this->renderJson($aDatabases);
    }
    
    /**
     * Execute query action
     * 
     * Examples:
     * SQL:     http://studio/afsDatabaseQuery/query?query=select%20*%20from%20af_guard_group
     *          SELECT * FROM af_guard_group
     * 
     * Propel:  http://studio/afsDatabaseQuery/query?query=TimeZonesQuery::create()->findPK(1);&type=propel
     *          TimeZonesQuery::create()->findPK(1)
     */
    public function executeQuery(sfWebRequest $request)
    {
        $sQuery = $request->getParameter('query', '');
        $sConnection = $request->getParameter('connection', 'propel');
        $sType = $request->getParameter('type', 'sql');
        
        $nOffset = $request->getParameter('start', 0);
        $nLimit = $request->getParameter('limit', 50);
        
        $aResult = $this->oDBQueryHelper->processQuery($sQuery, $sConnection, $sType, $nOffset, $nLimit);
        
        return $this->renderJson($aResult);
    }
    
}
