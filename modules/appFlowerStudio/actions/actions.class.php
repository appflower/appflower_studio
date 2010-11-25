<?php

/**
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     radu@immune.dk
 */
class appFlowerStudioActions extends sfActions
{
	public function preExecute()
	{
		$this->realRoot=sfConfig::get('sf_root_dir');
		$this->immExtjs=ImmExtjs::getInstance();
	}	
		
	public function executeIndex()
	{
		
	}
	
	public function executeStudio()
	{
		
	}
			
	public function executeCodepress($request)
	{
		$this->codepress_path=$this->immExtjs->getExamplesDir().'codepress/';
		
		$this->language=(($this->hasRequestParameter('language')&&$this->getRequestParameter('language')!='undefined')?$this->getRequestParameter('language'):'generic');
		
		return $this->renderPartial('codepress');		
	}
	
	public function executeFilecontent($request)
	{
		$file=$this->hasRequestParameter('file')?$this->getRequestParameter('file'):false;
		$code=$this->hasRequestParameter('code')?$this->getRequestParameter('code'):false;
				
		if($this->getRequest()->getMethod()==sfRequest::POST)
  		{
  			if($file&&$code)
  			{
  				$file=str_replace('root',$this->realRoot,$file);
  				
  				if(is_writable($file))
  				{
  					if(@file_put_contents($file,$code))
					{
						return $this->renderText('');
					}
					else {
						$this->redirect404();
					}
  				}
  				else {
					$this->redirect404();
				}
  			}
  			else {
				$this->redirect404();
			}  			
  		}
  		else {
		
			if($file)
			{
				$file=str_replace('root',$this->realRoot,$file);
				
				$file_content=@file_get_contents($file);
				
				$data = array('response'=>$file_content);
			
				if($file_content)
				{
					return $this->renderText(json_encode($data));
				}
				else {
					$this->redirect404();
				}
			}
			else {
				$this->redirect404();
			}		
  		}
	}
	
	public function executeFiletree()
	{
		$filetree_command=new ImmExtjsFileTreeCommand($this->realRoot);
		
		return $this->renderText($filetree_command->end());
	}
	
	public function executeModels()
	{
		$models_command = new afStudioModelsCommand();		
		$this->getResponse()->setHttpHeader("Content-Type", 'application/json');
		
		return $this->renderText($models_command->end());
	}
	
	public function executeModules()
	{
		$modules_command=new afStudioModulesCommand();
		
		return $this->renderText($modules_command->end());
	}

	public function executePlugins()
	{
		$modules_command=new afStudioPluginsCommand();

		return $this->renderText($modules_command->end());
	}

	public function executeConsole(sfWebRequest $request)
	{
		$command = trim($request->getParameter("command"));
		
		$afConsole=new afStudioConsole();
		$result=$afConsole->execute($command);		
		
		return $this->renderJson(array('console'=>$result));
	}
	
	protected function renderJson($result)
	{
		 return $this->renderText(json_encode($result));
	}

    public function executeLoadDatabaseConnectionSettings(sfWebRequest $request)
    {
        $dcm = new DatabaseConfigurationManager();
        $data = $dcm->getDatabaseConnectionParams();

        $info=array('success'=>true, 'data' => $data );
        $info=json_encode($info);

        return $this->renderText($info);
    }

    public function executeConfigureDatabase(sfWebRequest $request)
    {
        $dcm = new DatabaseConfigurationManager();
        $dcm->setDatabaseConnectionParams($request->getPostParameters());
        $result = $dcm->save();

        if($result) {
            $success = true;
            $message = 'Database Connection Settings saved successfully';
        } else {
            $success = false;
            $message =  'Error while saving file to disk!';
        }
        
        $info=array('success'=>$success, "message"=>$message, 'redirect'=>$this->getRequest()->getReferer());
        $info=json_encode($info);

        return $this->renderText($info);
    }

    /**
     * Returns all rows for given model in a format for ModelGrid view
     *
     * @param sfWebRequest $request
     * @return array
     */
    public function executeModelsDataRead(sfWebRequest $request)
    {
	    $modelName = $request->getParameter('model');
        $query = new ModelCriteria(null, $modelName);
        $data = $query->find();
        $data2 = array();
        foreach ($data as $row) {
                $arrayWithKeys = $row->toArray();
                $col = 0;
                $tmp = array();
                foreach ($arrayWithKeys as $value) {
                    $tmp["c{$col}"] = $value;
                    $col++;
                }
                $tmp['id'] = $row->getPrimaryKey();
                $data2[] = $tmp;
        }
        $result = array(
            'rows' => $data2,
            'results' => count($data2),
            'success' =>true
        );

        return $result;
    }

    /**
     * Saves changes made to data in ModelGrid view
     *
     * @param sfWebRequest $request
     * @return array
     */
    public function executeModelsDataUpdate(sfWebRequest $request)
    {
	    $modelName = $request->getParameter('model');
        $modelQueryClass = "{$modelName}Query";
        $query = new $modelQueryClass;

        $rawData = file_get_contents('php://input');
        $data = json_decode($rawData, true);
        $rows = $data['rows'];
        if (isset($rows['id'])) {
                $rows = array($rows);
        }
        $rowsIndexed = array();
        foreach ($rows as $row) {
                $rowsIndexed[$row['id']] = $row;
        }
        $ids = array_keys($rowsIndexed);
        $objects = $query->filterByPrimaryKeys($ids)->find();
        try {
                foreach ($objects as $object) {
                        $peer = $object->getPeer();
                        $objectData = $rowsIndexed[$object->getPrimaryKey()];
                        unset($objectData['id']);
                        foreach ($objectData as $col => $value) {
                                $colNr = str_replace('c', '', $col);
                                $colPhpName = $peer->translateFieldName($colNr, BasePeer::TYPE_NUM, BasePeer::TYPE_PHPNAME);
                                $colSetterMethod = "set{$colPhpName}";
                                $object->$colSetterMethod($value);
                        }
                        $object->save();
                }
        } catch (Exception $e) {
                return array(
                    'success' => false,
                    'error' => $e->getMessage()
            );
        }

        return array('success' => true);
    }
}
