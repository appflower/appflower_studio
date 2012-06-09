<?php

namespace AppFlower\Studio\Cache;

/**
 * Widget cache class 
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Widget
{
    /**
     * Store filename
     *
     * @var string
     */
    private $file_name = '.widget.cache';
    
    /**
     * Cached definition
     *
     * @var array
     */
    private $definition = array();
    
    /**
     * Creator method
     *
     * @return void
     * @author Sergey Startsev
     */
    static public function create()
    {
        return new self;
    }
    
    private function __construct() {}
    
    /**
     * Update cache definition procedure
     *
     * @param string $app_name 
     * @param string $module_name 
     * @param string $widget_name 
     * @return void
     * @author Sergey Startsev
     */
    public function updatePaths($app_name = '', $module_name = '', $widget_name = '')
    {
        $finder = \sfFinder::type('dir')->maxdepth(0);
        
        foreach ($finder->in(\sfConfig::get('sf_apps_dir')) as $app_dir) {
            $app_name = pathinfo($app_dir, PATHINFO_FILENAME);
            foreach ($finder->in($app_dir . DIRECTORY_SEPARATOR . 'modules') as $module_dir) {
                $module_name = pathinfo($module_dir, PATHINFO_FILENAME);
                foreach ($finder->type('file')->name('*.xml')->in($module_dir . DIRECTORY_SEPARATOR . 'config') as $widget_dir) {
                    $widget_name = pathinfo($widget_dir, PATHINFO_FILENAME);
                    $widget = \afsWidgetModelHelper::retrieve($widget_name, $module_name, $app_name, 'app');
                    
                    $method_name = 'process' . ucfirst(strtolower($widget->getType()));
                    if (method_exists($this, $method_name)) {
                        $this->definition[$widget_name] = call_user_func(array($this, $method_name), $widget->getDefinition());
                    }
                }
            }
        }
    }
    
    /**
     * Process with list type widgets
     *
     * @param Array $definition 
     * @return array
     * @author Sergey Startsev
     */
    private function processList(Array $definition)
    {
        $response = array();
        if (array_key_exists('i:datasource', $definition)) {
            $datasource = $definition['i:datasource'];
            if (array_key_exists('attributes', $datasource)) {
                if (array_key_exists('type', $datasource['attributes'])) {
                    $response['datasource']['type'] = $datasource['attributes']['type'];
                }
                if (array_key_exists('modelName', $datasource['attributes'])) {
                    $response['datasource']['model'] = $datasource['attributes']['modelName'];
                }
            }
        }
        
        if (array_key_exists('i:fields', $definition) && array_key_exists('i:column', $definition['i:fields'])) {
            foreach ($definition['i:fields']['i:column'] as $column) {
                if (array_key_exists('attributes', $column) && array_key_exists('filter', $column['attributes'])) {
                    $response['fields'][$column['attributes']['name']] = $column['attributes']['filter'];
                }
            }
        }
        
        return $response;
    }
    
    /**
     * Process with edit type widgets
     *
     * @param Array $definition 
     * @return array
     * @author Sergey Startsev
     */
    private function processEdit(Array $definition)
    {
        return array();
    }
    
}
