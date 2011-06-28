<?php
/**
 * This module provides backend functionality for WidgetBuilder component from JS code
 *
 * @package     appFlowerStudio
 * @subpackage  plugin
 * @author      luwo@appflower.com
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetBuilderActions extends sfActions
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
     * Returns data encoded in json format,
     * adds json content-type header to the response.
     *  
     * @param mixed $result
     */
    protected function renderJson($data)
    {
        // $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
	    
		return $this->renderText(json_encode($data));
    }
    
    /**
     * Getting Widget action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeGetWidget(sfWebRequest $request)
    {
        $parameters = array(
            'uri'       => $request->getParameter('uri'),
            'placeType' => $request->getParameter('placeType', 'app'),
            'place'     => $request->getParameter('place', 'frontend'),
        );

        $response = afStudioCommand::process('widget', 'get', $parameters);

        return $this->renderJson($response);
    }
    
    /**
     * Save widget action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeSaveWidget(sfWebRequest $request)
    {
        $parameters = array(
            'uri'               => $request->getParameter('uri'),
            'data'              => json_decode($request->getParameter('data'), true),
            'widgetType'        => $request->getParameter('widgetType'),
            'createNewWidget'   => $request->getParameter('createNewWidget'),
            'placeType'         => $request->getParameter('placeType', 'app'),
            'place'             => $request->getParameter('place', 'frontend'),
        );

        $response = afStudioCommand::process('widget', 'save', $parameters);

        return $this->renderJson($response);
    }
    
}
