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
    public static function processGetList($aPageList)
    {
    	$tree = array();
        
        foreach ($aPageList as $app => $aPage) {
            
            $treeNode['text'] = $app;
            $treeNode['type'] = 'app';
            
            if (count($aPage) > 0) {
                foreach ($aPage as $page) {
                    $treeNode['children'][] = array(
                        'text' => $page['text'],
                    	'iconCls' => 'icon-layout',
                        'xmlPath' => $page['xmlPath'],
                        'leaf' => true,
                    	'type' => 'page'
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
    
    /**
     * Prepare modules list for output
     *
     * @param array $modules
     * @return array
     */
    public static function processGetModulesList($modules, $name, $type)
    {
        $data = array();
        
        foreach ($modules as $module) {
            $data[] = array(
                'value' => $module,
                'text' => $module,
                'group' => $name,
                'type' => $type
            );
        }
        
        return $data;
    }
    
    /**
     * Prepare widgets list for output
     *
     * @param array $aWidgets
     * @return array
     */
    public static function processGetWidgetList($aWidgets)
    {
        $aExtWidgets = array();
        
    	foreach ($aWidgets as $i => $name) {
    		$aExtWidgets[] = array(
                'id' => $i, 
                'name' => strstr($name, '.xml', true)
            );
		}
		
		return $aExtWidgets;
    }
    
}

