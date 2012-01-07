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
		
		$allowed_mimes = array
		(
		"application/zip; charset=binary",
		"application/vnd.ms-office; charset=binary",
		"application/octet-stream; charset=binary"
		);
		
		try {
			
			$finfo = finfo_open(FILEINFO_MIME);
			
			if(!in_array(finfo_file($finfo,$path),$allowed_mimes)) {
				throw new ImporterException("Not a Spreadsheet document!");
			}
			
			$method = $this->properties->raw ? "getValue" : "getCalculatedValue";
			$objReader = PHPExcel_IOFactory::createReader($type);
			$first_sheet = null;
			
			if($this->properties->worksheet) {
				
				$sheets = explode(",",str_replace(" ", "", $this->properties->worksheet));
				
				if($this->properties->has_header && !$this->properties->worksheets_as_models) {
					$all_sheets = $objReader->listWorksheetNames($path);
					$objReader->setLoadSheetsOnly(array((string) $all_sheets[0]));
					$objPHPExcel = @$objReader->load($path);
					$first_sheet = $objPHPExcel->getSheet(0);
					foreach($first_sheet->getRowIterator() as $row) {
						$cellIterator = $row->getCellIterator();
						$cellIterator->setIterateOnlyExistingCells(true);
						foreach ($cellIterator as $cell) {
							$this->data[$first_sheet->getTitle()][$row->getRowIndex()-1][] = $cell->getValue();
						}	
						break;
					}
					
				}
				
				$objReader->setLoadSheetsOnly($sheets);
				
				if($this->properties->worksheets_as_models) {
					foreach($sheets as $sheet) {
						if(!class_exists($sheet)) {
							throw new ImporterException("Model '".$sheet."' does not exist!");
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
				throw new ImporterException("There is no data to import in file! Did you type worksheet names correctly?");
			}
			
			foreach ($worksheets as $worksheet) {
				$lineno = 1;
				foreach ($worksheet->getRowIterator() as $rk => $row) {
					if($rk == 1 && $first_sheet && $worksheet->getTitle() == $first_sheet->getTitle()) {
						continue;
					}
					$cellIterator = $row->getCellIterator();
					$cellIterator->setIterateOnlyExistingCells(true);
					$lineno++;
					$this->properties->lines = $worksheet->getTitle().":".$lineno;
					if($this->properties->worksheets_as_models && $this->isInvalidModel($worksheet->getTitle())) {
						throw new ImporterException("Model '".$worksheet->getTitle()."' does not exist!");
					}
					foreach ($cellIterator as $cell) {
						if(!is_null($cell) && $cell->getValue()) {
							if(PHPExcel_Shared_Date::isDateTime($cell)) {
								$value = $cell->getCalculatedValue();
								if($value instanceof PHPExcel_RichText) {
									$value = $value->getPlainText();
								}
								$this->data[$worksheet->getTitle()][$row->getRowIndex()-1][] = date("Y-m-d H:i:s",PHPExcel_Shared_Date::ExcelToPHP($value));		
							} else if($cell->hasHyperlink()) {
								$this->data[$worksheet->getTitle()][$row->getRowIndex()-1][] = '<a href="'.$cell->getHyperlink()->getUrl().'" title="'.$cell->getHyperlink()->getTooltip().'">'.$cell->$method().'</a>';
							} else {
								$this->data[$worksheet->getTitle()][$row->getRowIndex()-1][] = $cell->$method();		
							}
							
						}
					}
				}
			} 
		}
		catch (Exception $e) {
			throw new ImporterException("<b>File</b>: ".$path."<br /><br /><b>Error</b>: ".$e->getMessage()."<br/>");
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
				$this->properties->columns = null;
				parent::insertData();
			}
		}
		
	}
	
}