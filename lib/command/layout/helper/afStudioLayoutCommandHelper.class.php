<?php
/**
 * Studio Layout Command Helper class 
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioLayoutCommandHelper
{
    /**
     * Returns ExtJS data 
     * 
     * @return array the tree structure
     * @author Sergey Startsev
     */
    public static function processGetList(Array $aPageList)
    {
        $tree = array();
        foreach ($aPageList as $app => $aPage) {
            
            $treeNode['text'] = $app;
            $treeNode['type'] = 'app';
            
            if (count($aPage) > 0) {
                foreach ($aPage as $page) {
                    $treeNode['children'][] = array(
                        'text'      => pathinfo($page['text'], PATHINFO_FILENAME),
                        'iconCls'   => 'icon-layout',
                        'xmlPath'   => $page['xmlPath'],
                        'widgetUri' => $page['widgetUri'],
                        'leaf'      => true,
                        'type'      => 'page'
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
     * Prepare widgets list for output
     *
     * @param array $modules - list of modules names 
     * @param array $params - needed parameters security path, action_path, xml_paths and xml_names
     * @param string $name - parent name - name of application or plugin
     * @param string $type - apps/plugins
     * @return array
     * @author Sergey Startsev
     */
    public static function processGetWidgetList(Array $modules, Array $params, $name, $type)
    {
        $aExtWidgets = array();
        
        foreach ($modules as $module) {
            if (count($params[$module]['xml_names']) > 0) {	
                $children = array(
                    'text'  => $module,
                    'type'  => 'module',
                    'app'   => $name,
                    'leaf'  => false,
                );
                
                foreach ($params[$module]['xml_names'] as $xk => $xmlName) {
                    $widgetName = pathinfo($xmlName, PATHINFO_FILENAME);
                    $children['children'][] = array(
                        'module'    => $module,
                        'widget'    => $widgetName,
                        'widgetUri' => "{$module}/{$widgetName}",
                        'type'      => 'xml',
                        'text'      => $widgetName,
                        'leaf'      => true,
                    );
                }
                $aExtWidgets['children'][] = $children;
            } 
        }
        
        if (!empty($aExtWidgets)) {
            $aExtWidgets['text'] = $name;
            $aExtWidgets['type'] = $type;
        }
        
        return $aExtWidgets;
    }
    
}
