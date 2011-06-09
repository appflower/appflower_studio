<?php
/**
 * This module provides backend functionality for Project manage
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsProjectManagerActions extends sfActions
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
     * Get tree action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetTree(sfWebRequest $request)
    {
        $parameters = array(
            'path' => $request->getParameter('path')
        );
        
        $response = afStudioCommand::process('project', 'getTree', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Checking is valid path
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeIsPathValid(sfWebRequest $request)
    {
        $parameters = array(
            'path' => $request->getParameter('path')
        );
        
        $response = afStudioCommand::process('project', 'isPathValid', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Saving project
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeSave(sfWebRequest $request)
    {
        $params = $request->getPostParameters();
        
        unset($params['latest']);
        unset($params['path']);
        
        $parameters = array(
            'params' => $request->getParameter('params'),
        );
        
        $response = afStudioCommand::process('project', 'save', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Checking database functionality
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeCheckDatabase(sfWebRequest $request)
    {
        $parameters = array(
            'form' => $request->getParameter('form'),
        );
        
        $response = afStudioCommand::process('project', 'checkDatabase', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Checking database functionality
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeSaveWizard(sfWebRequest $request)
    {
        $parameters = array(
            'userForm' => $request->getParameter('userForm'),
            'databaseForm' => $request->getParameter('databaseForm'),
            'databaseExist' => $request->getParameter('databaseExist'),
            'name' => $request->getParameter('name'),
            'template' => $request->getParameter('template'),
            'path' => $request->getParameter('path'),
        );
        
        $response = afStudioCommand::process('project', 'saveWizard', $parameters);
        
        return $this->renderJson($response);
    }
    
}
