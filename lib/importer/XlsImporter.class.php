<?php

/**
 * 
 * An importer for spreadsheets. Supported formats are:
 * 
 * - MS Excel 2007 (xlsx)
 * - MS Excel 5, 95, 97, 2000 (xls)
 * - OpenOffice Calc (ods)
 * 
 * @author tamas
 *
 */
class XlsImporter extends BaseImporter {
	
	public function __construct(Array $parameters) {
		
		parent::__construct($parameters);
		
		$this->properties->worksheet = $parameters["worksheet"];
		$this->properties->worksheets_as_models = $parameters["worksheets_as_models"];
		$this->properties->raw = $parameters["raw"];
		$this->properties->lines = 0;
		
	}
	
	/**
	 * Loads an Excel document and processes all non-empty worksheets or only the selected ones.
	 * This reads data and cell formatting info as well, can open Excel 2007, 2003 and Excel 5 files. 
	 * The current reader extracts all values and converts dates / times and hyperlinks automatically.
	 * 
	 * @see importer/BaseImporter::loadData()
	 */
	public function loadData($path) {
		
		$ext = afsFileSystem::create()->getExtension($path);
		
		switch($ext) {
			case "xls":
				$type = "Excel5";
				break;
			case "xlsx":
				$type = "Excel2007";
				break;
			case "ods":
				$type = "OOCalc";
				break;
		}
		
		$method = $this->properties->raw ? "getValue" : "getCalculatedValue";
		$objReader = PHPExcel_IOFactory::createReader($type);
		
		if($this->properties->worksheet) {
			$sheets = explode(",",$this->properties->worksheet);
			$objReader->setLoadSheetsOnly($sheets);
			
			if($this->properties->worksheets_as_models) {
				foreach($sheets as $sheet) {
					if(!class_exists($sheet)) {
						throw new ImporterException("Error in file ".$path."<br><br>Model '".$sheet."' does not exist!");
					}		
				}
			}
		} else {
			$objReader->setLoadAllSheets();
		}
		
		$objPHPExcel = @$objReader->load($path);
		$worksheets = $objPHPExcel->getAllSheets();
		
		foreach($worksheets as $k => $worksheet) {
			if(is_null($worksheet->getCellByColumnAndRow(0,1)->getValue())) {
				unset($worksheets[$k]);
			}
		}
		
		if(sizeof($worksheets) == 0) {
			throw new ImporterException("There is no data to import in file: ".$path);
		}
		
		foreach ($worksheets as $worksheet) {
			$lineno = 1;
			foreach ($worksheet->getRowIterator() as $row) {
				$cellIterator = $row->getCellIterator();
				$cellIterator->setIterateOnlyExistingCells(true);
				$lineno++;
				$this->properties->lines = $worksheet->getTitle().":".$lineno;
				foreach ($cellIterator as $cell) {
					if(!is_null($cell) && $cell->getValue()) {
						if(PHPExcel_Shared_Date::isDateTime($cell)) {
							$this->data[$worksheet->getTitle()][$row->getRowIndex()][] = date("Y-m-d H:i:s",PHPExcel_Shared_Date::ExcelToPHP($cell->getValue()));		
						} else if($cell->hasHyperlink()) {
							$this->data[$worksheet->getTitle()][$row->getRowIndex()][] = '<a href="'.$cell->getHyperlink()->getUrl().'" title="'.$cell->getHyperlink()->getTooltip().'">'.$cell->$method().'</a>';
						} else {
							$this->data[$worksheet->getTitle()][$row->getRowIndex()][] = $cell->$method();		
						}
						
					}
				}
			}
		} 
	}
	
	/**
	 * Overrides the base method, to process multiple worksheets.
	 * @see importer/BaseImporter::insertData()
	 */
	public function insertData() {
		
		if(!$this->properties->worksheets_as_models) {
			
			$data = array();
			
			foreach($this->data as $sheet) {
				foreach($sheet as $row) {
					$data[] = $row;
				}
			}
			
			$this->data = $data;
			parent::insertData();
			
		} else {
			
			$data = $this->data;
			
			foreach($data as $sheetname => $sheetrows) {
				$this->properties->model = $sheetname;
				$this->data = $sheetrows;
				sort($this->data);
				$this->properties->columns = null;
				parent::insertData();
			}
		}
		
	}
	
}