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
     * Prepare widgets list for output
     *
     * @param array $aModules - list of modules names 
     * @param array $aParams - needed parameters security path, action_path, xml_paths and xml_names
     * @param string $name - parent name - name of application or plugin
     * @param string $type - apps/plugins
     * 
     * @return array
     */
    public static function processGetWidgetList($aModules, $aParams, $name, $type)
    {
        $aExtWidgets = array(
            'text' => $name,
            'type' => $type
        );
        
        foreach ($aModules as $module) {
            $children = array(
                'text' => $module,
                'type' => 'module',
                'app' => $name
			);

			if (count($aParams[$module]['xml_names']) > 0) {	
                $children['leaf'] = false;
                
				foreach ($aParams[$module]['xml_names'] as $xk => $xmlName) {
					$children['children'][] = array(
                        'app' => $name,
                        'module' => $module,
					    'widget' => str_replace('.xml', '', $xmlName),
                        'widgetUri' => $module.'/'.str_replace('.xml', '', $xmlName),
                        'type' => 'xml',
                        'text' => $xmlName,
                        'securityPath' => $aParams[$module]['security_path'],
                        'xmlPath' => $aParams[$module]['xml_paths'][$xk],
                        'actionPath' => $aParams[$module]['action_path'],
                        'leaf' => true
					);
				}
			} else {
				$children['leaf'] = true;
				$children['iconCls'] = 'icon-folder';
			}
			
			$aExtWidgets['children'][] = $children;
        }
        
        return $aExtWidgets;
    }

    
}

