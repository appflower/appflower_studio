<?php
/**
 * This module resolves problems regarded Same Origin security policy <http://en.wikipedia.org/wiki/Same_origin_policy>
 * The best way I know to handle this is to proxy ajax calls to other than studio domains
 *
 * @author     Lukasz Wojciechowski
 */
class afsProjectProxyActions extends sfActions
{
    function executeProcessRequest(sfWebRequest $request)
    {
//        FirePHP::getInstance(true)->fb($request->getParameterHolder()->getAll());
        $project = ProjectConfiguration::getActive()->getCurrentProject();
        $baseUrl = $project->getBaseUrl();
//        FirePHP::getInstance(true)->fb("project baseUrl: $baseUrl");
        $browser = new sfWebBrowser(array(),'sfCurlAdapter');
        $loginUrl = "{$baseUrl}login";
        $browser->post($loginUrl, array('signin[username]' => 'admin','signin[password]' => 'admin'));
//        FirePHP::getInstance(true)->fb("responseText: ".$browser->getResponseText());
        $params = $request->getParameterHolder()->getAll();
        unset($params['module']);
        unset($params['action']);
        unset($params['project_slug']);
        $module = $request->getParameter('requested_module');
        $action = $request->getParameter('requested_action');
        unset($params['requested_module']);
        unset($params['requested_action']);
        FirePHP::getInstance(true)->fb('params after some clearing: ');
        FirePHP::getInstance(true)->fb($params);
        $requestURL = "{$baseUrl}{$module}/{$action}";
        if ($request->isMethod('post')) {
            $browser->post($requestURL, $params);
        } else {
            $browser->get($requestURL, $params);
        }
        $responseText = $browser->getResponseText();
        FirePHP::getInstance(true)->fb("processed request responseText: $responseText");

        return $this->renderText($responseText);
    }
}