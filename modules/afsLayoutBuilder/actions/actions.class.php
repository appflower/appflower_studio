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

        $response = afStudioCommand::process('layout', 'get', $parameters);

        return $this->renderJson($response);
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

        $response = afStudioCommand::process('layout', 'save', $parameters);

        return $this->renderJson($response);
    }
    
    /**
     * Getting widget info
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetWidget(sfWebRequest $request)
    {
        /*
            TODO separate 'uri' request to 2 params, module, and action.
        */
        $parameters = array(
            'uri' => $request->getParameter('module_name') . "/" . $request->getParameter('action_name'),
            'place' => 'frontend',
            'placeType' => 'app'
        );
        
        $response = afStudioCommand::process('widget', 'get', $parameters);
        
        return $this->renderJson($response);
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

        return $this->renderJson($response);
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

        $response = afStudioCommand::process('layout', 'save', $parameters);

        return $this->renderJson($response);
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

        $response = afStudioCommand::process('layout', 'rename', $parameters);

        return $this->renderJson($response);
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

        $response = afStudioCommand::process('layout', 'delete', $parameters);

        return $this->renderJson($response);
    }

}
