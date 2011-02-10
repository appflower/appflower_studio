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
    function executeGetWidget(sfWebRequest $request)
    {
        try {
            $afsWBW = new afsWidgetBuilderWidget($request->getParameter('uri'));
            $afsWBW->loadXml();

            return array(
                'success' => true,
                'data' => $afsWBW->getDefinitionAsJSON()
            );

        } catch( Exception $e ) {
            return array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
    }

    function executeSaveWidget(sfWebRequest $request)
    {
        try {
            $afsWBW = new afsWidgetBuilderWidget($request->getParameter('uri'));
            $data = $request->getParameter('data');
            $widgetType = $request->getParameter('widgetType');

            $afsWBW->setDefinitionFromJSON($data);
            $afsWBW->setWidgetType($widgetType);
            $validationStatusOrError = $afsWBW->save();

            if ($validationStatusOrError === true) {
                return array(
                    'success' => true,
                    'message' => 'Widget was saved succesfully'
                );
            } else {
                return array(
                    'success' => false,
                    'message' => $validationStatusOrError
                );
            }

        } catch( Exception $e ) {
            return array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
    }
}