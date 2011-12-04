<?php

/**
 * 
 * Importer of YAML Propel fixture files.
 * @author tamas
 *
 */
class YmlImporter extends BaseImporter {
	
	/**
	 * Not implemented since Symfony takes care about this.
	 * @see importer/BaseImporter::loadData()
	 */
	public function loadData($path) {}
	
	
	/**
	 * Overrides base method, uses the Symfony mechanism to rea, validate and insert data.
	 * @see importer/BaseImporter::insertData()
	 */
	public function insertData() {	
		
		$path = func_get_arg(0);
		
		try {
			$data = new sfPropelData();
    		$data->setDeleteCurrentData(!$this->properties->append);
    		$data->loadData($path);	
		}
		catch (Exception $e) {
			if($e instanceof InvalidArgumentException) {
				throw new ImporterException("Invalid YAML file: ".$e->getMessage());
			} else {
				throw new ImporterException("Couldn't insert data to DB from file: ".$path);	
			}
			
		}
		
		
	}
	
}