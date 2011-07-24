<?php
/**
 * This module provides backend functionality for Module manage
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsModuleManagerActions extends sfActions
{
    /**
     * Catching executing ajax queries from direct call
     */
    public function preExecute()
    {
        if (!$this->getRequest()->isXmlHttpRequest()) {
            $this->forward404("This action should be used only for ajax requests");
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
     * Getting modules list action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetList(sfWebRequest $request)
    {
        $response = afStudioCommand::process('module', 'getList');

        return $this->renderJson($response);
    }
    
    /**
     * Add module action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeAdd(sfWebRequest $request)
    {
        $parameters = array(
            'type'  => $request->getParameter('type', 'app'),
            'place' => $request->getParameter('place'),
            'name'  => $request->getParameter('name')
        );
        
        $response = afStudioCommand::process('module', 'add', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Delete module action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeDelete(sfWebRequest $request)
    {
        $parameters = array(
            'type'  => $request->getParameter('type', 'app'),
            'place' => $request->getParameter('place'),
            'name'  => $request->getParameter('name')
        );
        
        $response = afStudioCommand::process('module', 'delete', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Rename module action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeRename(sfWebRequest $request)
    {
        $parameters = array(
            'type'  => $request->getParameter('type', 'app'),
            'place' => $request->getParameter('place'),
            'name'  => $request->getParameter('name'),
            'renamed'  => $request->getParameter('renamed')
        );
        
        $response = afStudioCommand::process('module', 'rename', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Set as homepage module action
     *
     * @param sfWebRequest $request 
     * @author Lukasz Wojciechowski
     */
    public function executeSetAsHomepage(sfWebRequest $request)
    {
        $parameters = array(
            'widgetUri'  => $request->getParameter('widgetUri'),
        );
        $response = afStudioCommand::process('module', 'setAsHomepage', $parameters);
        return $this->renderJson($response);
    }
    
    /**
     * Get grouped action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetGrouped(sfWebRequest $request)
    {
        $parameters = array(
            'type' => $request->getParameter('type')
        );
        
        $response = afStudioCommand::process('module', 'getGrouped', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Rename module view action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeRenameView(sfWebRequest $request)
    {
        $parameters = array(
            'type'      => $request->getParameter('type', 'app'),
            'place'     => $request->getParameter('place'),
            'module'    => $request->getParameter('moduleName'),
            'oldValue'  => $request->getParameter('oldValue'),
            'newValue'  => $request->getParameter('newValue'),
        );
        
        $response = afStudioCommand::process('widget', 'rename', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Delete module view action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeDeleteView(sfWebRequest $request)
    {
        $parameters = array(
            'type'      => $request->getParameter('type', 'app'),
            'place'     => $request->getParameter('place'),
            'module'    => $request->getParameter('moduleName'),
            'name'      => $request->getParameter('name'),
        );
        
        $response = afStudioCommand::process('widget', 'delete', $parameters);
        
        return $this->renderJson($response);
    }
    
}
