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
            $this->modificator = afStudioModelCommandModificator::create()->setModelName($this->modelName)->setSchemaFile($this->schemaFile);
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
        
        $schema = $this->getParameter('schema');
        if (!empty($schema)) {
            $this->schemaFile = $this->getParameter('schema');
        }
    }
    
    /**
     * Checking existed model or not
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processHas()
    {
        if (!is_null($this->getModificator()->getSchemaByModel($this->modelName))) {
            return afResponseHelper::create()->success(true)->message("Model <b>{$this->modelName}</b> exists");
        }
        
        return afResponseHelper::create()->success(false)->message("Model <b>{$this->modelName}</b> doesn't exists");
    }
    
    /**
     * Process get command
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGet()
    {
        $models = $this->getModificator()->getList();
        
        return afResponseHelper::create()->success(true)->data(array(), $models, 0);
    }
    
    /**
     * Add model functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processAdd()
    {
        return $this->getModificator()->addModel((bool) $this->getParameter('with_primary', false));
    }
    
    /**
     * Delete model command
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processDelete()
    {
        return $this->getModificator()->deleteModel();
    }
    
    /**
     * Rename model functionality
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processRename()
    {
        return $this->getModificator()->renameModel($this->getParameter('renamedModel'));
    }
    
    /**
     * Process read command
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processRead()
    {
        $rows = $this->getModificator()->readModelFields();
        
        return afResponseHelper::create()->success(true)->data(array(), $rows, count($rows));
    }
    
    /**
     * Process alter model command
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processAlterModel()
    {
        try {
            $response = $this->getModificator()->alterModel(json_decode($this->getParameter('fields')));
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                $response->message("{$this->modelName} structure was successfully updated");
            }
            
            return $response;
        } catch ( Exception $e ) {
            return afResponseHelper::create()->success(false)->message($e->getMessage());
        }
    }
    
    /**
     * Update schemas command
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processUpdateSchemas()
    {
        return afResponseHelper::create()->success(true)->console(afStudioModelCommandHelper::updateSchemas());
    }
    
    /**
     * Get relations list for autocomplete
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processReadrelation()
    {
        return afResponseHelper::create()->success(true)->data(array(), $this->getModificator()->buildRelationComboModels($this->getParameter('query')), 0);
    }
    
    /**
     * Altering model - update field
     *
     * @return afResponse
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
            
            return $response;
        } catch ( Exception $e ) {
            return afResponseHelper::create()->success(false)->message($e->getMessage());
        }
    }
    
}
