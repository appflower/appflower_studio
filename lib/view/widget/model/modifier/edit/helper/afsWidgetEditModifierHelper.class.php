<?php
/**
 * Widget edit modifier class helper
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetEditModifierHelper
{
    /**
     * Model criteria fetcher method
     */
    const MODEL_CRITERIA_FETCHER = 'ModelCriteriaFetcher';
    
    /**
     * Fetcher method from model criteria
     */
    const FETCHER_METHOD = 'getDataForComboWidget';
    
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
            if (isset($definition['i:datasource']['i:class'])) {
                return $definition['i:datasource']['i:class'];
            }
        }
        
        return null;
    }
    
}
