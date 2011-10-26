<?php
/**
 * I need to have a class with some static methods that will be able to give me values
 * for choices/combo widgets on editing foreign key fields
 *
 * @author Łukasz Wojciechowski <luwo@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
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
     * if defined more than one  parameter, for example getDataForList($modelName, $fieldName, $fieldValue)
     * then this criteria will be added to query class 
     * 
     * @example getDataForList($modelName, $fieldName, $fieldValue),
     *          getDataForList($modelName, $fieldName1, $fieldValue1, $fieldName2, $fieldValue2)
     *              where - fieldName in table structure style, like field_name
     *
     * @author Łukasz Wojciechowski
     * @author Sergey Startsev
     */
    static public function getDataForList($modelName)
    {
        if (func_num_args() % 2 === 0) throw new sfException("not all params defined");
        
        $queryClass = "{$modelName}Query";
        $query = new $queryClass('propel', $modelName);
        
        // remove modelName from array of args
        $arguments = array_slice(func_get_args(), 1);
        if (!empty($arguments)) {
            $params = array();
            foreach ($arguments as $key => $value) {
                if ($key % 2 === 1) {
                    $query->where("{$modelName}." . sfInflector::camelize($field_name) . " = ?", $value);
                    continue;
                }
                $field_name = $value;
            }
        }
        
        return $query;
    }
    
}
