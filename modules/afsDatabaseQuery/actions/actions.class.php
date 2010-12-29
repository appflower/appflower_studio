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
     * Getting table information
     */
    public function executeTable(sfWebRequest $request)
    {
        
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
    
    public function executeTest(sfWebRequest $request)
    {
        afsDatabaseQuery::getDatabaseList('propel');
        
        die;
    }

}
