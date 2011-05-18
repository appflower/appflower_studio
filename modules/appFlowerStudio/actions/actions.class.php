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
		$this->realRoot = sfConfig::get('sf_root_dir');
		$this->afExtjs = afExtjs::getInstance();        
		$this->userinfo = afStudioUser::getInstance()->getInfo();
	}	
	
	protected function renderJson($result)
	{
	    $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
		return $this->renderText(json_encode($result));
	}
	
	public function executeStudio()
	{
		$this->setTemplate(sfConfig::get('afs_debug') ? 'devStudio' : 'prodStudio');				
	}
			
	public function executeCodepress($request)
	{
		$this->codepress_path = '/appFlowerStudioPlugin/js/codepress/';
						
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
		$models_command = new afStudioModelsCommand();
		return $this->renderText($models_command->end());
	}
	
	public function executeModules()
	{
		$modules_command = new afStudioModulesCommand();		
		return $this->renderText($modules_command->end());
	}

	public function executePlugins()
	{
		$modules_command = new afStudioPluginsCommand();
		return $this->renderText($modules_command->end());
	}

	public function executeCssfilestree(){
		$cssPath = sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/web/css/';
		$cssExtensions = sfFinder::type('file')->name('*.css')->sort_by_name()->in($cssPath);
		$i = 0;
		foreach ($cssExtensions as $cssExtension) {
			$cssExtension = str_replace(sfConfig::get('sf_root_dir')."/plugins/appFlowerStudioPlugin/web/css/","",$cssExtension);
			$nodes[$i] = array(
				'text' => $cssExtension, 
				'id' => 'css/'.$cssExtension, 
				'leaf' => true
		    );
			$i++;
		}
		/*
		$nodes = array(
			array('text' => 'afStudio.console.css', 'id' => 'css/afStudio.console.css', 'leaf' => true),
			array('text' => 'afStudio.css', 'id' => 'css/afStudio.css', 'leaf' => true),
			array('text' => 'afStudio.tplSelector.css', 'id' => 'css/afStudio.tplSelector.css', 'leaf' => true),
			array('text' => 'afStudio.tplSelector.css1', 'id' => 'css/afStudio.tplSelector.css1', 'leaf' => true)
		);*/
		return $this->renderJson($nodes);
	}

	public function executeCssfilesSave(){
		$result=true;
		$JDATA=file_get_contents("php://input");
		$cssPath=sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/web/css/';
		//echo $JDATA;
		$node=$this->hasRequestParameter('node')?$this->getRequestParameter('node'):"";
		try{
			$fp = fopen($cssPath.$node,"w");
			if(!$fp)throw new Exception("file open error");
			if(!fWrite($fp,$JDATA))throw new Exception("file write error");
			if(!fclose($fp))throw new Exception("file close error");
		}catch(Exception $e){
			$result=false;	
		}

	 	if($result) {
		    $success = true;
		    $message = 'File saved successfully';
		    
		    afsNotificationPeer::log('Css file ['.$cssPath.$node.'] saved successfully', 'css_editor');
		    
		} else {
		    $success = false;
		    $message =  'Error while saving file to disk!';
		    
		    afsNotificationPeer::log('Error while saving file to disk! ['.$cssPath.$node.']', 'css_editor');
		}
		
		$info=array('success'=>$success, "message"=>$message);
		return $this->renderJson($info);
	}
	
	public function executeConsole(sfWebRequest $request)
	{		
		$command = trim($request->getParameter("command"));
		
		$afConsole=new afStudioConsole();
		$result=$afConsole->execute($command);		
		
		return $this->renderJson(
			array(
				'success' => true,
				'console' => $result
			)
		);
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
	 * Function getRecentProjects
	 */
    public static function getRecentProjects(){
        $projects = array(
        	array('id' => '1', 'text' => 'Firt project'),
        	array('id' => '2', 'text' => 'Second project'),
        	array('id' => '3', 'text' => 'Third project'),
        	array('id' => '4', 'text' => 'Fourth project'),
        	array('id' => '5', 'text' => 'Fifth project')
		);
        $projects = json_encode($projects);    	
    	return $projects;	
    }
    
    /**
     * Debug controller
     */
    public function executeDebug(sfWebRequest $request)
    {
        $command = $this->getRequestParameter('command');
        $file_name = $this->getRequestParameter('file_name');
        
        $start = $this->getRequestParameter('start', 0);
        
        $limit = $this->getRequestParameter('limit', 1);
        $limit *= 4094;
        
        $aResponse = array();
        
        switch ($command) {
            case 'file':
                if (!empty($file_name)) {
                    $oDebugPager = new afStudioDebugPager(  afStudioDebug::get_file_len($file_name), 
                                                            $start, 
                                                            $limit);
                    $aResponse['total'] = $oDebugPager->getLastPage();
                    $aResponse['data'][] = array('text' => afStudioDebug::get_content(  $file_name, 
                                                                                        $oDebugPager->getPage() * 4094, 
                                                                                        $oDebugPager->getNext()* 4094
                                                                                     )
                                                           );
                    
                } else {
                    $aResponse['data'][] = array('text' => 'file not checked');
                    $aResponse['total'] = 1;
                }
                
                break;
            
            case 'last':
                if (empty($file_name)) {
                    $aFiles = afStudioDebug::get_files();
                    $file_name = $aFiles[0];
                }
                $oDebugPager = new afStudioDebugPager(  afStudioDebug::get_file_len($file_name), 
                                                        0, 
                                                        4094);
                $aResponse['last_page'] = $oDebugPager->getLastPage() - 1;
                
                break;
            
            default:
                $aResponse['files'] = afStudioDebug::get_files();
                
                if (!empty($aResponse['files'])) {
                    
                    $oDebugPager = new afStudioDebugPager(  afStudioDebug::get_file_len($aResponse['files'][0]), 
                                                            $start, 
                                                            $limit);
                    
                    $aResponse['total'] = $oDebugPager->getLastPage();
                    
                    $aResponse['data'][] = array('text' => afStudioDebug::get_content(  $aResponse['files'][0], 
                                                                                        $oDebugPager->getPage() * 4094, 
                                                                                        $oDebugPager->getNext()* 4094
                                                                                     )
                                                );
                } else {
                    $aResponse['data'][] = array('text' => 'no logs');
                    $aResponse['total'] = 1;
                }
                
                break;
        }

        $aResponse['success'] = true;
        
        return $this->renderJson($aResponse);
    }

    public function executeNotifications()
	{
		$notifications_command = new afStudioNotificationsCommand($this->realRoot);		
		return $this->renderText($notifications_command->end());
	}    
    
    /**
     * Getting widgets list by app nane and module name
     */
    public function executeModuleWidgets(sfWebRequest $request)
    {
        $app = $request->getParameter('app_name', 'frontend');
        $module = $request->getParameter('module_name', '');
        
        $aWidgets = afStudioUtil::getFiles($this->realRoot."/apps/".$app."/modules/".$module."/config/", true, "xml");
        
        $aExtWidgets = array();
    	foreach ($aWidgets as $i => $name) {
    		$aExtWidgets[] = array('id' => $i, 'name' => strstr($name, '.xml', true));
		}
        
        return $this->renderJson($aExtWidgets);        
    }
    
    /**
     * Process layout pages functionality
     */
    public function executeLayout(sfWebRequest $request)
    {
        $sCommand = $request->getParameter('cmd');        
        $aResult = afStudioCommand::process('layout', $sCommand);
        
        return $this->renderJson($aResult);        
    }
    
    public function executeConfigureProject(sfWebRequest $request)
    {
        $pcm = new ProjectConfigurationManager($request);
	    $result = $pcm->build();
            
        return $this->renderText($result);
    }
    
	public function executeHelperFileSave($request){
		$result=true;
		$JDATA=file_get_contents("php://input");
		
		$helper = $request->getParameter('helper');
		
		$filePath=sfConfig::get('sf_root_dir').'/apps/frontend/lib/helper/'.$helper.'Helper.php';
		try{
			$fp = fopen($filePath,"w");
			if(!$fp)throw new Exception("file open error");
			if(!fWrite($fp,$JDATA))throw new Exception("file write error");
			if(!fclose($fp))throw new Exception("file close error");
		}catch(Exception $e){
			$result=false;	
		}

	 	if($result) {
		    $success = true;
		    $message = 'File saved successfully';
		    
		    afsNotificationPeer::log('File saved successfully ['.$filePath.']', $helper);
		} else {
		    $success = false;
		    $message =  'Error while saving file to disk!';
		    
		    afsNotificationPeer::log('Error while saving file to disk! ['.$filePath.']', $helper);
		}
		
		$info=array('success'=>$success, "message"=>$message);
		return $this->renderJson($info);
	}
	
	/**
	 * Check if file exists and if not there create a new one based on the template
	 */
	public function executeCheckHelperFileExist($request){
		$result = true;
		$message = "";
		
		$helper = $request->getParameter('helper');
		
		$filePath=sfConfig::get('sf_root_dir').'/apps/frontend/lib/helper/'.$helper.'Helper.php';
		
		if (!file_exists($filePath)) {
			try{
				$_helper = file_get_contents(sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/modules/appFlowerStudio/templates/_'.$helper.'Helper.php', true);
				$fp = fopen($filePath,"w");
				fWrite($fp,$_helper);
				fclose($fp);
			}catch (Exception $e) {
				$result=false;
				$message = 'Error while saving file to disk!';
			}
			
			$message = 'File created successfully';
		}
		
		$info=array('success'=>$result, "message"=>$message);
		return $this->renderJson($info);
	}
	
	/**
	 * @return json for load project feature
	 * 
	 * @author radu
	 */
	public function executeLoadProjectTree($request)
	{        
        $aResult = afStudioCommand::process('loadProjectTree', $request->getParameter('cmd'),array('request'=>$request));        
        return $this->renderJson($aResult);
	}
	
	/**
	 * Execute run project coomand
	 * 
	 * @author startsev.sergey@gmail.com
	 */
	public function executeRun()
	{        
        $aResult = afStudioCommand::process('execute', 'run');        
        $aResult = array_merge(
            $aResult, 
            array('homepage' => sfContext::getInstance()->getController()->genUrl('@homepage'))
        );        
        afsNotificationPeer::log('[run] Run was executed on the project');
        
        return $this->renderJson($aResult);
	}
	
	/**
	 * @return json for create project feature
	 * 
	 * @author radu
	 */
	public function executeCreateProject($request)
	{        
        $aResult = afStudioCommand::process('createProject', $request->getParameter('cmd'),array('request'=>$request));        
        return $this->renderJson($aResult);
	}

	public function executeWelcome($request)
	{		
		$data = array();
		$vimeoService = new VimeoInstanceService();
      	try {
        	$data = $vimeoService->getDataFromRemoteServer();        	
      	} catch (Exception $e) { 
      		$data = array();
      	}        
		$message = $this->getPartial('welcome', array('data'=>$data));		
        $info = array(
        	"success" => true, 
        	"message" => $message, 
        	"code" => "jQuery('#studio_video_tours ul').jScrollPane();"
        );
        
		return $this->renderJson($info);
	}
	
	/**
	 * @return json for templateSelector
	 * 
	 * @author radu
	 */
	public function executeTemplateSelector($request)
	{        
        $aResult = afStudioCommand::process('templateSelector', $request->getParameter('cmd'),array('request'=>$request));        
        return $this->renderJson($aResult);
	}
	
	public function executeCreateProjectWizard($request)
	{        
		$result = afStudioCommand::process('createProject', 'save', array('request'=>$request));
        if (!$result['success']) {
        	return $this->renderJson($result);
        }
        
        $result = afStudioCommand::process('templateSelector', 'update',array('request'=>$request));
		if (!$result['success']) {
        	return $this->renderJson($result);
        }
		
        // save db settings
        $dcm = new DatabaseConfigurationManager();
        $dcm->setDatabaseConnectionParams(array('database'=>$request->getParameter('database'), 'host'=>$request->getParameter('host'), 'port'=>$request->getParameter('port'), 'username'=>$request->getParameter('db_user'), 'password'=>$request->getParameter('db_pass')));
        $result = $dcm->save();
        if (!$result) {
            $info=array('success'=>false, "message"=>'Error while saving file to disk!');
        	return $this->renderJson(json_encode($info));
        }
        
		$result = afStudioUserHelper::createNewUser($request);
		if (!$result['success']) {
        	return $this->renderJson($result);
        }
        
        return array('success' => true, 'message' => 'Project created.');
	}
	
}
