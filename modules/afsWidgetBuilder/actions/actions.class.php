<?php
/**
 * This module provides backend functionality for WidgetBuilder component from JS code
 *
 * @package     appFlowerStudio
 * @subpackage  plugin
 * @author      luwo@appflower.com
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetBuilderActions extends afsActions
{
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
