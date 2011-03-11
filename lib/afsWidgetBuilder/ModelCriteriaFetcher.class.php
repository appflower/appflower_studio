<?php
/**
 * I need to have a class with some static methods that will be able to give me values
 * for choices/combo widgets on editing foreign key fields
 *
 * @author lukas
 */
class ModelCriteriaFetcher
{
    /**
     * Method builds array with ID's as keys and __toString() representation as value
     * Used in combo widgets as possible choices
     */
    static function getDataForComboWidget($modelName)
    {
        $queryClass = "{$modelName}Query";
        $query = new $queryClass('propel', $modelName);
        /* @var $query ModelCriteria */
        $collection = $query->find();
        return $collection->toKeyValue('Id');
    }
}
?>
