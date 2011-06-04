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
            'app'   => $request->getParameter('app'),
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
            'app'   => $request->getParameter('app'),
            'name'  => $request->getParameter('name')
        );
        
        $response = afStudioCommand::process('module', 'delete', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Rename module action
     *
     * @param sfWebRequest $request 
     * @return void
     * @author Sergey Startsev
     */
    public function executeRename(sfWebRequest $request)
    {
        $parameters = array(
            'app'   => $request->getParameter('app'),
            'name'  => $request->getParameter('name'),
            'renamed'  => $request->getParameter('renamed'),
        );
        
        $response = afStudioCommand::process('module', 'rename', $parameters);
        
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
        $response = afStudioCommand::process('module', 'getGrouped');
        
        return $this->renderJson($response);
    }
    
}
