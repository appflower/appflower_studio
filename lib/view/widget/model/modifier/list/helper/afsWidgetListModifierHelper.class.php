<?php
/**
 * Widget list modifier class helper
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetListModifierHelper
{
    /**
     * Model criteria fetcher method
     */
    const MODEL_CRITERIA_FETCHER = 'ModelCriteriaFetcher';
    
    /**
     * Fetcher method from model criteria
     */
    const FETCHER_METHOD = 'getDataForList';
    
    /**
     * Process getting datasource class
     *
     * @param Array $definition 
     * @return string
     * @author Sergey Startsev
     */
    static public function getDatasource(Array $definition)
    {
        if (isset($definition['i:datasource'])) {
            if (array_key_exists('attributes', $definition['i:datasource']) && array_key_exists('modelName', $definition['i:datasource']['attributes'])) {
                return $definition['i:datasource']['attributes']['modelName'];
            }
        }
        
        return null;
    }
    
}
