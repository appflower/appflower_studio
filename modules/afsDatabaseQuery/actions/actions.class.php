<?php
/**
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     startsev.sergey@gmail.com
 */
class afsDatabaseQueryActions extends afsActions
{
    /**
     * DB Query helper instance
     */
    private $oDBQueryHelper;
    
    /**
     * Pre Execute action
     *
     * @author Sergey Startsev <startsev.sergey@gmail.com>
     */
	public function preExecute()
	{
        // check is this ajax request
	    if (!$this->getRequest()->isXmlHttpRequest()) {
            $this->forward404("This action should be used only for ajax requests");
        }
        
		$this->realRoot = sfConfig::get('sf_root_dir');
        
        // initialize query helper
        $this->oDBQueryHelper = new afsDatabaseQueryHelper;
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
    public function executeComplexQuery(sfWebRequest $request)
    {
        $response = $this->processQuery($request);
        
        return $this->renderJson($response);
    }
    
    /**
     * Execute one query action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev <startsev.sergey@gmail.com>
     */
    public function executeQuery(sfWebRequest $request)
    {
        $response = $this->processQuery($request);
        
        if (isset($response['dataset']) && !empty($response['dataset'])) {
            $response = current($response['dataset']);
        }
        
        return $this->renderJson($response);
    }
    
    /**
     * Process query functionality
     *
     * @param sfWebRequest $request 
     * @return Array
     * @author Sergey Startsev <startsev.sergey@gmail.com>
     */
    private function processQuery(sfWebRequest $request)
    {
        $sQuery = $request->getParameter('query', '');
        $sConnection = $request->getParameter('connection', 'propel');
        $sType = $request->getParameter('type', 'sql');
        
        $nOffset = $request->getParameter('start', 0);
        $nLimit = $request->getParameter('limit', 50);
        
        $response = $this->oDBQueryHelper->processQuery($sQuery, $sConnection, $sType, $nOffset, $nLimit);
        
        afsNotificationPeer::log('Database query was executed', 'afStudioDBQuery');
        
        return $response;
    }
    
}
