<?php
/**
 * Main studio actions class
 *
 * @package     appFlowerStudio
 * @subpackage  plugin
 * @author      Radu Topala <radu@immune.dk>
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class appFlowerStudioActions extends afsActions
{
    /**
     * Pre-execute mehtod
     *
     * @return void
     * @author Sergey Startsev
     */
    public function preExecute()
    {
        $this->realRoot = sfConfig::get('sf_root_dir');
        $this->afExtjs = afExtjs::getInstance();
        $this->afStudioUser = json_encode(afStudioUser::getInstance()->getInfo());
    }
    
    /**
     * Studio runner action
     */
    public function executeStudio()
    {
        $this->setTemplate(sfConfig::get('afs_debug') ? 'devStudio' : 'prodStudio');
    }
    
    /**
     * Code editor - higlighter action
     *
     * @param sfWebRequest $request 
     */
    public function executeCodepress(sfWebRequest $request)
    {
        $this->codepress_path = '/appFlowerStudioPlugin/js/codepress/';
        $this->language = (($request->hasParameter('language') && $request->getParameter('language') != 'undefined') ? $request->getParameter('language'):'generic');
        
        return $this->renderPartial('codepress');
    }
	
	/**
	 * Getting file content
	 *
	 * @param sfWebRequest $request 
	 * @return string - json
	 * @author Sergey Startsev
	 */
    public function executeFilecontent(sfWebRequest $request)
    {
        $parameters = array(
            'file'      => $request->getParameter('file', false),
            'code'      => $request->getParameter('code', false),
            'is_post'   => $request->getMethod() == sfRequest::POST,
        );
        
        return afStudioCommand::process('file', 'content', $parameters)->asArray();
	}
	
	/**
	 * Process filetree functionality
	 *
	 * @param sfWebRequest $request 
	 * @return string - json
	 * @author Sergey Startsev
	 */
    public function executeFiletree(sfWebRequest $request)
    {
        $response = afStudioCommand::process('file', $request->getParameter('cmd'), $request->getParameterHolder()->getAll());
        
        if ($request->getParameter('cmd') == 'get') {
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
            }
        }
        
        return $this->renderJson($response->asArray());
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
        
        if ($command == 'get') {
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
            }
        }
        
        return $this->renderJson($response->asArray());
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
     * 
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeNotifications(sfWebRequest $request)
	{
        $response = afStudioCommand::process('notification', $request->getParameter('cmd'), $request->getParameterHolder()->getAll());
        
        return $this->renderJson($response);
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
	 * @author Sergey Startsev
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
