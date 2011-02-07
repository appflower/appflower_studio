<?php
/**
 * afStudioLayout Command
 *
 * @author startsev.sergey@gmail.com
 */
class afStudioLayoutCommand extends afBaseStudioCommand
{
	
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
            );
    
            $unserializer = new XML_Unserializer($options);
            $status = $unserializer->unserialize($sPath, true);
    
            if ($status) {
                $definition = $unserializer->getUnserializedData();
                
                $return = array(
                    'success' => true,
                    'page' => $definition
                );
            } else {
                $return = array(
                    'success' => false,
                    'message' => "Can't parse page"
                );
            }
        } else {
            $return = array(
                'success' => false,
                'message' => "File doesn't exists"
            );
        }
        
        $this->result = $return;
    }
    
    /**
     * Saving changed page information
     * 
     * @TODO: need to finish functionality
     */
    protected function processSave()
    {
        $oXmlUtil = new XML_Util;
        
        $options = array(
            'rootName' => 'i:view',
            'attributesArray' => 'attributes',
            'indent' => '    ',
            'mode' => 'simplexml',
            'addDecl' => true,
            'encoding' => 'UTF-8'
        );
        
        $serializer = new XML_Serializer($options);
        $result = $serializer->serialize($definition);
        
        $result = $serializer->getSerializedData();
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
    
}
