<?php

/**
 * 
 * This is a base class for importers that read some data file and import the data into DB.
 * @author tamas
 *
 */
abstract class BaseImporter {
	
	protected
		$data = array(),
		$properties;
	
	public function __construct(Array $parameters) {
		
		if(!array_key_exists("append", $parameters)) {
			$parameters["append"] = false;
		}
		
		$this->properties = new stdClass();
		$this->properties->append = $parameters["append"];
		$this->properties->verify = true;
		
		if(array_key_exists("model", $parameters) && $parameters["model"]) {
			
			if($this->isInvalidModel($parameters["model"])) {
				throw new ImporterException("Model '".$parameters["model"]."' does not exist!");
			}
			
			$this->properties->model = $parameters["model"];
			$this->getModelInfo();
		}
		
		$this->properties->has_header = array_key_exists("has_headers", $parameters) && $parameters["has_headers"];		
		
	}
	
	/**
	 * 
	 * Tells if $model is a valid model class
	 * @param string $model
	 * @return boolean 
	 */
	protected function isInvalidModel($model) {
		return (!class_exists($model) || !($obj = new $model) instanceof BaseObject);
	}
	
	
	/**
	 * Loads the column and table names for the current model. It is called automatically by insertData() when needed.
	 * 
	 */
	protected function getModelInfo() {
		
		$this->properties->con = Propel::getConnection();
		$tableMap = call_user_func(array($this->properties->model."Peer","getTableMap"));
		$this->properties->table = $tableMap->getName();
		$columnMap = $tableMap->getColumns();
		
		 foreach ($columnMap as $column) {
		 	$colName = strtolower($column->getName());
		 	
		 	if($colName == "id" && $column->isPrimaryKey()) {
		 		continue;
		 	}

		 	$this->properties->columns[] = $colName;
			 	
		}
		
	}
	
	/**
	 * Validates data stored in $this->data. It performs only some basic validations, should be overridden if you need more.
	 * 
	 * @throws ImporterException
	 */
	protected function validateData() {
		
		try {
			
			$mSize =  sizeof($this->properties->columns);
				 
			 foreach($this->data as $k => $row) {
			 	if(sizeof($row) != $mSize) {
			 		throw new ImporterException("File is invalid:<br><br>Line ".($this->properties->lines).".: ".implode(",",$row)."<br><br>has ".sizeof($row)." columns but ".$mSize." is expected!");
			 	}
			 }
			 
			 if(property_exists($this->properties, "has_header") && $this->properties->has_header) {
			 	foreach($this->data[0] as $header) {
			 		if(!in_array(strtolower($header), $this->properties->columns)) {
			 			throw new ImporterException("Undefined table column: ".$header);
			 		}
			 	}
			 }
			
		}
		catch(Exception $e) {
			throw new ImporterException($e->getMessage());
		}
		
	}
	
	/**
	 * Deletes all data from given model.
	 * @throws ImporterException
	 */
	protected function deleteData() {
		if(call_user_func(array($this->properties->model."Peer", "doDeleteAll")) === false) {
			throw new ImporterException("Couldn't delete data!");
		} 
	}
	
	/**
	 * 
	 * Loads the current data file and stores its contents in $this->data for processing. 
	 * Data should be converted into an array holding rows of data:
	 * 
	 * array(
	 * 		0 => array(item1,item2,item3)
	 * 		1 => array(item1,item2,item3)
	 * 		)
	 * 
	 * @param string $path Absolute path to the data file
	 * @throws ImporterException
	 */
	abstract public function loadData($path);
	
	
	/**
	 * 
	 * This inserts data stored $this->data into the DB.
	 * Pass a prepared statement argument if you wish to use prepared statements instead of propel objects.
	 * @throws ImporterException
	 */
	public function insertData() {	
		
		$statement = func_num_args() ? func_get_arg(0) : false;
		
		if(!property_exists($this->properties, "model")) {
			return false;
		}
		
	 	if(!property_exists($this->properties, "columns") || is_null($this->properties->columns)) {
			$this->getModelInfo();
		}
		
		try {
			
			if($this->properties->verify) {
				$this->validateData();
			}
			
			if(!$this->properties->append) {
				$this->deleteData();
			}
			
			if($this->properties->has_header) {
				$this->properties->columns = $this->data[0];
				unset($this->data[0]);
			}
			
			$this->properties->con->beginTransaction();

			foreach($this->data as $row) {
				
				if(!$statement) {
					$obj = new $this->properties->model;
				
					foreach($row as $k => $field) {
						$method = "set".sfInflector::camelize($this->properties->columns[$k]);
						$obj->$method($field);
					}
					
					$obj->save();
					$obj->clearAllReferences(true);	
				} else {
					foreach($row as $k => $field) {
						$statement->bindValue(":".$this->properties->columns[$k], $field); 
					}	
					$result = $statement->execute();  
				}
				
			}
			
			$this->properties->con->commit();
		}
		catch (Exception $e) {
			$this->properties->con->rollBack();
			throw new ImporterException($this->properties->current."<br><br>Error:<br><br>".$e->getMessage());
		}
		
		
	}
	
	
	/**
	 * 
	 * Sets the value of a property to be used by the given importer.
	 * 
	 * @param string $property Name of the property
	 * @param mixed $value Value of the property
	 */
	public function setProperty($property,$value) {
		
		$this->properties->$property = $value;
	}
	
	/**
	 * 
	 * Returns the value of a property or null if the property doesn't exist.
	 * @param string $property The name of the property
	 * @return mixed
	 */
	public function getProperty($property) {
		
		return property_exists($this->properties, $property) ? $this->properties->$property : null;
	}
	
	
	
}