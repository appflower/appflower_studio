<?php
/**
 * afStudioModels tree panel Command
 *
 */
class afStudioModelsCommand
{
	public $request=null,$result=null,$realRoot=null,$dbSchema=null,$propelSchemaArray=null,$originalSchemaArray=null,$tableName=null,$modelName=null,$configuration=null,$schemaFile=null,$propelModel=null;

	public $cmd;	
	public $xaction;
	
	protected $defaultSchema;
	
	public function __construct()
	{		
		$this->request = sfContext::getInstance()->getRequest();		
		
		$this->realRoot = afStudioUtil::getRootDir();
		
		$this->dbSchema = new sfPropelDatabaseSchema();
	    
		$this->defaultSchema = $this->realRoot . '/config/schema.yml';
		
		$this->loadSchemas();		
		
		$this->cmd = $this->request->getParameterHolder()->has('cmd') ? $this->request->getParameterHolder()->get('cmd') : null;
		$this->xaction = $this->request->getParameterHolder()->has('xaction') ? $this->request->getParameterHolder()->get('xaction') : null;		
		
	    if ($this->request->getParameterHolder()->has('model'))
	    {
	    	$this->modelName = $this->request->getParameterHolder()->get('model');
	    	$this->schemaFile = $this->request->getParameterHolder()->get('schema') ? $this->request->getParameterHolder()->get('schema') : $this->defaultSchema;
	    	
	    	if ($this->cmd == 'add') {
		    	$this->tableName = strtolower($this->modelName);
		    	$this->propelModel = $this->modelName;
	    	} else {
				if (!isset($this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName])) {					
			    	$this->result = array('success'=>false, 'message'=>"Model doesn't exists");
			    	return false;
				}	    		
		    	$this->tableName = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName]['tableName'];
		    	$this->propelModel = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName];	    		
	    	}
	    }
		
		$this->start();
	}
	
	private function loadSchemas()
	{
		$finder = sfFinder::type('file')->name('*schema.yml')->prune('doctrine');
    	$dirs = array_merge(array(sfConfig::get('sf_config_dir')), afStudioUtil::getConfiguration()->getPluginSubPaths('/config'));
    	foreach ($dirs as $k=>$dir)
    	{
    		if(substr_count($dir,'appFlower')>0||substr_count($dir,'sfPropelPlugin')>0||substr_count($dir,'sfProtoculousPlugin')>0)
    		{
    			unset($dirs[$k]);
    		}
    	}
    	$dirs=array_values($dirs);
    	
    	$schemas = $finder->in($dirs);
    	
    	foreach ($schemas as $schema)
	    {
	      $this->originalSchemaArray[$schema] = sfYaml::load($schema);
	
	      if (!is_array($this->originalSchemaArray[$schema]))
	      {
	      	$this->originalSchemaArray[$schema];
	        continue; // No defined schema here, skipping
	      }
	
	      if (!isset($this->originalSchemaArray[$schema]['classes']))
	      {
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
	
	      foreach ($customSchemas as $customSchema)
	      {
	      	$this->originalSchemaArray[$customSchema] = sfYaml::load($customSchema);
	        if (!isset($this->originalSchemaArray[$customSchema]['classes']))
	        {
	          // Old schema syntax: we convert it
	          $this->propelSchemaArray[$customSchema] = $this->dbSchema->convertOldToNewYaml($this->originalSchemaArray[$customSchema]);
	        }
	      }
	    }
	}
	
	public function saveSchema()
	{
		$dump = sfYaml::dump($this->originalSchemaArray[$this->schemaFile], 3);
		
		if (file_put_contents($this->schemaFile, $dump) > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	public function start()
	{		
		if( $this->cmd != null)
		{	
			switch ($this->cmd)
			{
				case "get":			
					if(count($this->propelSchemaArray)>0)
					{
						$models = array();
						foreach ($this->propelSchemaArray as $schemaFile=>$array)
						{
							foreach ($array['classes'] as $phpName=>$attributes)
							{
								$models[] = array('text'=>$phpName,'leaf'=>true,'schema'=>$schemaFile, 'iconCls'=>'icon-model');
							}
						}

						$models = $this->sortModels($models);
						$this->result = $models;
					} else {
						$this->result = array('success' => true);
					}
				break;
				
				case "add":					
					if (!$this->isValidModelName($this->modelName)) {
						$this->result = array('success'=>false, 'message'=>'Model name can only consist from alphabetical characters and begins from letter or "_"');
						return false;						
					}	
					
					$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $this->modelName;				
					
					if ($this->saveSchema()) {			
						$afConsole = new afStudioConsole();
						$consoleResult = $afConsole->execute('sf propel:build-model');
						
						$this->result = array('success' => true, 'message'=>'Added model <b>'.$this->modelName.'</b>!', 'console'=>$consoleResult);						
					} else {						
						$this->result = array('success' => false, 'message'=>'Can\'t add model <b>' + $this->modelName + '</b>!');
					}
				break;				
				
				case "delete":
					unset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]);
					
					if($this->saveSchema())
					{	
						$afConsole=new afStudioConsole();
						$consoleResult=$afConsole->execute(array('chmod u+x ../batch/diff_db.php','batch diff_db.php'));		
						
						$this->result = array('success' => true,'message'=>'Deleted model <b>'.$this->modelName.'</b>!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t delete model <b>'.$this->modelName.'</b>!');
				break;
				
				case "rename":
					$renamedModelName = $this->request->getParameterHolder()->get('renamedModel');					
					
					if (!$this->isValidModelName($renamedModelName)) {
						$this->result = array('success'=>false, 'message'=>'Model name can only consist from alphabetical characters and begins from letter or "_"');
						return false;						
					}	
									
					$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $renamedModelName;
					
					if ($this->saveSchema()) {			
						$afConsole = new afStudioConsole();
						$consoleResult = $afConsole->execute('sf propel:build-model');						
						$this->result = array('success' => true,'message'=>'Renamed model\'s phpName from <b>'.$this->modelName.'</b> to <b>'.$renamedModelName.'</b>!','console'=>$consoleResult);
					} else {
						$this->result = array('success' => false,'message'=>'Can\'t rename model\'s phpName from <b>' + $this->modelName + '</b> to <b>' + $renamedModelName + '</b>!');
					}
				break;
				
				default:
					$this->result = array('success' => true);
				break;
			}
		}
		
		if($this->xaction != null)
		{
			switch ($this->xaction)
			{
				case "read":
					$rows = $this->readModelFields($this->propelModel);
					$this->result = array(
						'success' => true,
						'rows' => $rows,
						'totalCount' => count($rows)
					);					
				break;
					
				case "update":	
					$rows = $this->request->getParameterHolder()->has('rows') ? $this->request->getParameterHolder()->get('rows') : null;
					if($rows!=null)
					{
						$rows=json_decode($rows);print_r($rows);die();
						//$rows=afStudioUtil::objectToArray($rows);
						//$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$rows->name]=$this->reconstructTableField($rows);
						
						if($this->saveSchema())
						{			
							$afConsole=new afStudioConsole();
							$consoleResult=$afConsole->execute(array('chmod u+x ../batch/diff_db.php','batch diff_db.php'));
							
							$this->result = array('success' => true,'message'=>'Updated model <b>'.$this->modelName.'</b> !','console'=>$consoleResult);
						}
						else
						$this->result = array('success' => false,'message'=>'Can\'t update model <b>' + $this->modelName + '</b>!');
					}
				    $this->result['success']=true;
				break;
				
				/**
				 *  Serves RelationCombo ext component
				 */
				case 'readrelation':
					$this->result = array('success' => true, 'data' => $this->buildRelationComboModels());
				break;
				
				/**
				 * Alters model's structure
				 */
				case 'alterModel':
					try {
						$fields = json_decode($this->request->getParameter('fields'));										
						if (($message = $this->alterModel($fields)) === true) {	
							$success = true;
							$message = $this->modelName . ' ' . 'structure was successfully updated';
						} else {
							$success = false;
						}						
						$this->result = array(
							'success' => $success,
							'message' => $message
						);				
			        } catch( Exception $e ) {
			        	$this->result = array('success' => false, 'message' => $e->getMessage());
			        }					
				break;
				
				/**
				 * Alters model field's structure
				 */
				case 'alterModelUpdateField':
					try {
						$field = $this->request->getParameter('field');
						$fieldDef = json_decode($this->request->getParameter('fieldDef'));																
						if (($message = $this->alterModelField($field, $fieldDef)) === true) {							
							$success = true;
							$message = 'Field "' . $fieldDef->name . '" was successfully updated';
						} else {
							$success = false;
						}
						$this->result = array(
							'success' => $success, 
							'message' => $message
						);				
			        } catch( Exception $e ) {
			        	$this->result = array('success' => false, 'message' => $e->getMessage());
			        }
				break;
				
				/**
				 * Creates new model's field
				 */				
				case 'alterModelCreateField':
					try {						
						$fieldDef = json_decode($this->request->getParameter('fieldDef'));						
						if (($message = $this->createModelField($fieldDef)) === true) {
							$success = true;
							$message = 'Field "' . $fieldDef->name . '" was successfully created';							
						} else {
							$success = false;
						}
						$this->result = array(
							'success' => $success, 
							'message' => $message
						);
			        } catch( Exception $e ) {
			        	$this->result = array('success' => false, 'message' => $e->getMessage());
			        }					
				break;
				
				default:
					$this->result = array('success' => true);
				break;
			}
		}
	}
	
	public function reconstructTableField($params)
	{
		$retparams=array();
		
		if(isset($params['type'])&&$params['type']!='')
		{
			$retparams['type']=$params['type'];
		}
		if(isset($params['size'])&&$params['size']!='')
		{
			$retparams['size']=$params['size'];
		}
		if(isset($params['required']))
    	{
    		$retparams['required']=$params['required'];
    	}
    	if(isset($params['default_value']))
    	{
    		$retparams['default']=$params['default_value'];
    	}
		return $retparams;
	}
	
	public function end()
	{	
		$this->result = json_encode($this->result);
		return $this->result;
	}

	private function sortModels($models)
	{
		usort($models, array($this, 'compareModelNames'));
		return $models;
	}

	private function compareModelNames($model1, $model2)
	{
		$model1Name = strtolower($model1['text']);
		$model2Name = strtolower($model2['text']);
		if ($model1Name > $model2Name) {
			return 1;
		} else if ($model1Name < $model2Name) {
			return -1;
		} else {
			return 0;
		}
	}	
	
	/**
	 * Reads Models fields(columns)
	 * @param array $propelModel the model definition
	 * @return array of model's fields 
	 */
	private function readModelFields($propelModel) 
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
	 * Validates Model's name
	 * @param string $name
	 * @return boolean
	 */
	private function isValidModelName($name) 
	{
		return preg_match("/^[^\d]\w*$/i", $name);
	}

	/**
	 * Validates Field uniqueness inside the Model	 
	 * @param string $name
	 * @return boolean
	 */
	private function isFieldNameUnique($name) 
	{
		return !array_key_exists($name, $this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]);
	}
	
	/**
	 * Verifies field name
	 * @param string $fieldName
	 * @return true on success otherwise error message
	 */
	private function modelFieldVerification($fieldName) 
	{
		if (!$this->isValidModelName($fieldName)) {
			return "Field name \"{$fieldName}\" is not valid. Field name must contains only characters, digits or \"_\" and starts from \"_\" or character";
		}
		if (!$this->isFieldNameUnique($fieldName)) {
			return "Field name \"{$fieldName}\" is duplicated";				
		}
		return true;
	}
	
	/**
	 * Returns Model name by its table name
	 * @param string $table
	 * @return string model name if table was found otherwise null 
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
	 * @param string $tableName
	 * @return string table name if model was found otherwise null
	 */
	private function getTableNameByModel($model) 
	{	
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
	 * @param string $mask
	 * @return array of models
	 */
	private function getModelsByMask($mask) 
	{												
		$models = array();
		foreach ($this->propelSchemaArray as $schemaFile => $array) {
			foreach ($array['classes'] as $model => $attributes) {
				if (empty($mask)) {					
					$models[] = $model;
				} else if (stripos($model, $mask) === 0) {
					$models[] = $model;
				}			
			}
		}
		return $models;
	}
	
	/**
	 * Returns path to schema of specified model
	 * @param string $model
	 * @return string schema path
	 */
	private function getSchemaByModel($model) 
	{
		foreach ($this->propelSchemaArray as $schemaFile => $array) {
			foreach ($array['classes'] as $phpName => $attributes) {
				if ($model == $phpName) {
					return $schemaFile;																
				}		
			}
		}		
		return null;		
	}
	
	/**
	 * Creates Relation modelName.modelField value
	 * based on "query" parameter
	 * @return array the relation
	 */
	private function buildRelationComboModels()
	{
		$models = array();

		if (count($this->propelSchemaArray) > 0) {
			$query = $this->request->getParameter('query');
			$relation = explode('.', trim($query));
			
			if (count($relation) > 1) {				
				$modelName  = $relation[0];
				$modelField = $relation[1];
				
				if (!empty($modelName)) {
					$schema = $this->getSchemaByModel($modelName);					
					if (!empty($schema)) {
						$propelModel = $this->propelSchemaArray[$schema]['classes'][$modelName];
						
  						foreach ($propelModel['columns'] as $name => $params) {
							if (empty($modelField)) {
								$models[] = array('id' => $modelName.'.'.$name, 'value' => $modelName.'.'.$name);											
							} else if (stripos($name, $modelField) === 0) {
								$models[] = array('id' => $modelName.'.'.$name, 'value' => $modelName.'.'.$name);
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
	 * @param stdClass $f json decoded field definition
	 * @return array field's definition 
	 */
	private function buildFieldDefinition($f) {
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
	 * @param array $fields the new models fields
	 */
	private function alterModel($fields)
	{		
		//remove previous table structure 		
		foreach ($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName] as $k => $v) {
			if ($k != '_attributes') {
				unset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$k]);
			} 
		}
		//build new structure
		foreach ($fields as $f) {
			if (($error = $this->modelFieldVerification($f->name)) !== true) {
				return $error; 
			}			
			$definition = $this->buildFieldDefinition($f);
			$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$f->name] = $definition;
		}		
		$this->saveSchema();
		$this->deployOfSchemaChanges();
		
		return true;
	}
	
	/**
	 * Alters model's field
	 * @param string $field the field to update
	 * @param stdClass $fieldData json decoded new field definition
	 */
	private function alterModelField($field, $fieldData)
	{	
		if (!$this->isValidModelName($fieldData->name)) {
			return "Field name \"{$fieldData->name}\" is not valid. Field name must contains only characters, digits or \"_\" and starts from \"_\" or character";
		}	
		$fieldDefinition = $this->buildFieldDefinition($fieldData);
		$this->arraySetKeyValue($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName], 
				$field, $fieldData->name, $fieldDefinition);		
		$this->saveSchema();
		$this->deployOfSchemaChanges();
		
		return true;		
	}
	
	/**
	 * Creates model's field
	 * @param stdClass $fieldData json decoded field definition
	 */
	private function createModelField($fieldData)
	{
		if (($error = $this->modelFieldVerification($fieldData->name)) !== true) {
			return $error; 
		}
		$fieldDefinition = $this->buildFieldDefinition($fieldData);
		$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$fieldData->name] = $fieldDefinition;		
		$this->saveSchema();
		$this->deployOfSchemaChanges();
		
		return true;		
	}
	
	private function deployOfSchemaChanges() {
		//TODO should be correctly implemented
		$afConsole = new afStudioConsole();
		$consoleResult = $afConsole->execute(array('chmod u+x ../batch/diff_db.php','batch diff_db.php'));
	}
	
	/**
	 * Utility function.
	 * Sets specified array key's value and changes its name if $newKey was specified.   
	 * @param array $array the array to set key
	 * @param string $key to set up
	 * @param string $newKey the new key name 
	 * @param mixed $value the key's value to be set
	 */
	private function arraySetKeyValue(&$array, $key, $newKey, $value) {
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
