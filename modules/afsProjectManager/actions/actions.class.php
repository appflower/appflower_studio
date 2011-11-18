<?php
/**
 * This module provides backend functionality for Project manage
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsProjectManagerActions extends afsActions
{
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
    public function executeSaveWizard(sfWebRequest $request)
    {
        $parameters = array(
            'userForm' => $request->getParameter('userForm'),
            'name' => $request->getParameter('name'),
            'template' => $request->getParameter('template'),
            'path' => $request->getParameter('path'),
        );
        
        $response = afStudioCommand::process('project', 'saveWizard', $parameters);
        
        return $this->renderJson($response);
    }
    
}
