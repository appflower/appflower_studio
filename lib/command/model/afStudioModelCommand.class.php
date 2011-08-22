<?php
/**
 * Studio model command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModelCommand extends afBaseStudioCommand
{
    /**
     * Model name
     */
    protected $modelName = null;
    
    /**
     * Schema file path
     */
    protected $schemaFile = null;
    
    /**
     * Modificator instance
     */
    private $modificator = null;
    
    /**
     * Getting modificator instance - with lazy load
     *
     * @return afStudioModelCommandModificator
     * @author Sergey Startsev
     */
    protected function getModificator()
	{
	    if (is_null($this->modificator)) {
	        $this->modificator = new afStudioModelCommandModificator($this->modelName, $this->schemaFile, $this->getCommand());
	    }
	    
	    return $this->modificator;
	}
    
    /**
     * Pre-process method
     *
     * @author Sergey Startsev
     */
    protected function preProcess()
    {
        $this->modelName = $this->getParameter('model');
        $this->schemaFile = $this->getParameter('schema');
    }
    
    /**
     * Checking existed model or not
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processHas()
    {
        if (!is_null($this->getModificator()->getSchemaByModel($this->modelName))) {
		    return afResponseHelper::create()->success(true)->message("Model <b>{$this->modelName}</b> exists")->asArray();
		}
		
		return afResponseHelper::create()->success(false)->message("Model <b>{$this->modelName}</b> doesn't exists")->asArray();
    }
    
    /**
     * Process get command
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processGet()
    {
        $models = $this->getModificator()->getList();
		
        /*
            TODO wrap models result to data decorator, need frontend changes
        */
        return afStudioModelCommandHelper::sortModels($models);
    }
    
    /**
     * Add model functionality
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processAdd()
    {
		return $this->getModificator()->addModel()->asArray();
    }
    
    /**
     * Delete model command
     */
    protected function processDelete()
    {
		return $this->getModificator()->deleteModel()->asArray();
    }
    
    /**
     * Rename model functionality
     */
    protected function processRename()
    {
        $renamedModelName = $this->getParameter('renamedModel');
		
		return $this->getModificator()->renameModel($renamedModelName)-asArray();
    }
    
    /**
     * Process read command
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processRead()
    {
        $rows = $this->getModificator()->readModelFields();
        
		return afResponseHelper::create()->success(true)->data(array(), $rows, count($rows))->asArray();
    }
    
    /**
     * Process alter model command
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processAlterModel()
    {
        try {
			$response = $this->getModificator()->alterModel(json_decode($this->getParameter('fields')));
			if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
				$response->message("{$this->modelName} structure was successfully updated");
			}
        } catch ( Exception $e ) {
        	$response = afResponseHelper::create()->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    /**
     * Update schemas command
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processUpdateSchemas()
    {
        return afResponseHelper::create()->success(true)->console(afStudioModelCommandHelper::updateSchemas())->asArray();
    }
    
    /**
     * Get relations list for autocomplete
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processReadrelation()
    {
        return afResponseHelper::create()->success(true)->data(array(), $this->getModificator()->buildRelationComboModels($this->getParameter('query')), 0)->asArray();
    }
    
    /**
     * Altering model - update field
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processAlterModelUpdateField()
    {
        try {
			$field = $this->getParameter('field', null);
			$fieldDef = json_decode($this->getParameter('fieldDef'));
			
            $response = $this->getModificator()->changeModelField($fieldDef, $field);
            
			if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
				$response->message("Field '{$fieldDef->name}' was successfully updated");
			} 
        } catch ( Exception $e ) {
        	$response = afResponseHelper::create()->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
}
