<?php
/**
 * I need to have a class with some static methods that will be able to give me values
 * for choices/combo widgets on editing foreign key fields
 *
 * @author Łukasz Wojciechowski <luwo@appflower.com>
 */
class ModelCriteriaFetcher
{
    /**
     * Method builds array with ID's as keys and __toString() representation as value
     * Used in combo widgets as possible choices
     * 
     * @author Łukasz Wojciechowski
     */
    static public function getDataForComboWidget($modelName)
    {
        $queryClass = "{$modelName}Query";
        $query = new $queryClass('propel', $modelName);
        
        /* @var $query ModelCriteria */
        $collection = $query->find();
        
        if (method_exists($modelName, '__toString')) {
            return $collection->toKeyValue('Id');
        } else {
            return $collection->toKeyValue('Id', 'Id');
        }
    }
    
    /**
     * Method just returns empty Criteria object so it can be used in list widget to fetch data
     *
     * @author Łukasz Wojciechowski
     */
    static public function getDataForList($modelName)
    {
        $queryClass = "{$modelName}Query";
        $query = new $queryClass('propel', $modelName);
        
        return $query;
    }
    
}
