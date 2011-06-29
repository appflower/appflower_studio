<?php
/**
 * This module provides backend functionality for Plugins manage
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsPluginManagerActions extends afsActions
{
    /**
     * Getting plugins list controller
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetList(sfWebRequest $request)
    {
        $response = afStudioCommand::process('plugin', 'getList');

        return $this->renderJson($response['data']);
    }
    
    /**
     * Rename plugin action 
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeRename(sfWebRequest $request)
    {
        $parameters = array(
            'oldValue' => $request->getParameter('oldValue'),
            'newValue' => $request->getParameter('newValue')
        );
        
        $response = afStudioCommand::process('plugin', 'rename', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Delete plugin action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeDelete(sfWebRequest $request)
    {
        $parameters = array(
            'name' => $request->getParameter('name'),
        );
        
        $response = afStudioCommand::process('plugin', 'delete', $parameters);
        
        return $this->renderJson($response);
    }
    
    /**
     * Add new plugin action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeAdd(sfWebRequest $request)
    {
        $parameters = array(
            'name' => $request->getParameter('name')
        );
        
        $response = afStudioCommand::process('plugin', 'add', $parameters);
        
        return $this->renderJson($response);
    }
    
}

