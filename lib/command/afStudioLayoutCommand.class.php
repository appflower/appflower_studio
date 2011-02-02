<?php
/**
 * afStudioLayout tree panel Command
 *
 * @author startsev.sergey@gmail.com
 */
class afStudioLayoutCommand extends afBaseStudioCommand
{
	
    /**
     * Getting tree list controller
     */
    protected function processGet()
    {
        $tree = array();
        
        $aPageList = $this->getPagesList();
        
        foreach ($aPageList as $app => $aPage) {
            
            $treeNode['text'] = $app;
            $treeNode['type'] = 'app';
            
            if (count($aPage) > 0) {
                foreach ($aPage as $page) {
                    $treeNode['children'][] = array(
                        'app' => $app,
                        'text' => $page['text'],
                        'xmlPath' => $page['xmlPath'],
                        'leaf' => true
                    );
                }
            } else {
                $treeNode['leaf'] = true;
                $treeNode['iconCls'] = 'icon-folder';
            }
            
            $tree[] = $treeNode;
        }
        
        if(count($tree) > 0) {
            $this->result = $tree;
        } else {
            $this->result = array('success' => true);
        }
        
    }
    
    /**
     * Getting pages list from applications 
     * 
     * @return array
     */
    protected function getPagesList()
    {
        $sRealRoot = afStudioUtil::getRootDir();
        
        $data = array();
        $apps = afStudioUtil::getDirectories($sRealRoot . "/apps/", true);
        
        foreach($apps as $app) {
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
