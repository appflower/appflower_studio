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
     * XML page definition
     */
    private $definition;
    
    /**
     * Message for information, for example validation error message
     */
    private $message;
    
    /**
     * Page serialization options 
     */
    private $page_serialize_options = array(
        'rootName' => 'i:view',
        'attributesArray' => 'attributes',
        'indent' => '    ',
        'mode' => 'simplexml',
        'addDecl' => true,
        'encoding' => 'UTF-8'
    );
    
    /**
     * Page unserialization options
     */
    private $page_unserialize_options = array(
        'parseAttributes' => true,
        'attributesArray' => 'attributes',
        'mode' => 'simplexml',
        'complexType' => 'array'
    );
    
    /**
     * Getting tree list controller
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
     */
    protected function processGet()
    {
        $page_file = $this->getParameter('page');
        $page_name = pathinfo($page_file, PATHINFO_FILENAME);
        
        $page = afsPageModelHelper::retrieve($page_name);
        
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
     * Getting widget information
     */
    protected function processGetWidget()
    {
        // Getting needed parameters - module and action
        $sModule = $this->getParameter('module');
        $sAction = $this->getParameter('action');
        
        $afCU = new afConfigUtils($sModule);
        $sPath = $afCU->getConfigFilePath("{$sAction}.xml");
        
        $afResponse = afResponseHelper::create();
        
        if (file_exists($sPath)) {
            $unserializer = new XML_Unserializer($this->page_unserialize_options);
            $status = $unserializer->unserialize($sPath, true);
    
            if ($status) {
                $definition = $unserializer->getUnserializedData();
                $afResponse->success(true)->content($definition);
            } else {
                $afResponse->success(false)->content("Can't parse widget");
            }
        } else {
            $afResponse->success(false)->content("Widget doesn't exists");
        }
        
        return $afResponse->asArray();
    }
    
    /**
     * Getting widget list action
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
     * Rename page processing
     */
    protected function processRename()
    {
        $sApplication = $this->getParameter('app');
        $sPage = $this->getParameter('page');
        $sName = $this->getParameter('name');
        
        $module = $this->getParameter('module', 'pages');
        
        $root_dir = sfConfig::get('sf_root_dir');
        $sPagesPath = "{$root_dir}/apps/{$sApplication}/config/pages/";
        
        $sPath = $sPagesPath . $sPage;
        
        $afResponse = afResponseHelper::create();
        
        if (file_exists($sPath)) {
            if (!file_exists($sPagesPath . $sName)) {
                
                $bRenamed = @rename($sPath, $sPagesPath . $sName);
                if ($bRenamed) {
                    // rename action 
                    afStudioModuleCommandHelper::renameAction( 
                        pathinfo($sPage, PATHINFO_FILENAME), 
            		    pathinfo($sName, PATHINFO_FILENAME), 
            		    $module,
            		    $sApplication, 
            		    'app'
                    );
                    
                    $afResponse->success(true)->content("Page has been successfully renamed");
                } else {
                    $afResponse->success(false)->content("Some probmlems appear when rename processing");
                }
            } else {
                $afResponse->success(false)->content("Page with new name already exists");
            }
        } else {
            $afResponse->success(false)->content("Page doesn't exists");
        }
        
        return $afResponse->asArray();
    }
    
    /**
     * Rename page processing
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
	 * Getting Widgets list 
	 *
	 * @param string $name
	 * @param string $type
	 * @return array
	 */
	private function getWidgets($name, $type = 'apps')
	{
		$data = array();
        
		$root_dir = sfConfig::get('sf_root_dir');
		
		$modules = afStudioUtil::getDirectories("{$root_dir}/{$type}/{$name}/modules/", true);
		
		if (!empty($modules)) {
            $aParams = array();

    		foreach($modules as &$module) {
                $aParams[$module] = array(
                    'xml_paths' => afStudioUtil::getFiles("{$root_dir}/{$type}/{$name}/modules/{$module}/config/", false, "xml"),
                    'xml_names' => afStudioUtil::getFiles("{$root_dir}/{$type}/{$name}/modules/{$module}/config/", true, "xml"),
                    'security_path' => "{$root_dir}/{$type}/{$name}/modules/{$module}/config/security.yml",
                    'action_path' => $actionPath = "{$root_dir}/{$type}/{$name}/modules/{$module}/actions/actions.class.php"
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
     */
    private function getPagesList()
    {
        $sRealRoot = afStudioUtil::getRootDir();
        
        $data = array();
        $apps = afStudioUtil::getDirectories($sRealRoot . "/apps/", true);
        
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
    
    /**
     * Page validation method, using XML validator
     * 
     * Might be in future we should do some refactoring in XmlValidator class, 
     * and this method will be a little bit rewritten too 
     * 
     * @return boolean
     */
    private function validate()
    {
        $tempPath = tempnam(sys_get_temp_dir(), 'studio_la_lb').'.xml';
        
        afStudioUtil::writeFile($tempPath, $this->definition);
        
        // Needs to validator clear cache
        afStudioConsole::getInstance()->execute('sf appflower:validator-cache frontend cache yes');

        $validator = new XmlValidator(null, false, true);
        $validator->readXmlDocument($tempPath, true);
        
        unlink($tempPath);
        
        $aValidate = $validator->validateXmlDocument(true);
        
        if ($aValidate[0] == 'ERROR') {
            $this->message = trim($aValidate[1]->getMessage());
            $result = false;
        } else {
            $result = true;
        }
        
        return $result;
    }
    
    /**
     * Creating new action for page
     *
     * @param string $name 
     * @param string $application 
     * @param string $module 
     * @return afResponse
     * @author Sergey Startsev
     */
    private function createAction($name, $application, $module = 'pages')
    {
        $root_dir = afStudioUtil::getRootDir();
        $module_dir = "{$root_dir}/apps/{$application}/modules/{$module}";
        $action_dir = "{$module_dir}/actions";
        
        $response = afResponseHelper::create();
        
        if (file_exists($action_dir)) {
            $path = "{$action_dir}/{$name}Action.class.php";
            $definition = afStudioLayoutCommandTemplate::action($name);
            
            if (!file_exists($path)) {
                if (afStudioUtil::writeFile($path, $definition)) {
                    $response->success(true)->message("Action has been successfully created");
                } else {
                    $response->success(false)->message("Can't create action in '{$module}' module");
                }
            } else {
                $response->success(true)->message("Action for '{$name}' already exists");
            }
        } else {
            $response->success(false)->message("Directory for action doesn't exists in '{$application}/{$module}'");
        }
        
        return $response;
    }
    
}
