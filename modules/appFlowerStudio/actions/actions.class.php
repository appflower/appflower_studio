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
     * @return string
     */
    public function executeCodepress(sfWebRequest $request)
    {
        $this->codepress_path = '/appFlowerStudioPlugin/js/codepress/';
        $this->language = ($request->hasParameter('language') && $request->getParameter('language') != 'undefined') ? $request->getParameter('language') :'generic';
        
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
        
        return $this->renderJson(
            afStudioCommand::process('file', 'content', $parameters)->asArray()
        );
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
            afResponseHelper::create()->success(true)->data(array(), $dcm->getDatabaseConnectionParams(), 0)->asArray()
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
                ->redirect($request->getReferer())
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
        
        return $this->renderJson(
            afStudioCommand::process('debug', $command, $parameters)
        );
    }
    
    /**
     * Notifications action
     * 
     * @param sfWebRequest $request
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeNotifications(sfWebRequest $request)
	{
        return $this->renderJson(
            afStudioCommand::process('notification', $request->getParameter('cmd'), $request->getParameterHolder()->getAll())
        );
	}
    
    /**
     * Process layout pages functionality
     * 
     * @param sfWebRequest $request
     * @return string - json
     */
    public function executeLayout(sfWebRequest $request)
    {
        return $this->renderJson(
            afStudioCommand::process('layout', $request->getParameter('cmd'))
        );
    }
    
    /**
	 * Check if file exists and if not there create a new one based on the template
	 * 
	 * @param sfWebRequest $request
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
	 * @param sfWebRequest $request
	 * @return string - json for templateSelector
	 * @author Radu Topala
	 * @author Sergey Startsev
	 */
	public function executeTemplateSelector(sfWebRequest $request)
	{
        return $this->renderJson(
            afStudioCommand::process('template', $request->getParameter('cmd'), $request->getParameterHolder()->getAll())->asArray()
        );
	}
	
	/**
	 * Configuring project
	 *
	 * @param sfWebRequest $request 
	 * @return string
	 */
    public function executeConfigureProject(sfWebRequest $request)
    {
        $pcm = new ProjectConfigurationManager($request);
        
        return $this->renderText($pcm->build());
    }
	
	/**
	 * Load project tree
	 * 
	 * @param sfWebRequest $request
	 * @return string - json
	 * @author Radu Topala
	 * @author Sergey Startsev
	 */
	public function executeLoadProjectTree(sfWebRequest $request)
	{
        $command = $request->getParameter('cmd');
        $response = afStudioCommand::process('project', $command, $request->getParameterHolder()->getAll());
        
        if ($command == 'get') {
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
            }
        }
        
        return $this->renderJson($response);
	}
	
    /**
     * Execute run project coomand
     * 
     * @param sfWebRequest $request
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeRun(sfWebRequest $request)
    {
        afsNotificationPeer::log('[run] Run was executed on the project');
        
        return $this->renderJson(
            afStudioCommand::process('project', 'run')->query(sfContext::getInstance()->getController()->genUrl('@homepage'))->asArray()
        );
    }
	
	/**
	 * Create project feature
	 * 
	 * @param sfWebRequest $request
	 * @return string - json
	 * @author Radu Topala
	 * @author Sergey Startsev
	 */
	public function executeCreateProject(sfWebRequest $request)
	{
        return $this->renderJson(
            afStudioCommand::process('project', $request->getParameter('cmd'), $request->getParameterHolder()->getAll())->asArray()
        );
	}
	
	/**
	 * Checking database in create project wizard
	 *
	 * @param sfWebRequest $request 
	 * @return string - json
	 * @author Sergey Startsev
	 */
	public function executeCreateProjectWizardCheckDatabase(sfWebRequest $request)
	{
        return $this->renderJson(
            afStudioCommand::process('project', 'checkDatabase', $request->getParameterHolder()->getAll())->asArray()
        );
	}
	
	/**
	 * Create project wizard
	 *
	 * @param sfWebRequest $request 
	 * @return string - json
	 * @author Radu Topala
	 * @author Sergey Startsev
	 */
	public function executeCreateProjectWizard(sfWebRequest $request)
	{        
        return $this->renderJson(
            afStudioCommand::process('project', 'saveWizard', $request->getParameterHolder()->getAll())->asArray()
        );
	}
	
	/**
	 * Welcome page functionality
	 *
	 * @param sfWebRequest $request 
	 * @return string - json
	 */
    public function executeWelcome(sfWebRequest $request)
    {
        $data = array();
        try {
            $vimeoService = new VimeoInstanceService();
            $data = $vimeoService->getDataFromRemoteServer();
        } catch (Exception $e) {
            if (sfConfig::get('sf_environment') == 'dev') throw $e;
        }
        
        return $this->renderJson(
            afResponseHelper::create()->success(true)->data(array(), $this->getPartial('welcome', array('data' => $data)), 0)->asArray()
        );
	}
	
}
