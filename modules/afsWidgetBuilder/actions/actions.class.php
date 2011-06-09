<?php
/**
 * This module provides backend functionality for WidgetBuilder component from JS code
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     luwo@appflower.com
 */
class afsWidgetBuilderActions extends sfActions
{

    /**
     * Returns data encoded in json format,
     * adds json content-type header to the response.
     *  
     * @param mixed $result
     */
    protected function renderJson($data)
    {
	    $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
		return $this->renderText(json_encode($data));
    }
    
    function executeGetWidget(sfWebRequest $request)
    {
        try {
            $afsWBW = new afsWidgetBuilderWidget($request->getParameter('uri'));
            $afsWBW->loadXml();

            $response = array(
                'success' => true,
                'data' => $afsWBW->getDefinition()
            );
            
        } catch( Exception $e ) {
            $response = array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
        
        return $this->renderJson($response);
    }

    function executeSaveWidget(sfWebRequest $request)
    {
        try {
            $afsWBW = new afsWidgetBuilderWidget($request->getParameter('uri'));
            $data = $request->getParameter('data');
            $widgetType = $request->getParameter('widgetType');
            $createNewWidget = ($request->getParameter('createNewWidget') == 'true' ? true : false);
            
            $afsWBW->setPlaceType($request->getParameter('placeType', 'app'));
            $afsWBW->setPlace($request->getParameter('place', 'frontend'));

            $afsWBW->setWidgetType($widgetType);
            $afsWBW->setDefinitionFromJSON($data, $createNewWidget);
            $validationStatusOrError = $afsWBW->save();

            if ($validationStatusOrError === true) {
                $response = array(
                    'success' => true,
                    'message' => $createNewWidget ? 'Widget was succesfully created' : 'Widget was succesfully saved',
                    'data'    => $afsWBW->getInfo()
                );
            } else {
                $response = array(
                    'success' => false,
                    'message' => $validationStatusOrError
                );
            }

        } catch( Exception $e ) {
            $response = array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
        
        return $this->renderJson($response);
    }
}