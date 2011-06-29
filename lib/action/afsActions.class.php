<?php
/**
 * Action for studio 
 *
 * @package     appFlowerStudio
 * @subpackage  plugin
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsActions extends sfActions
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
     * Returns data encoded in json format,
     * adds json content-type header to the response.
     *
     * @param mixed @data
     * @return string - json format
     */
    protected function renderJson($data)
    {
	    $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
	    
		return $this->renderText(json_encode($data));
    }
    
}
