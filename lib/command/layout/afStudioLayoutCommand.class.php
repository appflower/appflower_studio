<?php
/**
 * Layout command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioLayoutCommand extends afBaseStudioCommand
{
    /**
     * Default pages module
     */
    const PAGES_MODULE = 'pages';
    
    /**
     * Getting tree list controller
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGetList()
    {
        return afResponseHelper::create()->success(true)->data(array(), afStudioLayoutCommandHelper::processGetList($this->getPagesList()), 0);
    }
    
    /**
     * Getting needed page definition
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGet()
    {
        $page_file = $this->getParameter('page');
        $page_name = pathinfo($page_file, PATHINFO_FILENAME);
        $application = $this->getParameter('app');
        
        $page = afsPageModelHelper::retrieve($page_name, $application);
        
        if (!$page->isNew()) {
            return afResponseHelper::create()->success(true)->content($page->getDefinition());
        }
        
        return afResponseHelper::create()->success(false)->content("Page <b>{$page_name}</b> doesn't exists");
    }
    
    /**
     * Saving changed page information
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processSave()
    {
        // Getting needed parameters - page, application name, and sure definition
        $page_name = pathinfo($this->getParameter('page'), PATHINFO_FILENAME);
        
        $application = $this->getParameter('app');
        $definition = $this->getParameter('definition', array());
        
        $module = $this->getParameter('module', self::PAGES_MODULE);
        
        //idXml is stored inside the portal_state table from appFlowerPlugin
        $idXml = "pages/{$page_name}";
        
        $page = afsPageModelHelper::retrieve($page_name, $application);
        
        $is_new = $page->isNew();
        
        $page->setTitle(sfInflector::humanize(sfInflector::underscore($page_name)));
        $page->setDefinition($definition);
        
        $saveResponse = $page->save();
        
        $response = afResponseHelper::create();
        if ($saveResponse->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            
            $console = afStudioConsole::getInstance()->execute(array(
                "sf appflower:portal-state-cc {$idXml}",
                "sf appflower:validator-cache frontend cache yes",
                'sf afs:fix-perms',
            ));
            
            return $response
                ->success(true)
                ->content((!$is_new) ? sprintf('Page <b>%s</b> has been saved', $page_name) : sprintf('Page <b>%s</b> has been created', $page_name))
                ->console($console);
        }
        
        $response->success(false);
        if ($saveResponse->hasParameter(afResponseMessageDecorator::IDENTIFICATOR)) {
            $response->content($saveResponse->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
        }
        
        return $response;
    }
    
    /**
     * Rename page processing
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processRename()
    {
        // getting parameters
        $page_name      = $this->getParameter('page');
        $new_page_name  = $this->getParameter('name');
        $application    = $this->getParameter('app');
        
        $page_name = pathinfo($page_name, PATHINFO_FILENAME);
        $new_page_name = pathinfo($new_page_name, PATHINFO_FILENAME);
        
        $page = afsPageModelHelper::retrieve($page_name, $application);
        
        if ($page->isNew()) return afResponseHelper::create()->success(false)->content("Can't retrieve page");
            
        $response = $page->rename($new_page_name);
        if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            $response->console(afStudioConsole::getInstance()->execute('sf cc'));
        }
        
        if ($response->hasParameter(afResponseMessageDecorator::IDENTIFICATOR)) {
            $response->content($response->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
        }
        
        return $response;
    }
    
    /**
     * Rename page processing
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processDelete()
    {
        $application = $this->getParameter('app');
        $page_name = pathinfo($this->getParameter('page'), PATHINFO_FILENAME);
        
        $page = afsPageModelHelper::retrieve($page_name, $application);
        
        if ($page->isNew()) return afResponseHelper::create()->success(false)->message("Page <b>{$page_name}</b> doesn't exists");
        
        $response = $page->delete();
        if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            $response->console(afStudioConsole::getInstance()->execute('sf cc'));
        }
        
        return $response;
    }
    
    /**
     * Getting widget list action
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGetWidgetList()
    {
        $root_dir = sfConfig::get('sf_root_dir');
        
        $deprecated = afStudioPluginCommandHelper::getDeprecatedList();
        
        $data = array();
        foreach (array('app', 'plugin') as $type) {
            foreach(afStudioUtil::getDirectories("{$root_dir}/{$type}s/", true) as $parent) {
                if (in_array($parent, $deprecated)) continue;
                
                $widgets = $this->getWidgets($parent, $type);
                if (!empty($widgets)) $data[] = $widgets;
            }
        }        
        
        return afResponseHelper::create()->success(true)->data(array(), $data, 0);
    }
    
    /**
     * Set page as homepage functionality
     * 
     * @return afResponse
     * @author Radu Topala
     */
    protected function processSetAsHomepage()
    {
        $widgetUri  = $this->getParameter('widgetUri');
        $rm         = new RoutingConfigurationManager();
        
        if ($rm->setHomepageUrlFromWidgetUri($widgetUri)) {
            return afResponseHelper::create()->success(true)->message("Homepage for your project is now set to <b>{$widgetUri}</b>");
        }
        
        return afResponseHelper::create()->success(false)->message("Can't set <b>{$widgetUri}</b> as homepage. An error occured.");
    }
    
    /**
     * Getting Widgets list 
     *
     * @param string $name
     * @param string $type
     * @return array
     * @author Sergey Startsev
     */
    private function getWidgets($name, $type = 'app')
    {
        $root_dir = sfConfig::get('sf_root_dir');
        $modules_dir = "{$root_dir}/{$type}s/{$name}/modules";
        
        $modules = afStudioUtil::getDirectories($modules_dir, true);
        
        $data = array();
        if (!empty($modules)) {
            $params = array();
            
            foreach($modules as &$module) {
                $params[$module] = array(
                    'xml_paths' => afStudioUtil::getFiles("{$modules_dir}/{$module}/config/", false, "xml"),
                    'xml_names' => afStudioUtil::getFiles("{$modules_dir}/{$module}/config/", true, "xml"),
                    'security_path' => "{$modules_dir}/{$module}/config/security.yml",
                );
            }
            
            $data = afStudioLayoutCommandHelper::processGetWidgetList($modules, $params, $name, $type);
        }
        
        return $data;
    }
    
    /**
     * Getting pages list from applications 
     * 
     * @return array
     * @author Sergey Startsev
     */
    private function getPagesList()
    {
        $sRealRoot = afStudioUtil::getRootDir();
        
        $data = array();
        $apps = afStudioUtil::getDirectories("{$sRealRoot}/apps/", true);
        
        foreach ($apps as $app) {
            $xmlNames = afStudioUtil::getFiles($sRealRoot . "/apps/{$app}/config/pages/", true, 'xml');
            $xmlPaths = afStudioUtil::getFiles($sRealRoot . "/apps/{$app}/config/pages/", false, 'xml');
            
            if (count($xmlNames) > 0) {
                foreach ($xmlNames as $xk => $page) {
                    $data[$app][] = array(
                        'text' => $page,
                        'xmlPath' => $xmlPaths[$xk],
                        'widgetUri' => 'pages/' . str_replace('.xml', '', $page)
                    );
                }
            }
        }
        
        return $data;
    }
    
}
