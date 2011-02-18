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
            $options = array(
                'parseAttributes' => true,
                'attributesArray' => 'attributes',
                'mode' => 'simplexml',
                'complexType' => 'array'
            );
    
            $unserializer = new XML_Unserializer($options);
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
        
        $root_dir = sfConfig::get('sf_root_dir');
        $sPath = "{$root_dir}/apps/{$this->getParameter('app')}/config/pages/{$this->getParameter('page')}";
        
        // Needs to define/initialize xml serialize constants
        $oXmlUtil = new XML_Util;
        
        // Defining options for Serializing
        $aOptions = array(
            'rootName' => 'i:view',
            'attributesArray' => 'attributes',
            'indent' => '    ',
            'mode' => 'simplexml',
            'addDecl' => true,
            'encoding' => 'UTF-8'
        );
        
        $serializer = new XML_Serializer($aOptions);
        $status = $serializer->serialize($aDefinition);
        
        if ($status) {
            $return = $serializer->getSerializedData();
            
            $this->definition = $serializer->getSerializedData();
            
            if ($this->validate()) {
                // Save changes
                file_put_contents($sPath, $this->definition);
                
                $return = $this->fetchSuccess('Page has been changed');
            } else {
                // Getting error message from validation results, from $this->message
                $return = $this->fetchError($this->message);
            }
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
            $options = array(
                'parseAttributes' => true,
                'attributesArray' => 'attributes',
                'mode' => 'simplexml',
                'complexType' => 'array'
            );
    
            $unserializer = new XML_Unserializer($options);
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
                        'xmlPath' => $xmlPaths[$xk],
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
