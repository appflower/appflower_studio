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
        /*
            TODO separate 'uri' request to 2 params, module, and action.
        */
        $parameters = array(
            'uri'       => $request->getParameter('uri'),
            'placeType' => $request->getParameter('placeType', 'app'),
            'place'     => $request->getParameter('place', 'frontend'),
        );
        
        return $this->renderJson(
            afStudioCommand::process('widget', 'get', $parameters)->asArray()
        );
    }
    
    /**
     * Save widget action
     *
     * @param sfWebRequest $request 
     * @author Sergey Startsev
     */
    public function executeSaveWidget(sfWebRequest $request)
    {
        /*
            TODO separate 'uri' request to 2 params, module, and action.
        */
        $parameters = array(
            'uri'               => $request->getParameter('uri'),
            'data'              => json_decode($request->getParameter('data'), true),
            'widgetType'        => $request->getParameter('widgetType'),
            'createNewWidget'   => $request->getParameter('createNewWidget'),
            'placeType'         => $request->getParameter('placeType', 'app'),
            'place'             => $request->getParameter('place', 'frontend'),
        );
        
        return $this->renderJson(
            afStudioCommand::process('widget', 'save', $parameters)->asArray()
        );
    }
    
    /**
     * Generate widget via model definition 
     *
     * @param sfWebRequest $request 
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeGenerateWidget(sfWebRequest $request)
    {
        return $this->renderJson(
            afStudioCommand::process('widget', 'generate', $request->getParameterHolder()->getAll())->asArray()
        );
    }
    
    public function executeGenerateAll(sfWebRequest $request)
    {
        return $this->renderJson(
            afStudioCommand::process('widget', 'generateAll', $request->getParameterHolder()->getAll())->asArray()
        );
    }
    
}
