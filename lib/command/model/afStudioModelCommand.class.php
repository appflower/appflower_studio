<?php
/**
 * Studio model command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModelCommand extends afBaseStudioCommand
{
    
    protected 
        // $request = null,
        // $result = null,
        $realRoot = null,
        $dbSchema = null,
        $propelSchemaArray = null,
        $originalSchemaArray = null,
        $tableName = null,
        $modelName = null,
        $configuration = null,
        $schemaFile = null,
        $propelModel = null;
    
    // protected $cmd;
    // protected $xaction;
    
    protected $defaultSchema;
    
    /*
        TODO make lighter preProcess
    */
    
    protected function preProcess()
    {
        // $this->request = sfContext::getInstance()->getRequest();
		$this->realRoot = afStudioUtil::getRootDir();
		$this->dbSchema = new sfPropelDatabaseSchema();
		
		$this->defaultSchema = $this->realRoot . '/config/schema.yml';
		
		$this->loadSchemas();
		
        // $this->cmd = $this->request->getParameterHolder()->has('cmd') ? $this->request->getParameterHolder()->get('cmd') : null;
        // $this->cmd = $this->getParameter('cmd');
		
        // $this->xaction = $this->request->getParameterHolder()->has('xaction') ? $this->request->getParameterHolder()->get('xaction') : null;
        // $this->xaction = $this->getParameter('xaction');
		
        // if ($this->request->getParameterHolder()->has('model')) {
	    if ($this->hasParameter('model')) {
            // $this->modelName = $this->request->getParameterHolder()->get('model');
	    	$this->modelName = $this->getParameter('model');
	    	
            // $this->schemaFile = $this->request->getParameterHolder()->get('schema') ? $this->request->getParameterHolder()->get('schema') : $this->defaultSchema;
	    	$this->schemaFile = $this->getParameter('schema', $this->defaultSchema);
	    	
	    	if ($this->cmd == 'add') {
		    	$this->tableName = strtolower($this->modelName);
		    	$this->propelModel = $this->modelName;
	    	} else {
				if (!isset($this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName])) {
                    // $this->result = array('success'=>false, 'message'=>"Model doesn't exists");
			    	return afResponseHelper::create()->success(false)->message("Model doesn't exists")->asArray();
			    	return false;
				}
				
		    	$this->tableName = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName]['tableName'];
		    	$this->propelModel = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName];
	    	}
	    }
    }
    
    
    
    protected function processGet()
    {
        if (count($this->propelSchemaArray) > 0) {
			$models = array();
			foreach ($this->propelSchemaArray as $schemaFile => $array) {
				foreach ($array['classes'] as $phpName => $attributes) {
					$models[] = array('text' => $phpName,'leaf' => true,'schema' => $schemaFile, 'iconCls' => 'icon-model');
				}
			}
            
            $models = afStudioModelCommandHelper::sortModels($models);
            $this->result = $models;
        } else {
            $this->result = array('success' => true);
        }
    }
    
    protected function processAdd()
    {
        $response = afResponseHelper::create();
        
        if (!afStudioModelCommandHelper::isValidName($this->modelName)) {
			return $response->success(false)->message('Model name can only consist from alphabetical characters and begins from letter or "_"')->asArray();
            // return false;
		}
		
		$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $this->modelName;
		
		if ($this->saveSchema()) {
		    $afConsole = afStudioConsole::getInstance();
		    
			$consoleResult = afStudioModelCommandHelper::deploy();
			
            if ($afConsole->wasLastCommandSuccessfull()) {
			     $consoleResult .= $afConsole->execute('sf propel:build-form');
            }
            
            if ($afConsole->wasLastCommandSuccessfull()) {
                $message = 'Added model <b>'.$this->modelName.'</b>!';
            } else {
                $message = 'Model was propery defined but build-model and/or build-form tasks returned some errors.';
            }
			
            $response->success($afConsole->wasLastCommandSuccessfull())->message($message)->console($consoleResult);
		} else {
			$response->success(false)->message("Can't add model <b>{$this->modelName}</b>! Please check schema file permissions.");
		}
		
		return $response->asArray();
    }
    
    
    protected function processDelete()
    {
        $response = afResponseHelper::create();
        
        unset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]);
		
		if ($this->saveSchema()) {
			$response->success(true)->message('Deleted model <b>'.$this->modelName.'</b>!')->console(afStudioModelCommandHelper::deploy());
		} else {
		    $response->success(false)->message("Can't delete model <b>{$this->modelName}</b>!");
		}
		
		return $response->asArray();
    }
    
    protected function processRename()
    {
        $response = afResponseHelper::create();
        
        $renamedModelName = $this->getParameter('renamedModel');
		
		if (!afStudioModelCommandHelper::isValidName($renamedModelName)) {
			return $response->success(false)->message('Model name can only consist from alphabetical characters and begins from letter or "_"');
            // return false;
		}
		
		$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $renamedModelName;
		
		if ($this->saveSchema()) {
			$response
			    ->success(true)
			    ->message("Renamed model's phpName from <b>{$this->modelName}</b> to <b>{$renamedModelName}</b>!")
			    ->console(afStudioModelCommandHelper::deploy());
		} else {
			$response->success(false)->message("Can't rename model's phpName from <b>{$this->modelName}</b> to <b>{$renamedModelName}</b>!");
		}
		
		return $response-asArray();
    }
    
    
    
    
    
    
    
    
    protected function processRead()
    {
        $rows = $this->readModelFields($this->propelModel);
        
        /*
            TODO make compatible with afResponse 'data' decorator
        */
		$this->result = array(
			'success' => true,
			'rows' => $rows,
			'totalCount' => count($rows)
		);
    }
    
    protected function processUpdate()
    {
        $response = afResponseHelper::create();
        
        // $rows = $this->request->getParameterHolder()->has('rows') ? $this->request->getParameterHolder()->get('rows') : null;
        $rows = $this->getParameter('rows');
        
		if ($rows != null) {
			$rows = json_decode($rows); print_r($rows); die();
			//$rows=afStudioUtil::objectToArray($rows);
			//$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$rows->name]=$this->reconstructTableField($rows);
			
			if ($this->saveSchema()) {
				$response->success(true)->message('Updated model <b>'.$this->modelName.'</b> !')->console(afStudioModelCommandHelper::deploy());
			} else {
			    $response->success(false)->message("Can't update model <b>{$this->modelName}</b>!");
			}
		}
		
		$response->success(true);
        // $this->result['success']=true;
        
        return $response->asArray();
    }
    
    protected function processReadrelation()
    {
        FirePHP::getInstance(true)->fb('readRelation');
        $this->result = array('success' => true, 'data' => $this->buildRelationComboModels());
    }
    
    protected function processAlterModel()
    {
        $response = afResponseHelper::create();
        try {
            // $fields = json_decode($this->request->getParameter('fields'));
			$fields = json_decode($this->getParameter('fields'));
            
			if (($message = $this->alterModel($fields)) === true) {
				$success = true;
				$message = $this->modelName . ' ' . 'structure was successfully updated';
			} else {
				$success = false;
			}
			
			$response->success($success)->message($message);
        } catch ( Exception $e ) {
        	$response->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    
    protected function processAlterModelUpdateField()
    {
        $response = afResponseHelper::create();
        try {
            // $field = $this->request->getParameter('field');
            // $fieldDef = json_decode($this->request->getParameter('fieldDef'));
			$field = $this->getParameter('field');
			$fieldDef = json_decode($this->getParameter('fieldDef'));
			
			if (($message = $this->alterModelField($field, $fieldDef)) === true) {
				$success = true;
				$message = 'Field "' . $fieldDef->name . '" was successfully updated';
			} else {
				$success = false;
			}
			
			$response->success($success)->message($message);
        } catch( Exception $e ) {
        	$response->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    protected function processAlterModelCreateField()
    {
        $response = afResponseHelper::create();
        try {
            // $fieldDef = json_decode($this->request->getParameter('fieldDef'));
			$fieldDef = json_decode($this->getParameter('fieldDef'));
			
			if (($message = $this->createModelField($fieldDef)) === true) {
				$success = true;
				$message = 'Field "' . $fieldDef->name . '" was successfully created';
			} else {
				$success = false;
			}
			
			$response->success($success)->message($message);
        } catch ( Exception $e ) {
        	$response->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    
    
    
	private function loadSchemas()
	{
		$this->configuration = new ProjectConfiguration(null, new sfEventDispatcher());
		$finder = sfFinder::type('file')->name('*schema.yml')->prune('doctrine');
		
    	$dirs = array_merge(array(sfConfig::get('sf_config_dir')), $this->configuration->getPluginSubPaths('/config'));
    	
    	foreach ($dirs as $k => $dir) {
    		if (substr_count($dir, 'appFlower') > 0 || substr_count($dir, 'sfPropelPlugin') > 0 || substr_count($dir, 'sfProtoculousPlugin') > 0) {
    			unset($dirs[$k]);
    		}
    	}
    	
    	$dirs = array_values($dirs);
    	
    	$schemas = $finder->in($dirs);
    	
    	foreach ($schemas as $schema) {
            $this->originalSchemaArray[$schema] = sfYaml::load($schema);
            
    	    if (!is_array($this->originalSchemaArray[$schema])) {
    	      	$this->originalSchemaArray[$schema];
    	        continue; // No defined schema here, skipping
    	    }
            
    	    if (!isset($this->originalSchemaArray[$schema]['classes'])) {
    	        // Old schema syntax: we convert it
    	        $this->propelSchemaArray[$schema] = $this->dbSchema->convertOldToNewYaml($this->originalSchemaArray[$schema]);
    	    }
            
    	    $customSchemaFilename = str_replace(array(
    	        str_replace(DIRECTORY_SEPARATOR, '/', sfConfig::get('sf_root_dir')).'/',
    	        'plugins/',
    	        'config/',
    	        '/',
    	        'schema.yml'
    	    ), array('', '', '', '_', 'schema.custom.yml'), $schema);
    	    $customSchemas = sfFinder::type('file')->name($customSchemaFilename)->in($dirs);
            
    	    foreach ($customSchemas as $customSchema) {
    	      	$this->originalSchemaArray[$customSchema] = sfYaml::load($customSchema);
    	        if (!isset($this->originalSchemaArray[$customSchema]['classes'])) {
    	            // Old schema syntax: we convert it
    	            $this->propelSchemaArray[$customSchema] = $this->dbSchema->convertOldToNewYaml($this->originalSchemaArray[$customSchema]);
    	        }
    	    }
	    }
	}
	
	
	public function saveSchema()
	{
        return afStudioUtil::writeFile($this->schemaFile, sfYaml::dump($this->originalSchemaArray[$this->schemaFile], 3));
	}
	
	
	public function reconstructTableField($params)
	{
		$retparams = array();
		
		if (isset($params['type']) && $params['type'] != '') {
			$retparams['type'] = $params['type'];
		}
		
		if (isset($params['size']) && $params['size'] != '') {
			$retparams['size'] = $params['size'];
		}
		
		if (isset($params['required'])) {
    		$retparams['required'] = $params['required'];
    	}
    	
    	if (isset($params['default_value'])) {
    		$retparams['default'] = $params['default_value'];
    	}
    	
		return $retparams;
	}
	
	
	/**
	 * Read Models fields(columns)
	 * 
	 * @param array $propelModel the model definition
	 * @return array - of model's fields 
	 */
	private function readModelFields(Array $propelModel) 
	{
		$fields = array();
		
		$k = 0;
	    foreach ($propelModel['columns'] as $name => $column) {
	    	$fields[$k]['id'] = $k;
	    	$fields[$k]['name'] = $name;
	    	
	    	if (is_array($column)) {
		    	foreach ($column as $property => $value) {
		    		switch ($property) {
		    			case 'type':
		    				$value = strtolower($value);
	    				    break;
	    				    
		    			case 'foreignTable':
		    				$fields[$k]['foreignModel'] = $this->getModelByTableName($value);
	    				    break;
		    		}
			    	$fields[$k][$property] = $value;
		    	}
	    	} else if (isset($column)) {
	    		$fields[$k]['type'] = $column;
	    	}
	    	
	    	$k++;
	    }
	    
	    return $fields;
	}
	
	

	/**
	 * Validates Field uniqueness inside the Model
	 * 
	 * @param string $name
	 * @return boolean
	 */
	private function isFieldNameUnique($name) 
	{
		return !array_key_exists($name, $this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]);
	}
	
	/**
	 * Verifies field name
	 * 
	 * @param string $fieldName
	 * @return mixed - true on success otherwise error message
	 */
	private function modelFieldVerification($fieldName) 
	{
		if (!afStudioModelCommandHelper::isValidName($fieldName)) {
			return "Field name \"{$fieldName}\" is not valid. Field name must contains only characters, digits or \"_\" and starts from \"_\" or character";
		}
		
		if (!$this->isFieldNameUnique($fieldName)) {
			return "Field name \"{$fieldName}\" is duplicated";
		}
		
		return true;
	}
	
	/**
	 * Returns Model name by its table name
	 * 
	 * @param string $table
	 * @return string - model name if table was found otherwise null 
	 */
	private function getModelByTableName($table) 
	{
		$found = false;
		foreach ($this->propelSchemaArray as $schema) {
			foreach ($schema['classes'] as $modelName => $model) {
				if ($model['tableName'] == $table) {
					$found = true;
					break 2;
				}
			}
		}
		
		return $found ? $modelName : null;
	}
	
	/**
	 * Returns table name by the model
	 * 
	 * @param string $model
	 * @return string - table name if model was found otherwise null
	 */
	private function getTableNameByModel($model) 
	{
	    FirePHP::getInstance(true)->fb($model);
		$tableName = null;
		foreach ($this->propelSchemaArray as $schema) {
			foreach ($schema['classes'] as $modelName => $m) {
				if ($modelName == $model) {
					$tableName = $m['tableName'];
					break 2;
				}
			}
		}
		
		return $tableName;
	}
	
	/**
	 * Returns array of models narrowed by mask.
	 * Example: there are models "Users", "Units", "Group" and mask "u" returns two models 
	 * "Users" and "Units". Case insensitive.
	 * If mask is an empty string all Models are returned. 
	 * 
	 * @param string $mask
	 * @return array of models
	 */
	private function getModelsByMask($mask) 
	{
		$models = array();
		foreach ($this->propelSchemaArray as $schemaFile => $array) {
			foreach ($array['classes'] as $model => $attributes) {
				if (empty($mask) || stripos($model, $mask) === 0) $models[] = $model;
			}
		}
		
		return $models;
	}
	
	/**
	 * Returns path to schema of specified model
	 * 
	 * @param string $model
	 * @return string schema path
	 */
	private function getSchemaByModel($model) 
	{
		foreach ($this->propelSchemaArray as $schemaFile => $array) {
			foreach ($array['classes'] as $phpName => $attributes) {
				if ($model == $phpName) return $schemaFile;
			}
		}
		
		return null;
	}
	
	/**
	 * Creates Relation modelName.modelField value
	 * based on "query" parameter
	 * 
	 * @return array the relation
	 */
	private function buildRelationComboModels()
	{
		$models = array();
        
		if (count($this->propelSchemaArray) > 0) {
            // $query = $this->request->getParameter('query');
			$query = $this->getParameter('query');
			
			$relation = explode('.', trim($query));
			
			if (count($relation) > 1) {
				$modelName  = $relation[0];
				$modelField = $relation[1];
				
				if (!empty($modelName)) {
					$schema = $this->getSchemaByModel($modelName);
					if (!empty($schema)) {
						$propelModel = $this->propelSchemaArray[$schema]['classes'][$modelName];
						
  						foreach ($propelModel['columns'] as $name => $params) {
							if (empty($modelField) || stripos($name, $modelField) === 0) {
								$models[] = array('id' => "{$modelName}.{$name}", 'value' => "{$modelName}.{$name}");
							}
	    				}
					}
				} else {
					$m = $this->getModelsByMask($modelName);
					for ($i = 0, $len = count($m); $i < $len; $i++) {
						$models[] = array('id' => $m[$i], 'value' => $m[$i]);
					}
				}
			} else {
				$modelName = $relation[0];
				$m = $this->getModelsByMask($modelName);
				for ($i = 0, $len = count($m); $i < $len; $i++) {
					$models[] = array('id' => $m[$i], 'value' => $m[$i]);
				}
			}
		}
		
		return $models;
	}
	
	/**
	 * Creates field definition from json decoded object
	 * 
	 * @param stdClass $f json decoded field definition
	 * @return array field's definition 
	 */
	private function buildFieldDefinition($f) 
	{
		$definition = array();
		
		if (!empty($f->type)) {
			$definition['type'] = $f->type;
		}
		
		if (!empty($f->default)) {
			$definition['default'] = $f->default;
		}
		
		if (!empty($f->autoIncrement)) {
			$definition['autoIncrement'] = $f->autoIncrement;
		}
		
		if (!empty($f->key)) {
			switch ($f->key) {
				case 'primary':
					$definition['primaryKey'] = true;
				    break;
				    
				case 'unique':
					$definition['index'] = 'unique';
				    break;
				    
				case 'index':
					$definition['index'] = true;
				    break;
			}
		}
		
		if (!empty($f->required)) {
			$definition['required'] = $f->required;
		}
		
		if (!empty($f->relation)) {
			$ref = explode('.', $f->relation);
			$definition['foreignTable'] = $this->getTableNameByModel($ref[0]);
			$definition['foreignReference'] = $ref[1];
		}
		
		if (!empty($f->size)) {
			$definition['size'] = intval($f->size);
		}
		
		if (!empty($f->onDelete)) {
			$definition['onDelete'] = $f->onDelete;
		}
        
		return $definition;
	}
	
	/**
	 * Alters Model structure 
	 * 
	 * @param array $fields the new models fields
	 */
	private function alterModel(Array $fields)
	{
		//remove previous table structure 
		foreach ($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName] as $k => $v) {
			if ($k != '_attributes') unset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$k]);
		}
		
		//build new structure
		foreach ($fields as $f) {
			if (($error = $this->modelFieldVerification($f->name)) !== true) return $error;
			
			$definition = $this->buildFieldDefinition($f);
			$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$f->name] = $definition;
		}
        
		$this->saveSchema();
		
        afStudioModelCommandHelper::deploy();
		
		return true;
	}
	
	/**
	 * Alters model's field
	 * 
	 * @param string $field the field to update
	 * @param stdClass $fieldData json decoded new field definition
	 */
	private function alterModelField($field, $fieldData)
	{
		if (!afStudioModelCommandHelper::isValidName($fieldData->name)) {
			return "Field name \"{$fieldData->name}\" is not valid. Field name must contains only characters, digits or \"_\" and starts from \"_\" or character";
		}
		$fieldDefinition = $this->buildFieldDefinition($fieldData);
		
		$this->arraySetKeyValue($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName], $field, $fieldData->name, $fieldDefinition);
		
		$this->saveSchema();
		
		afStudioModelCommandHelper::deploy();
		
		return true;
	}
	
	/**
	 * Creates model's field
	 * 
	 * @param stdClass $fieldData json decoded field definition
	 */
	private function createModelField($fieldData)
	{
		if (($error = $this->modelFieldVerification($fieldData->name)) !== true) return $error;
		
		$fieldDefinition = $this->buildFieldDefinition($fieldData);
		$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$fieldData->name] = $fieldDefinition;
		
		$this->saveSchema();
		
		afStudioModelCommandHelper::deploy();
		
		return true;
	}
	
    
	
	/**
	 * Utility function.
	 * Sets specified array key's value and changes its name if $newKey was specified.
	 * 
	 * @param array $array the array to set key
	 * @param string $key to set up
	 * @param string $newKey the new key name 
	 * @param mixed $value the key's value to be set
	 */
	private function arraySetKeyValue(Array &$array, $key, $newKey, $value) {
		$initial = array();
		foreach ($array as $k => $v) {
			if ($k != $key) {
				$initial[$k] = $v;
			} else {
				empty($newKey) ? $initial[$key] = $value : $initial[$newKey] = $value;
			}
		}
		
		$array = $initial;
	}
    
}
