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
     * @author Sergey Startsev
     */
    protected function processGetList()
    {
    	$tree = afStudioLayoutCommandHelper::processGetList($this->getPagesList());
        
        if (count($tree) > 0) {
            $this->result = $tree;
        } else {
            $this->result = array('success' => true);
        }
        
    }
    
    /**
     * Getting needed page definition
     *
     * @author Sergey Startsev
     */
    protected function processGet()
    {
        $page_file = $this->getParameter('page');
        $page_name = pathinfo($page_file, PATHINFO_FILENAME);
        $application = $this->getParameter('app');
        
        $page = afsPageModelHelper::retrieve($page_name, $application);
        
        $response = afResponseHelper::create();
        if (!$page->isNew()) {
            $response->success(true)->content($page->getDefinition());
        } else {
            $response->success(false)->content("Page <b>{$page_name}</b> doesn't exists");
        }
        
        return $response->asArray();
    }
    
    /**
     * Saving changed page information
     *
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
        
        $page->setTitle($this->getParameter('title'));
        $page->setDefinition($definition);
        
        $saveResponse = $page->save();
        
        $response = afResponseHelper::create();
        if ($saveResponse->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            
            $console = afStudioConsole::getInstance()->execute(array(
                "sf appflower:portal-state-cc {$idXml}",
                "sf appflower:validator-cache frontend cache yes"
            ));
            
            $response
                ->success(true)
                ->content((!$is_new) ? sprintf('Page <b>%s</b> has been saved', $page_name) : sprintf('Page <b>%s</b> has been created', $page_name))
                ->console($console);
        } else {
            $response->success(false);
            if ($saveResponse->hasParameter(afResponseMessageDecorator::IDENTIFICATOR)) {
                $response->content($saveResponse->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
            }
        }
        
        return $response->asArray();
    }
    
    /**
     * Rename page processing
     *
     * @return array
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
		
		if (!$page->isNew()) {
		    $response = $page->rename($new_page_name);
		    if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
		        $response->console(afStudioConsole::getInstance()->execute('sf cc'));
		    }
		    
		    if ($response->hasParameter(afResponseMessageDecorator::IDENTIFICATOR)) {
		        $response->content($response->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
		    }
		} else {
		    $response = afResponseHelper::create()->success(false)->content("Can't retrieve page");
		}
		
		return $response->asArray();
    }
    
    /**
     * Rename page processing
     *
     * @author Sergey Startsev
     */
    protected function processDelete()
    {
        $application = $this->getParameter('app');
        $page_name = pathinfo($this->getParameter('page'), PATHINFO_FILENAME);
        
        $page = afsPageModelHelper::retrieve($page_name, $application);
        
		if (!$page->isNew()) {
		    $response = $page->delete();
		    if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
		        $response->console(afStudioConsole::getInstance()->execute('sf cc'));
		    }
		} else {
		    $response = afResponseHelper::create()->success(false)->message("Page <b>{$page_name}</b> doesn't exists");
		}
        
        return $response->asArray();
    }
    
    /**
     * Getting widget list action
     *
     * @author Sergey Startsev
     */
    protected function processGetWidgetList()
    {
        $aData = array();
        
        $root_dir = sfConfig::get('sf_root_dir');
        
        $aTypes = array('apps', 'plugins');
        
        foreach ($aTypes as $type) {
    		$aParents = afStudioUtil::getDirectories("{$root_dir}/{$type}/", true);
    							
    		foreach($aParents as $parent) {
    		    $aWidgets = $this->getWidgets($parent, $type);
    		    if (!empty($aWidgets)) {
    		        $aData[] = $aWidgets;
    		    }
    		}
        }        
        
        $this->result = $aData;
    }
    
	/**
	 * Getting Widgets list 
	 *
	 * @param string $name
	 * @param string $type
	 * @return array
	 * @author Sergey Startsev
	 */
	private function getWidgets($name, $type = 'apps')
	{
		$data = array();
        
		$root_dir = sfConfig::get('sf_root_dir');
		$modules_dir = "{$root_dir}/{$type}/{$name}/modules";
		
		$modules = afStudioUtil::getDirectories($modules_dir, true);
		
		if (!empty($modules)) {
            $aParams = array();
            
    		foreach($modules as &$module) {
                $aParams[$module] = array(
                    'xml_paths' => afStudioUtil::getFiles("{$modules_dir}/{$module}/config/", false, "xml"),
                    'xml_names' => afStudioUtil::getFiles("{$modules_dir}/{$module}/config/", true, "xml"),
                    'security_path' => "{$modules_dir}/{$module}/config/security.yml",
                    'action_path' => $actionPath = "{$modules_dir}/{$module}/actions/actions.class.php"
                );
    		}
    		
    		$data = afStudioLayoutCommandHelper::processGetWidgetList($modules, $aParams, $name, $type);
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
                        'xmlPath' => $xmlPaths[$xk]
                    );
                }
            }
        }
        
        return $data;
    }
    
}
