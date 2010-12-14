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

//            file_put_contents('/tmp/afGuardUserListWidgetJson', $afsWBW->getDefinitionAsJSON());

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
            $data = file_get_contents('/tmp/afGuardUserListWidgetJson');

            $afsWBW->setDefinitionFromJSON($data);
            $afsWBW->validateAndSaveXml();

            return array(
                'success' => true,
                'message' => 'Widget was saved succesfully'
            );

        } catch( Exception $e ) {
            return array(
                'success' => false,
                'message' => $e->getMessage()
            );
        }
    }
}