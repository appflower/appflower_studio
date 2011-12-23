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
	
	
	protected function validateData() {
		
		$path = func_get_arg(0);
		$yaml = sfYaml::load($path);

		foreach($yaml as $class => $data) {
			if($this->isInvalidModel(ucfirst($class))) {
				throw new ImporterException("Model '".ucfirst($class)."' doesn't exist!");
			}
		}
		
	}
	
	/**
	 * Overrides base method, uses the Symfony mechanism to rea, validate and insert data.
	 * @see importer/BaseImporter::insertData()
	 */
	public function insertData() {	
		
		$path = func_get_arg(0);
		
		try {
			
			if($this->properties->verify) {
				$this->validateData($path);
			}
			
			$data = new sfPropelData();
    		$data->setDeleteCurrentData(!$this->properties->append);
    		$data->loadData($path);	
		}
		catch (Exception $e) {
			throw new ImporterException("Data import failed for:<br/><br/>File: ".$path."<br /><br />Error: ".$e->getMessage());	
		}
		
		
	}
	
}