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
    
    /**
     * Saving changes in page definition
     */
    public function executeSave(sfWebRequest $request)
    {
        $aParameters = array(
            'app' => $request->getParameter('app', 'frontend'),
            'page' => $request->getParameter('page', ''),
            'definition' => json_decode($request->getParameter('definition'), true)
        );
        
        $aResponse = afStudioCommand::process('layout', 'save', $aParameters);
        
        return $this->renderJson($aResponse);
    }
    
    /**
     * Getting widget info
     */
    public function executeGetWidget(sfWebRequest $request)
    {
        $aParameters = array(
            'module' => $request->getParameter('module_name'),
            'action' => $request->getParameter('action_name'),
        );
        
        $aResponse = afStudioCommand::process('layout', 'getWidget', $aParameters);
        
        $afCU = new afConfigUtils($aParameters['module']);
        $aResponse['meta'] = array(
            'actionPath' => $afCU->getActionFilePath('actions.class.php'),
            'xmlPath' => $afCU->getConfigFilePath("{$aParameters['action']}.xml"),
            'securityPath' => $afCU->getConfigFilePath("security.yml")
        );
        
        return $this->renderJson($aResponse);
    }
    
    /**
     * Get widget list
     */
    public function executeGetWidgetList(sfWebRequest $request)
    {
        $aResponse = afStudioCommand::process('layout', 'getWidgetList');
        
        return $this->renderJson($aResponse);
    }
    
}
