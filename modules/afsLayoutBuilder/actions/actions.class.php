<?php
/**
 * This module provides backend functionality for Layout Builder
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsLayoutBuilderActions extends afsActions
{
    /**
     * Getting page definition controller
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGet(sfWebRequest $request)
    {
        // Prepare parameters for executing layout command
        $parameters = array(
            'app' => $request->getParameter('app', 'frontend'),
            'page' => $request->getParameter('page', ''),
        );
        
        return $this->renderJson(
            afStudioCommand::process('layout', 'get', $parameters)->asArray()
        );
    }
    
    /**
     * Saving changes in page definition
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeSave(sfWebRequest $request)
    {
        $parameters = array(
            'app' => $request->getParameter('app', 'frontend'),
            'page' => $request->getParameter('page', ''),
            'definition' => json_decode($request->getParameter('definition'), true)
        );
        
        return $this->renderJson(
            afStudioCommand::process('layout', 'save', $parameters)->asArray()
        );
    }
    
    /**
     * Getting widget info
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetWidget(sfWebRequest $request)
    {
        $action = $request->getParameter('action_name');
        $module = $request->getParameter('module_name');
        
        ($info = afsWidgetModelHelper::find($action, $module)) ? extract($info) : list($place, $placeType) = array('frontend', 'app');
        
        $parameters = array(
            'uri'   => "{$module}/{$action}",
            'place' => $request->getParameter('place', $place),
            'type'  => $request->getParameter('place_type', $placeType),
        );
        
        return $this->renderJson(
            afStudioCommand::process('widget', 'getInfo', $parameters)->asArray()
        );
    }
    
    /**
     * Get widget list
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetWidgetList(sfWebRequest $request)
    {
        $response = afStudioCommand::process('layout', 'getWidgetList');
        
        if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            return $this->renderJson($response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA));
        }
        
        return $this->renderJson($response->asArray());
    }
    
    /**
     * Create new page functionality
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeNew(sfWebRequest $request)
    {
        $parameters = array(
            'app' => $request->getParameter('app', 'frontend'),
            'page' => $request->getParameter('page'),
            'title' => $request->getParameter('title', $request->getParameter('page')),
            'is_new' => true
        );
        
        return $this->renderJson(
            afStudioCommand::process('layout', 'save', $parameters)->asArray()
        );
    }
    
    /**
     * Rename Page
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeRename(sfWebRequest $request)
    {
        $parameters = array(
            'app'   => $request->getParameter('app', 'frontend'),
            'page'  => $request->getParameter('page'),
            'name'  => $request->getParameter('name')
        );
        
        return $this->renderJson(
            afStudioCommand::process('layout', 'rename', $parameters)->asArray()
        );
    }
    
    /**
     * Delete Page functionality
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeDelete(sfWebRequest $request)
    {
        $parameters = array(
            'app'   => $request->getParameter('app', 'frontend'),
            'page'  => $request->getParameter('page')
        );
        
        return $this->renderJson(
            afStudioCommand::process('layout', 'delete', $parameters)->asArray()
        );
    }
    
}
