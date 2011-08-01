<?php
/**
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     radu@immune.dk
 */
class appFlowerStudioActions extends afsActions
{
	public function preExecute()
	{
		$this->realRoot = sfConfig::get('sf_root_dir');
		$this->afExtjs = afExtjs::getInstance();        
		$this->afStudioUser = json_encode(afStudioUser::getInstance()->getInfo());
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
  					if(afStudioUtil::writeFile($file,$code))
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
	
	/**
	 * Execute models command
	 *
	 * @param sfWebRequest $request 
	 * @return string -json
	 * @author Sergey Startsev
	 */
	public function executeModels(sfWebRequest $request)
	{
		$command = $request->getParameter('cmd', $request->getParameter('xaction'));
        $response = afStudioCommand::process('model', $command, $request->getParameterHolder()->getAll());
        
        return $this->renderJson($response);
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
		
		$content=file_get_contents("php://input");
		
		$cssPath=sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/web/css/';
		
		$node=$this->hasRequestParameter('node')?$this->getRequestParameter('node'):"";
		
		afStudioUtil::writeFile($cssPath.$node,$content);

	 	if($result) {
		    $success = true;
		    $message = 'File saved successfully';
		    
		    afsNotificationPeer::log('Css file ['.$cssPath.$node.'] saved successfully', 'afStudioCssEditor');
		    
		} else {
		    $success = false;
		    $message =  'Error while saving file to disk!';
		    
		    afsNotificationPeer::log('Error while saving file to disk! ['.$cssPath.$node.']', 'afStudioCssEditor');
		}
		
		$info=array('success'=>$success, "message"=>$message);
		return $this->renderJson($info);
	}
	
	public function executeConsole(sfWebRequest $request)
	{		
		$command = trim($request->getParameter("command"));
		$result = afStudioConsole::getInstance()->execute($command);
		
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
        $info = array('success'=>true, 'data' => $data );
        $info = json_encode($info);

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
     * 
     * @param sfWebRequest $request
     * @author Sergey Startsev
     */
    public function executeDebug(sfWebRequest $request)
    {
        $parameters = array(
            'file_name' => $request->getParameter('file_name'),
            'start'     => $request->getParameter('start', 0),
            'limit'     => $request->getParameter('limit', 1)
        );
        
        $command = ($command = $request->getParameter('command', 'main')) ? $command : 'main';
        
        $response = afStudioCommand::process('debug', $command, $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Notifications action
     */
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
    
	public function executeHelperFileSave($request)
	{
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
	public function executeCheckHelperFileExist($request)
	{
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
      	try {
		$vimeoService = new VimeoInstanceService();
        	$data = $vimeoService->getDataFromRemoteServer();        	
      	} catch (Exception $e) { 
            if (sfConfig::get('sf_environment') == 'dev') {
                throw $e;
            } else {
      		$data = array();
            }
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
	
	public function executeCreateProjectWizardCheckDatabase($request)
	{
	    $aResult = afStudioCommand::process('createProject', 'checkDatabase',array('request'=>$request));
	            
        return $this->renderJson($aResult);
	}
	
	public function executeCreateProjectWizard($request)
	{        
		$result = afStudioCommand::process('createProject', 'saveWizard', array('request'=>$request));
		
        return $this->renderJson($result);
	}
	
}
