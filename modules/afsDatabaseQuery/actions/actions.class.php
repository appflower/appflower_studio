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
     */
    public function executeQuery(sfWebRequest $request)
    {
        /* 
         * http://studio/afsDatabaseQuery/query?query=select%20*%20from%20af_guard_group
         * SELECT * FROM af_guard_group
         */
        
        $sQuery = $request->getParameter('query', '');
        $sConnection = $request->getParameter('connection', 'propel');
        $sType = $request->getParameter('type', 'sql');
        
        $aResult = $this->oDBQueryHelper->processQuery($sQuery, $sConnection, $sType);
        
        return $this->renderJson($aResult);
    }
    

    /**
     * Getting table information
     */
    public function executeTable(sfWebRequest $request)
    {
        /*
         * http://studio/appFlowerStudio/models?xaction=read&model=TimeZones&schema=C:/xampp/htdocs/studio/config/schema.yml
         */
        
        
        $modelName = $this->getRequest()->getParameter('model');
        $modelQueryClass = "{$modelName}Query";
        if (!class_exists($modelName)) {
            throw new Exception("Model $modelName probably does not exist. Could not find class named $modelName");
        }
        
        // var_dump($modelQueryClass);
        
        // $oModel = new afStudioModelsCommand();
        // var_dump($oModel);
        die;
        
        
        
        /*
        $table_name = $request->getParameter('name', false);
        $connection_name = $request->getParameter('connection', false);
        
        $aInfo = $this->oDBQueryHelper->processTable($connection_name, $table_name);
        
        
        
        var_dump($aInfo);
        die;
        */
        // return $this->renderJson($oTable);
    }
    
}
