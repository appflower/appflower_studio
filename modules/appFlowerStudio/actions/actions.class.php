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
				
		$file=(substr($file,0,4)=='root')?str_replace('root',$this->realRoot,substr($file,0,4)).substr($file,4):$file;
		
		if($this->getRequest()->getMethod()==sfRequest::POST)
  		{
  			if($file&&$code)
  			{
  				if(is_writable($file))
  				{
  					if(@file_put_contents($file,$code))
					{
						return $this->renderText(json_encode(array('success'=>true)));
					}
					else {
						return $this->renderText(json_encode(array('success'=>false)));
					}
  				}
  				else {
					return $this->renderText(json_encode(array('success'=>false)));
				}
  			}
  			else {
				return $this->renderText(json_encode(array('success'=>false)));
			}  			
  		}
  		else {
		
			if($file)
			{
				$file_content=@file_get_contents($file);
				if($file_content)
				{
					return $this->renderText(json_encode(array('response'=>$file_content)));
				}
				else {
					return $this->renderText(json_encode(array('success'=>false)));
				}
			}
			else {
				return $this->renderText(json_encode(array('success'=>false)));
			}		
  		}
	}
	
	public function executeFiletree()
	{
		$filetree_command=new afStudioFileTreeCommand($this->realRoot);
		
		return $this->renderText($filetree_command->end());
	}
	
	public function executeModels()
	{
		//TODO: debug only
//		return $this->renderJson(array('console'=>'test'));
		
		$models_command = new afStudioModelsCommand();		
		$this->getResponse()->setHttpHeader("Content-Type", 'application/json');
		
		return $this->renderText($models_command->end());
	}
	
	public function executeModules()
	{
		//TODO: debug only
		return $this->renderJson(array('console'=>'test'));
		
		$modules_command=new afStudioModulesCommand();
		
		return $this->renderText($modules_command->end());
	}

	public function executePlugins()
	{
		//TODO: debug only
//		return $this->renderJson(array('console'=>'test'));
		
		$modules_command=new afStudioPluginsCommand();

		return $this->renderText($modules_command->end());
	}

	public function executeCssfilestree(){
		$nodes = array(
			array('text' => 'afStudio.console.css', 'id' => 'css/afStudio.console.css', 'leaf' => true),
			array('text' => 'afStudio.css', 'id' => 'css/afStudio.css', 'leaf' => true),
			array('text' => 'afStudio.tplSelector.css', 'id' => 'css/afStudio.tplSelector.css', 'leaf' => true)
		);
		return $this->renderJson($nodes);
	}
	
	public function executeConsole(sfWebRequest $request)
	{
		//TODO: debug only
//		return $this->renderJson(array('console'=>'test'));
		
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
     * Debug controller
     */
    public function executeDebug(sfWebRequest $request)
    {
        $command = $this->getRequestParameter('command');
        $file_name = $this->getRequestParameter('file_name');
        
        $aResponse = array();
        
        switch ($command) {
            case 'main':
                $aResponse['files'] = afStudioDebug::get_files();
                if (!empty($aResponse['files'])) {
                    $aResponse['debug'] = afStudioDebug::get_content($aResponse['files'][0]);
                } else {
                    $aResponse['debug'] = 'no logos';
                }
                
                break;
            
            default:
                $aResponse['debug'] = afStudioDebug::get_content($file_name);
                break;
        }
        
        return $this->renderJson($aResponse);
        
    }

    
    
    
}
