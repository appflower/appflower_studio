<?php

/**
 * 
 * An importer for CSV files.
 * @author tamas
 *
 */
class CsvImporter extends BaseImporter {
	
	
	public function __construct(Array $parameters) {
		
		parent::__construct($parameters);
		
		$this->properties->delimeter = $parameters["delimeter"];
		$this->properties->enclosure = $parameters["enclosure"];
		$this->properties->lines = 0;
		
		if(!array_key_exists("model", $parameters) || !trim($parameters["model"])) {
			throw new ImporterException("Model name is not defined!");
		} 
		
	}
	
	/**
	 * This loads a CSV file and processes it line by line. Only the current row is stored in $this->data at any given time.
	 * 
	 * @see importer/BaseImporter::loadData()
	 */
	public function loadData($path) {
		
		$this->properties->lines = 1;
		
		$sql = 'INSERT INTO '.$this->properties->table.' ('.implode(", ", $this->properties->columns).') VALUES (:'.implode(", :", $this->properties->columns).')';  
		$statement = $this->properties->con->prepare($sql);  		
		
		try {
			
			$finfo = finfo_open(FILEINFO_MIME);
			
			if(substr(finfo_file($finfo,$path),0,4) != "text") {
				throw new ImporterException("Not a CSV document!");
			}
			
			$fp = fopen($path,"rt");
			
			if(!$fp) {
				throw new ImporterException("Couldn't read file!");
			}
			
			$first_row = 1;
			
			while(($row = fgetcsv($fp,0,$this->properties->delimeter,$this->properties->enclosure)) !== false) {
				if(count($row) == 1 && !$row[0]) {
					continue;
				}
				foreach($row as &$value) {
					$value = trim($value);
				}
				$this->data[] = $row;
				if($first_row && $this->properties->has_header) {
					$first_row = 0;
					continue;
				}

				parent::insertData($statement);
				$this->properties->lines++;
				$this->properties->has_header = false;
				$this->properties->append = true;
				$this->data = array();
			}
			
			fclose($fp);
			
		}
		catch (Exception $e) {
			/*if($this->properties->lines > 1) {
				parent::deleteData();
			}*/
			throw new ImporterException("<b>File</b>: ".$path."<br /><br /><b>Error</b>: ".$e->getMessage()."<br/>");
		}

	}
	
	
}