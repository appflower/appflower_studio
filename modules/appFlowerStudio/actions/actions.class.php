<?php

use AppFlower\Studio\Filesystem\Permissions;
use AppFlower\Studio\Integrity\Integrity as Integrity;
use AppFlower\Studio\Integrity\Rule\Config as IntegrityConfig;

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
        $this->setTemplate(sfConfig::get('app_afs_debug') ? 'devStudio' : 'prodStudio');
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
        
        if ($request->getParameter('cmd') == 'upload') return $this->renderText($response->asJson());
        
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
        $params = $request->getParameterHolder()->getAll();
        $files = $request->getFiles();
        
        if(!empty($files) && array_key_exists('file', $files)) {
        	$params["name"] = $files["file"]["name"];
        	$params["tmp"] = $files["file"]["tmp_name"];
        	$params["code"] = $files["file"]["error"];
        } 
        
        $response = afStudioCommand::process('model', $command, $params);
        
        if ($command == 'get') {
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
            }
        }
        
        if ($command == 'export') {
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                $data = $response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA);
                
                $file_path = $data;
                $file_name = pathinfo($file_path, PATHINFO_BASENAME);
                
                $response = $this->getContext()->getResponse();
                $response->clearHttpHeaders();
                $response->addCacheControlHttpHeader('Cache-control', 'must-revalidate, post-check=0, pre-check=0');
                $response->setContentType('application/octet-stream', true);
                $response->setHttpHeader('Content-Transfer-Encoding', 'binary', true);
                $response->setHttpHeader('Content-Disposition', "attachment; filename={$file_name}", true);
                $response->sendHttpHeaders();
                
                readfile("{$file_path}");
                
                return sfView::NONE;
            }
        }
        
        if ($command == 'import') return $this->renderText($response->asJson());
        
        if (sfConfig::get('app_afs_check_integrity', true)) {
            $integrity = Integrity::create()->check(
                IntegrityConfig\Config::create()->add(IntegrityConfig\Crumb::create('Model'))
            );
            
            if ($integrity->isImpaired()) {
                $response->integrity($integrity->render());
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
        $permissions = new Permissions();

        $are_readable = $permissions->areReadable(array(
            sfConfig::get('sf_root_dir').'/log/afsPermissions.log',
            sfConfig::get('sf_root_dir').'/log/frontend_dev.log',
        ));

        if ($are_readable !== true) {
            echo $are_readable;
            die;
        }

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
            afStudioCommand::process('notification', $request->getParameter('cmd'), $request->getParameterHolder()->getAll())->asArray()
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
        $command = $request->getParameter('cmd');
        $response = afStudioCommand::process('layout', $command, $request->getParameterHolder()->getAll());
        
        if ($command == 'getList') {
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
            }
        }
        
        return $this->renderJson($response->asArray());
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
        $permissions = new Permissions();

        $are_writable = $permissions->areWritable(array(
            sfConfig::get('sf_root_dir').'/config/databases.yml',
            sfConfig::get('sf_root_dir').'/config/project.yml',
        ));

        if ($are_writable !== true) {
            echo $are_writable;
            die;
        }

        $pcm = new ProjectConfigurationManager($request);
        
        return $this->renderText($pcm->build());
    }
    
    /**
     * Execute project functionality
     *
     * @param sfWebRequest $request 
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeProject(sfWebRequest $request)
    {
        $command = $request->getParameter('cmd');
        
        if (!sfConfig::get('app_afs_projects_management_enabled') && in_array($command, array('saveWizard', 'CheckConfig'))) {
            //If projects management is disabled we allow only run and export, and helper processing commands
            throw new Exception('Projects management is disabled!');
        }
        
        $response = afStudioCommand::process('project', $command, $request->getParameterHolder()->getAll());
        
        if ($command == 'run') {
            afsNotificationPeer::log('[run] Run was executed on the project');
            $response->query(sfContext::getInstance()->getController()->genUrl('@homepage'));
        }
        
        if ($command == 'get') {
            if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
            }
        }
        
        if ($command == 'uploadWallpaper') return $this->renderText($response->asJson());
        
        return $this->renderJson($response->asArray());
    }
    
    /**
     * Export project call
     *
     * @param sfWebRequest $request 
     * @return mixed
     * @author Sergey Startsev
     */
    public function executeExport(sfWebRequest $request)
    {
        $response = afStudioCommand::process('project', 'export', $request->getParameterHolder()->getAll());
        
        if (!$response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            return $this->renderText($response->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
        }
        
        $data = $response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA);
        $file_name = $data['file'];
        $file_path = $data['path'];
        
        $response = $this->getContext()->getResponse();
        $response->clearHttpHeaders();
        $response->addCacheControlHttpHeader('Cache-control', 'must-revalidate, post-check=0, pre-check=0');
        $response->setContentType('application/octet-stream', true);
        $response->setHttpHeader('Content-Transfer-Encoding', 'binary', true);
        $response->setHttpHeader('Content-Disposition', "attachment; filename={$file_name}", true);
        $response->sendHttpHeaders();
        
        readfile("{$file_path}{$file_name}");
        
        return sfView::NONE;
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
    
    /**
     * Preview action 
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executePreview(sfWebRequest $request) {}
    
}
