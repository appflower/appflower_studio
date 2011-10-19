<?php
/**
 * This module provides backend functionality for Module manage
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsModuleManagerActions extends afsActions
{
    /**
     * Getting modules list action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetList(sfWebRequest $request)
    {
        return $this->renderJson(
            afStudioCommand::process('module', 'getList')->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA)
        );
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
        
        return $this->renderJson(
            afStudioCommand::process('module', 'add', $parameters)->asArray()
        );
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
        
        return $this->renderJson(
            afStudioCommand::process('module', 'delete', $parameters)->asArray()
        );
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
        
        return $this->renderJson(
            afStudioCommand::process('widget', 'rename', $parameters)->asArray()
        );
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
        
        return $this->renderJson(
            afStudioCommand::process('widget', 'delete', $parameters)->asArray()
        );
    }
    
}
