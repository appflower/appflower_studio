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
        $instance = new self;
        $instance->pull();
        
        return $instance;
    }
    
    private function __construct() {}
    
    /**
     * Update cache definition procedure for all found widgets 
     *
     * @return void
     * @author Sergey Startsev
     */
    public function updateAll()
    {
        $this->definition = array();
        
        $finder = \sfFinder::type('dir')->maxdepth(0);
        
        foreach ($finder->in(\sfConfig::get('sf_apps_dir')) as $app_dir) {
            foreach ($finder->in($app_dir . DIRECTORY_SEPARATOR . 'modules') as $module_dir) {
                foreach ($finder->type('file')->name('*.xml')->in($module_dir . DIRECTORY_SEPARATOR . 'config') as $widget_dir) {
                    $this->retrieveAndUpdate(
                        pathinfo($widget_dir, PATHINFO_FILENAME), 
                        pathinfo($module_dir, PATHINFO_FILENAME), 
                        pathinfo($app_dir, PATHINFO_FILENAME)
                    );
                }
            }
        }
        
        return $this;
    }
    
    /**
     * Update cache definition procedure
     *
     * @param afsWidgetModel $widget
     * @return Widget
     * @author Sergey Startsev
     */
    public function update($widget)
    {
        if ($widget->isNew()) return $this;
        
        $method_name = 'process' . ucfirst(strtolower($widget->getType()));
        if (method_exists($this, $method_name)) {
            $this->definition[$widget->getPlace()][$widget->getModule()][$widget->getAction()] = call_user_func(array($this, $method_name), $widget->getDefinition());
        }
        
        return $this;
    }
    
    /**
     * Retrieve widget and update definition
     *
     * @param string $app_name 
     * @param string $module_name 
     * @param string $widget_name 
     * @param string $model_name
     * @return Widget
     * @author Sergey Startsev
     */
    public function retrieveAndUpdate($widget_name, $module_name, $app_name, $place_type = 'app', $model_name = '')
    {
        return $this->update(\afsWidgetModelHelper::retrieve($widget_name, $module_name, $app_name, $place_type, $model_name));
    }
    
    /**
     * Store definition procedure
     *
     * @return void
     * @author Sergey Startsev
     */
    public function push()
    {
        file_put_contents(\sfConfig::get('sf_cache_dir') . DIRECTORY_SEPARATOR . $this->file_name, \sfYaml::dump($this->definition, 1));
    }
    
    /**
     * Restore cached definition procedure
     *
     * @return void
     * @author Sergey Startsev
     */
    protected function pull()
    {
        $this->definition = array();
        
        if (file_exists(\sfConfig::get('sf_cache_dir') . DIRECTORY_SEPARATOR . $this->file_name)) {
            $this->definition = \sfYaml::load(\sfConfig::get('sf_cache_dir') . DIRECTORY_SEPARATOR . $this->file_name);
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
                    $response['fields'][$column['attributes']['name']]['filter'] = $column['attributes']['filter'];
                } else {
                    $response['fields'][$column['attributes']['name']]['filter'] = '';
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
        $response = array();
        if (array_key_exists('i:datasource', $definition)) {
            $datasource = $definition['i:datasource'];
            if (array_key_exists('attributes', $datasource)) {
                if (array_key_exists('type', $datasource['attributes'])) {
                    $response['datasource']['type'] = $datasource['attributes']['type'];
                }
            }
            
            if (array_key_exists('i:class', $datasource)) {
                $peer = $datasource['i:class'];
                
                $response['datasource']['model'] = (defined("{$peer}::OM_CLASS")) ? $peer::OM_CLASS : $peer;
                $response['datasource']['class'] = $peer;
            }
        }
        
        if (array_key_exists('i:fields', $definition) && array_key_exists('i:field', $definition['i:fields'])) {
            foreach ($definition['i:fields']['i:field'] as $field) {
                if (array_key_exists('attributes', $field) && array_key_exists('type', $field['attributes'])) {
                    $response['fields'][$field['attributes']['name']]['type'] = $field['attributes']['type'];
                }
                
                if (array_key_exists('i:value', $field) && 
                    array_key_exists('attributes', $field['i:value']) && 
                    array_key_exists('type', $field['i:value']['attributes']) &&
                    $field['i:value']['attributes']['type'] == 'orm' && 
                    array_key_exists('i:class', $field['i:value'])
                ) {
                    $peer = $field['i:value']['i:class'];
                    $response['fields'][$field['attributes']['name']]['value']['model'] = (defined("{$peer}::OM_CLASS")) ? $peer::OM_CLASS : $peer;
                    $response['fields'][$field['attributes']['name']]['value']['class'] = $peer;
                }
            }
        }
        
        return $response;
    }
    
}
