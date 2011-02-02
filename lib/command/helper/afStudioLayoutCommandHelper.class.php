<?php
/**
 * Studio Layout Command Helper class 
 * 
 * @author startsev.sergey@gmail.com
 */
class afStudioLayoutCommandHelper
{
    
    /**
     * Returns ExtJS data 
     * @return array the tree structure
     */
    public static function processGet($aPageList)
    {
    	$tree = array();
        
        foreach ($aPageList as $app => $aPage) {
            
            $treeNode['text'] = $app;
            $treeNode['type'] = 'app';
            
            if (count($aPage) > 0) {
                foreach ($aPage as $page) {
                    $treeNode['children'][] = array(
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
    	
    	return $tree;
    }
    
}

