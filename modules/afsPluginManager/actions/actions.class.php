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
        
        if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
        }
        
        return $this->renderJson($response->asArray());
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
        
        return $this->renderJson(
            afStudioCommand::process('plugin', 'rename', $parameters)->asArray()
        );
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
        
        return $this->renderJson(
            afStudioCommand::process('plugin', 'delete', $parameters)->asArray()
        );
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
        
        return $this->renderJson(
            afStudioCommand::process('plugin', 'add', $parameters)->asArray()
        );
    }
    
}
