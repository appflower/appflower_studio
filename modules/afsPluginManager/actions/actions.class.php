<?php
/**
 * This module provides backend functionality for Plugins manage
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsPluginManagerActions extends sfActions
{
    /**
     * Catching executing ajax queries from direct call
     */
    public function preExecute()
    {
        if (!$this->getRequest()->isXmlHttpRequest()) {
            // $this->forward404("This action should be used only for ajax requests");
        }
    }

    /**
     * Rendering json
     *
     * @param mixed $result 
     * @return string
     * @author Sergey Startsev
     */
    protected function renderJson($result)
    {
        $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
        
        return $this->renderText(json_encode($result));
    }

    /**
     * Getting plugins list controller
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetList(sfWebRequest $request)
    {
        $response = afStudioCommand::process('plugin', 'getList');

        return $this->renderJson($response);
    }
    
    /**
     * Rename plugin action 
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeRenamePlugin(sfWebRequest $request)
    {
        $parameters = array(
            'oldValue' => $request->getParameter('oldValue'),
            'newValue' => $request->getParameter('newValue')
        );
        
        $response = afStudioCommand::process('plugin', 'renamePlugin', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Delete plugin action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeDeletePLugin(sfWebRequest $request)
    {
        $parameters = array(
            'name' => $request->getParameter('name'),
        );
        
        $response = afStudioCommand::process('plugin', 'deletePlugin', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Rename module
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeRenameModule(sfWebRequest $request)
    {
		$parameters = array(
            'oldValue' => $request->getParameter('oldValue'),
            'newValue' => $request->getParameter('newValue'),
            'pluginName' => $request->getParameter('pluginName')
        );
        
        $response = afStudioCommand::process('plugin', 'renameModule', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Delete module
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeDeleteModule(sfWebRequest $request)
    {
        $parameters = array(
            'oldValue' => $request->getParameter('oldValue'),
            'newValue' => $request->getParameter('newValue')
        );
        
        $response = afStudioCommand::process('plugin', 'deleteModule', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Rename xml
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeRenameXml(sfWebRequest $request)
    {
		$parameters = array(
            'oldValue' => $request->getParameter('oldValue'),
            'newValue' => $request->getParameter('newValue'),
            'pluginName' => $request->getParameter('pluginName'),
            'moduleName' => $request->getParameter('moduleName')
        );
        
        $response = afStudioCommand::process('plugin', 'renameXml', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Delete xml
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeDeleteXml(sfWebRequest $request)
    {
		$parameters = array(
            'pluginName' => $request->getParameter('pluginName'),
            'moduleName' => $request->getParameter('moduleName'),
            'xmlName' => $request->getParameter('xmlName')
        );
        
        $response = afStudioCommand::process('plugin', 'deleteXml', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Add new plugin action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeAddPlugin(sfWebRequest $request)
    {
        $parameters = array(
            'name' => $request->getParameter('name')
        );
        
        $response = afStudioCommand::process('plugin', 'addPlugin', $parameters);
        
        return $this->renderJson($response);
    }
    
}

