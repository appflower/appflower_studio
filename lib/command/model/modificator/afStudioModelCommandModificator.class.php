<?php
/**
 * Studio model command modificator class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModelCommandModificator
{
    protected 
        $realRoot = null,
        $dbSchema = null,
        $propelSchemaArray = null,
        $originalSchemaArray = null,
        $tableName = null,
        $modelName = null,
        $configuration = null,
        $schemaFile = null,
        $propelModel = null;
    
    protected $defaultSchema;
    
    public function __construct($model = null, $schema = null, $command = null)
    {
        $this->dbSchema = new sfPropelDatabaseSchema();
		$this->defaultSchema = afStudioUtil::getRootDir() . '/config/schema.yml';
		
        $this->loadSchemas();
        
        if (!is_null($model)) {
	    	$this->modelName = $model;
            // $this->schemaFile = $this->getParameter('schema', $this->defaultSchema);
	    	
	    	if (empty($this->schemaFile)) $this->schemaFile = $this->defaultSchema;
	    	
	    	if ($command == 'add') {
		    	$this->tableName = strtolower($this->modelName);
		    	$this->propelModel = $this->modelName;
	    	} else {
				if (!isset($this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName])) {
                    throw new afStudioModelCommandModificatorException("Model doesn't exists");
				}
				
		    	$this->tableName = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName]['tableName'];
		    	$this->propelModel = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName];
	    	}
	    }
    }
    
    /**
     * Rename model functionality
     *
     * @param string $name 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function renameModel($name)
    {
        $response = afResponseHelper::create();
        
        if (!afStudioModelCommandHelper::isValidName($name)) {
			return $response->success(false)->message('Model name can only consist from alphabetical characters and begins from letter or "_"');
		}
		
		$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $name;
		
		if ($this->saveSchema()) {
			$response
			    ->success(true)
			    ->message("Renamed model's phpName from <b>{$this->modelName}</b> to <b>{$name}</b>!")
			    ->console(afStudioModelCommandHelper::deploy());
		} else {
			$response->success(false)->message("Can't rename model's phpName from <b>{$this->modelName}</b> to <b>{$name}</b>!");
		}
		
		return $response;
    }
    
    /**
     * Adding model
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function addModel()
    {
        $response = afResponseHelper::create();
        
        if (!afStudioModelCommandHelper::isValidName($this->modelName)) {
			return $response->success(false)->message('Model name can only consist from alphabetical characters and begins from letter or "_"');
		}
		
		if (!is_null($this->getSchemaByModel($this->modelName))) {
		    return $response->success(false)->message("Model <b>{$this->modelName}</b> already exists");
		}
		
		$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $this->modelName;
		
		if ($this->saveSchema()) {
		    $console = afStudioConsole::getInstance();
			$consoleResult = afStudioModelCommandHelper::deploy();
			
            if ($console->wasLastCommandSuccessfull()) $consoleResult .= $console->execute('sf propel:build-form');
            if ($console->wasLastCommandSuccessfull()) {
                $message = 'Added model <b>'.$this->modelName.'</b>!';
            } else {
                $message = 'Model was propery defined but build-model and/or build-form tasks returned some errors.';
            }
            $response->success($console->wasLastCommandSuccessfull())->message($message)->console($consoleResult);
		} else {
			$response->success(false)->message("Can't add model <b>{$this->modelName}</b>! Please check schema file permissions.");
		}
		
		return $response;
    }
    
    /**
     * Delete model
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function deleteModel()
    {
        $response = afResponseHelper::create();
        
        if (!isset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName])) {
            return $response->success(false)->message("Model '{$this->modelName}' already deleted")->asArray();
        }
        
        unset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]);
		
        if ($this->saveSchema()) {
            $response->success(true)->message('Deleted model <b>'.$this->modelName.'</b>!')->console(afStudioModelCommandHelper::deploy());
        } else {
            $response->success(false)->message("Can't delete model <b>{$this->modelName}</b>!");
        }
        
        return $response;
    }
    
    /**
     * Getting models list
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getList()
    {
        if (count($this->propelSchemaArray) == 0) return $response->success(true)->asArray();
        
		$models = array();
		foreach ($this->propelSchemaArray as $schemaFile => $array) {
		    if (empty($array)) continue;
			foreach ($array['classes'] as $phpName => $attributes) {
				$models[] = array('text' => $phpName,'leaf' => true,'schema' => $schemaFile, 'iconCls' => 'icon-model');
			}
		}
		
		return $models;
    }
    
	/**
	 * Read Models fields(columns)
	 * 
	 * @param array $propelModel the model definition
	 * @return array - of model's fields 
	 */
	public function readModelFields() 
	{
	    $propelModel = $this->propelModel;
	    
		$fields = array();
		
		$k = 0;
	    foreach ((array)$propelModel['columns'] as $name => $column) {
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
	public function isFieldNameUnique($name) 
	{
		return !array_key_exists($name, $this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]);
	}
	
	/**
	 * Verifies field name
	 * 
	 * @param string $fieldName
	 * @return afResponse
	 */
	public function modelFieldVerification($fieldName) 
	{
	    $response = afResponseHelper::create();
	    
		if (!afStudioModelCommandHelper::isValidName($fieldName)) {
		    return $response
		                ->success(false)
		                ->message("Field name '{$fieldName}' is not valid. Field name must contains only characters, digits or '_' and starts from '_' or character");
		}
		
		if (!$this->isFieldNameUnique($fieldName)) return $response->success(false)->message("Field name '{$fieldName}' is duplicated");
		
		return $response->success(true);
	}
	
	/**
	 * Returns Model name by its table name
	 * 
	 * @param string $table
	 * @return string - model name if table was found otherwise null 
	 */
	public function getModelByTableName($table) 
	{
		foreach ($this->propelSchemaArray as $schema) {
			foreach ($schema['classes'] as $modelName => $model) {
			    if ($model['tableName'] == $table) return $modelName;
			}
		}
		
        return null;
	}
	
	/**
	 * Creates Relation modelName.modelField value
	 * based on "query" parameter
	 * 
	 * @return array - the relation
	 */
	public function buildRelationComboModels($query)
	{
		$models = array();
		
		if (count($this->propelSchemaArray) > 0) {
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
	public function buildFieldDefinition($f) 
	{
		$definition = array();
		
		if (!empty($f->type)) $definition['type'] = $f->type;
		if (!empty($f->default)) $definition['default'] = $f->default;
		if (!empty($f->autoIncrement)) $definition['autoIncrement'] = $f->autoIncrement;
		
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
		
		if (!empty($f->required)) $definition['required'] = $f->required;
		
		if (!empty($f->relation)) {
			$ref = explode('.', $f->relation);
			$definition['foreignTable'] = $this->getTableNameByModel($ref[0]);
			$definition['foreignReference'] = $ref[1];
		}
		
		if (!empty($f->size)) $definition['size'] = intval($f->size);
		if (!empty($f->onDelete)) $definition['onDelete'] = $f->onDelete;
        
		return $definition;
	}
	
	/**
	 * Alters Model structure 
	 * 
	 * @param array $fields - the new models fields
	 * @return afResponse
	 */
	public function alterModel(Array $fields)
	{
	    $response = afResponseHelper::create();
	    
		//remove previous table structure 
		foreach ($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName] as $k => $v) {
			if ($k != '_attributes') unset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$k]);
		}
		
		//build new structure
		foreach ($fields as $f) {
		    $response = $this->modelFieldVerification($f->name);
			if (!$response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) return $response;
			
			$definition = $this->buildFieldDefinition($f);
			$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$f->name] = $definition;
		}
        
		$this->saveSchema();
        afStudioModelCommandHelper::deploy();
		
		return $response->success(true);
	}
	
	/**
	 * Change model field
	 *
	 * @param stdClass $fieldData 
	 * @param string $field 
	 * @return afResponse
	 * @author Sergey Startsev
	 */
	public function changeModelField($fieldData, $field = null)
	{
	    $response = $this->modelFieldVerification($fieldData->name);
	    if (!$response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) return $response;
	    
		$fieldDefinition = $this->buildFieldDefinition($fieldData);
		
		if (!is_null($field)) {
		    $this->arraySetKeyValue($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName], $field, $fieldData->name, $fieldDefinition);
		} else {
		    $this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$fieldData->name] = $fieldDefinition;
		}
		
		$this->saveSchema();
		afStudioModelCommandHelper::deploy();
		
		return $response->success(true);
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
	public function arraySetKeyValue(Array &$array, $key, $newKey, $value) 
	{
		$initial = array();
		foreach ($array as $k => $v) {
			if ($k != $key && ($initial[$k] = $v)) continue;
			
            empty($newKey) ? $initial[$key] = $value : $initial[$newKey] = $value;
		}
		
		$array = $initial;
	}
	
	/**
	 * Returns table name by the model
	 * 
	 * @param string $model
	 * @return string - table name if model was found otherwise null
	 */
	public function getTableNameByModel($model) 
	{
		foreach ($this->propelSchemaArray as $schema) {
			foreach ($schema['classes'] as $modelName => $m) {
			    if ($modelName == $model) return $m['tableName'];
			}
		}
		
		return null;
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
	public function getModelsByMask($mask) 
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
	 * @return string - schema path if exists
	 */
	public function getSchemaByModel($model) 
	{
		foreach ($this->propelSchemaArray as $schemaFile => $array) {
		    if (empty($array)) continue;
			foreach ($array['classes'] as $phpName => $attributes) {
				if ($model == $phpName) return $schemaFile;
			}
		}
		
		return null;
	}
    
    /**
     * Load schemas 
     *
     * @return void
     * @author Sergey Startsev
     */
    private function loadSchemas()
	{
		$this->configuration = new ProjectConfiguration(null, new sfEventDispatcher());
		
    	$dirs = array_merge(array(sfConfig::get('sf_config_dir')), $this->configuration->getPluginSubPaths('/config'));
    	
    	foreach ($dirs as $k => $dir) {
    		if (substr_count($dir, 'appFlower') > 0 || substr_count($dir, 'sfPropelPlugin') > 0 || substr_count($dir, 'sfProtoculousPlugin') > 0) {
    			unset($dirs[$k]);
    		}
    	}
    	
    	$dirs = array_values($dirs);
    	
    	$schemas = sfFinder::type('file')->name('*schema.yml')->prune('doctrine')->in($dirs);
    	
    	foreach ($schemas as $schema) {
            $this->originalSchemaArray[$schema] = sfYaml::load($schema);
            
    	    if (!is_array($this->originalSchemaArray[$schema])) continue;
            
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
    
	/**
	 * Saving schema
	 *
	 * @return boolean
	 */
	private function saveSchema()
	{
        return afStudioUtil::writeFile($this->schemaFile, sfYaml::dump($this->originalSchemaArray[$this->schemaFile], 3));
	}
    
}
