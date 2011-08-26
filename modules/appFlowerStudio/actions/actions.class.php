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
        
        $response = afStudioCommand::process('file', 'content', $parameters);
        
        return $this->renderJson($response->asArray());
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
	
	/**
	 * Css Files tree list
	 *
	 * @return void
	 * @author Sergey Startsev
	 */
	public function executeCssfilestree()
	{
	    $response = afStudioCommand::process('file', 'cssfiles', $request->getParameterHolder()->getAll());
	    
	    if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
        }
	    
		return $this->renderJson($response->asArray());
	}
    
    
    
	public function executeCssfilesSave()
	{
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
	
	
	/**
	 * Execute console command actiom
	 *
	 * @param sfWebRequest $request 
	 * @return string - json
	 * @author Sergey Startsev
	 */
    public function executeConsole(sfWebRequest $request)
    {		
        return $this->renderJson(
            afResponseHelper::create()
                ->success(true)
                ->console(afStudioConsole::getInstance()->execute(trim($request->getParameter("command"))))
                ->asArray()
        );
    }	
    
    /**
     * Load Database connection settings action
     *
     * @param sfWebRequest $request 
     * @return string - json
     */
    public function executeLoadDatabaseConnectionSettings(sfWebRequest $request)
    {
        $dcm = new DatabaseConfigurationManager();
        
        return $this->renderJson(
            afResponseHelper::create()
                ->success(true)
                ->data(array(), $dcm->getDatabaseConnectionParams(), 0)
                ->asArray()
            );
    }
    
    /**
     * Configure database
     *
     * @param sfWebRequest $request 
     * @return string - json
     */
    public function executeConfigureDatabase(sfWebRequest $request)
    {
        $dcm = new DatabaseConfigurationManager();
        $dcm->setDatabaseConnectionParams($request->getPostParameters());
        
        $isSaved = $dcm->save();
        
        return $this->renderJson(
            afResponseHelper::create()
                ->success($isSaved)
                ->message(($isSaved) ? 'Database Connection Settings saved successfully' : 'Error while saving file to disk!')
                ->redirect($this->getRequest()->getReferer())
                ->asArray()
        );
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
        FirePHP::getInstance(true)->fb('module widgets');
        /*
            TODO move to helper
        */
        
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
    
    
    
    
    
    /**
	 * Check if file exists and if not there create a new one based on the template
	 * 
	 * @return string - json
	 * @author Sergey Startsev 
	 */
	public function executeCheckHelperFileExist(sfWebRequest $request)
	{
		return $this->renderJson(
		    afStudioCommand::process('file', 'isHelperExists', $request->getParameterHolder()->getAll())->asArray()
		);
	}
    
    /**
     * Delegator saving helper file
     *
     * @param sfWebRequest $request 
     * @return string - json
     * @author Sergey Startsev
     */
	public function executeHelperFileSave(sfWebRequest $request)
	{
	    return $this->renderJson(
		    afStudioCommand::process('file', 'saveHelper', $request->getParameterHolder()->getAll())->asArray()
		);
	}
	
	
	
	
	
	
	
	
	/**
	 * Getting info for template selector
	 * 
	 * @return string - json for templateSelector
	 * @author Radu Topala
	 */
	public function executeTemplateSelector($request)
	{        
        $response = afStudioCommand::process('templateSelector', $request->getParameter('cmd'),array('request'=>$request));
              
        return $this->renderJson($aResult);
	}
	
	
	
	
	
    public function executeConfigureProject(sfWebRequest $request)
    {
        $pcm = new ProjectConfigurationManager($request);
	    $result = $pcm->build();
            
        return $this->renderText($result);
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
	
}
