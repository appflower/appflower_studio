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
    
    /**
     * Lists the YML (*.yml, *.yaml) files in the project's fixture dir;
     * 
     * @return afResponse
     */
    protected function processGetFixtures() 
    {
        try {    
            $files = array();
            foreach ((array) afsFileSystem::create()->readDirectory(afStudioUtil::getFixturesDir(), "yml, yaml") as $key => $file_name) {
                $files[] = array('id' => $key, 'file' => $file_name,);
            }
            
            return afResponseHelper::create()->success(true)->data(array(), $files, 0);
        } catch (Exception $e) {
            return afResponseHelper::create()->success(false)->message("Couldn't list fixtures, an error occured!");
        }
    }
    
    /**
     * 
     * Imports various data files from fixtures (YAML) directory or via file upload (CSV,YAML,Spreadsheets).
     * 
     * @throws Exception
     */
    protected function processImportData() {
    	
    	$remote_files = $this->getParameter("remote_files",array());
    	$formats = array
    	(
    	"yml" => "yml",
    	"yaml" => "yml",
    	"csv" => "csv",
    	"xlsx" => "xls",
    	"xls" => "xls",
    	"ods" => "xls",
    	);
    	
    	foreach(array("has_headers","append","model","name","tmp","code","delimeter","enclosure","raw","worksheet","worksheets_as_models") as $item) {
    		$params[$item] = $this->getParameter($item);
    	}
    	
    	$params["append"] = $params["append"] === "true" ? true : false;
    	$params["delimeter"] = $params["delimeter"] ? $params["delimeter"] : ",";
    	$params["enclosure"] = $params["enclosure"] ? $params["enclosure"] : '"';

    	try {
    		if(!$params["name"]) {
	    		foreach($remote_files as $file) {
	    			$files[] = afStudioUtil::getFixturesDir()."/".$file;
	    		}	
	    		$class = "YmlImporter";
    		} else {
    			$ext = afsFileSystem::create()->getExtension($params["name"]);
    			if(!array_key_exists($ext, $formats)) {
    				throw new Exception("Unsupported file: ".$params["name"]);
    			}
    			$class = ucfirst($formats[$ext]."Importer");
    			if($params["code"] !== 0) {
    				throw new Exception("Failed to upload file: ".$params["name"]);
    			} 
    			
    			$uploaded_file = afStudioUtil::getUploadsDir()."/".$params["name"];
    			
    			if(!@move_uploaded_file($params["tmp"], $uploaded_file)) {
    				throw new Exception("Couldn't process uploaded file: ".$params["name"]);
    			}
    			
    			$files = array($uploaded_file);
    		}
    		
    		$importer = new $class($params);
    		
    		foreach ($files as $k => &$file) {
				
    			$importer->setProperty("current",$file);
	    		$importer->loadData($file);
	    		if(!($importer instanceof CsvImporter)) {
	    			$importer->insertData($file);	
	    		}
	    		
	    		
			}
  
	    	if($params["name"]) {
	    		if(!@unlink($uploaded_file)) {
	    			throw new Exception("Couldn't delete tmp file: ".$params["name"]);
	    		}
	    	}
    		
    		
    	} catch(Exception $e) {
    		return afResponseHelper::create()->success(false)->message($e->getMessage());	
    	}
    	
    	return afResponseHelper::create()->success(true)->message("Data has been successfully inserted!");
    	
    }
    
    
    /**
     * Validate schema
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processValidateSchema()
    {
        return $this->getModificator()->validateSchema();
    }
    
}
