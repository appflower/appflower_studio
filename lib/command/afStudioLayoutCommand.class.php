<?php
/**
 * afStudioLayout Command
 *
 * @author startsev.sergey@gmail.com
 */
class afStudioLayoutCommand extends afBaseStudioCommand
{
	
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
        $root_dir = sfConfig::get('sf_root_dir');
        $sPath = "{$root_dir}/apps/{$this->getParameter('app')}/config/pages/{$this->getParameter('page')}";
        
        if (file_exists($sPath)) {
            $unserializer = new XML_Unserializer($this->page_unserialize_options);
            $status = $unserializer->unserialize($sPath, true);
    
            if ($status) {
                $definition = $unserializer->getUnserializedData();
                $return = $this->fetchSuccess($definition);
            } else {
                $return = $this->fetchError("Can't parse page");
            }
        } else {
            $return = $this->fetchError("Page doesn't exists");
        }
        
        $this->result = $return;
    }
    
    /**
     * Saving changed page information
     */
    protected function processSave()
    {
        // Getting needed parameters - page, application name, and sure definition
        $sPage = $this->getParameter('page');
        $sApplication = $this->getParameter('app');
        $aDefinition = $this->getParameter('definition');
        
        //idXml is stored inside the portal_state table from appFlowerPlugin
        $idXml = 'pages/'.str_replace('.xml','',basename($sPage));
        
        $bNew = $this->getParameter('is_new');
        
        if ($bNew) {
            $aDefinition = $this->getNewDefitinition($this->getParameter('title'));
        }
        
        $root_dir = sfConfig::get('sf_root_dir');
        $sPath = "{$root_dir}/apps/{$sApplication}/config/pages/{$sPage}";
        
        // Needs to define/initialize xml serialize constants
        $oXmlUtil = new XML_Util;
        
        $serializer = new XML_Serializer($this->page_serialize_options);
        $status = $serializer->serialize($aDefinition);
        
        if ($status) {
            $return = $serializer->getSerializedData();
            
            $this->definition = $serializer->getSerializedData();
            
            //todo: [radu] validate() is not working as expected !
            //if ($this->validate()) {
                // Save changes
                file_put_contents($sPath, $this->definition);
                @chmod($sPath, 0755);
                
                $message = (!$bNew) ? 'Page has been changed' : 'Page has been created';
                                
                $console = afStudioConsole::getInstance()->execute(array('sf appflower:portal-state-cc '.$idXml,'afs fix-perms','sf appflower:validator-cache frontend cache yes'));
                $return = $this->fetchSuccess($message, $console);
            //} else {
                // Getting error message from validation results, from $this->message
                //$return = $this->fetchError($this->message);
            //}
        } else {
            $return = $this->fetchError('Some errors has beed found');
        }
        
        $this->result = $return;
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
        
        if (file_exists($sPath)) {
            $unserializer = new XML_Unserializer($this->page_unserialize_options);
            $status = $unserializer->unserialize($sPath, true);
    
            if ($status) {
                $definition = $unserializer->getUnserializedData();
                $return = $this->fetchSuccess($definition);
            } else {
                $return = $this->fetchError("Can't parse widget");
            }
        } else {
            $return = $this->fetchError("Widget doesn't exists");
        }
        
        $this->result = $return;
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
        
        $root_dir = sfConfig::get('sf_root_dir');
        $sPagesPath = "{$root_dir}/apps/{$sApplication}/config/pages/";
        
        $sPath = $sPagesPath . $sPage;
        
        if (file_exists($sPath)) {
            if (!file_exists($sPagesPath . $sName)) {
                
                $bRenamed = rename($sPath, $sPagesPath . $sName);
                if ($bRenamed) {
                    $return = $this->fetchSuccess("Page has successfully renamed");
                } else {
                    $return = $this->fetchError("Some probmlems appear when rename processing");
                }
            } else {
                $return = $this->fetchError("Page with new name already exists");
            }
        } else {
            $return = $this->fetchError("Page doesn't exists");
        }
        
        $this->result = $return;
        
    }
    
    /**
     * Rename page processing
     */
    protected function processDelete()
    {
        $sApplication = $this->getParameter('app');
        $sPage = $this->getParameter('page');
        
        $root_dir = sfConfig::get('sf_root_dir');
        $sPath = "{$root_dir}/apps/{$sApplication}/config/pages/{$sPage}";
        
        if (file_exists($sPath)) {
            $bDeleted = unlink($sPath);
            if ($bDeleted) {
                $return = $this->fetchSuccess("Page has successfully deleted");
            } else {
                $return = $this->fetchError("Some probmlems appear when delete processing");
            }
        } else {
            $return = $this->fetchError("Page doesn't exists");
        }
        
        $this->result = $return;
        
    }
    
    /**
     * Getting definition array for new page
     * 
     * @param string $title - Page title
     * @return array - definition array
     */
    private function getNewDefitinition($title)
    {
        $aDefinition = array(
            'attributes' => array(
                'type' => 'layout',
                'xmlns:i' => 'http://www.appflower.com/schema/',
                'xmlns:xsi' => 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:schemaLocation' => 'http://www.appflower.com/schema/appflower.xsd'
            ),
            'i:title' => $title,
            'i:area'  => array(
                'attributes' => array(
                    'layout' => 1, 
                    'type'   => 'content'
                )
            )
        );
        
        return $aDefinition;
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
        
        file_put_contents($tempPath, $this->definition);
        
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
    
}
