<?php
/**
 * This module provides backend functionality for LayoutBuilder
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     startsev.sergey@gmail.com
 */
class afsLayoutBuilderActions extends sfActions
{
    
    /**
     * Catching executing ajax queries from direct call
     */
    public function preExecute()
    {
        if (!$this->getRequest()->isXmlHttpRequest()) {
            $this->forward404("This action should be used only for ajax requests");
        }
    }
    
    /**
     * Rendering json
     */
    protected function renderJson($result)
    {
        $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
        return $this->renderText(json_encode($result));
    }
    
    /**
     * Getting page definition controller
     */
    public function executeGet(sfWebRequest $request)
    {
        // Prepare parameters for executing layout command
        $aParameters = array(
            'app' => $request->getParameter('app', 'frontend'),
            'page' => $request->getParameter('page', ''),
        );
        
        $aResponse = afStudioCommand::process('layout', 'get', $aParameters);
        
        return $this->renderJson($aResponse);
    }
    
    
}
