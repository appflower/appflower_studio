<?php

/**
 *
 * @package    appFlowerStudio
 * @subpackage plugin
 * @author     luwo@appflower.com
 */
class afsModelGridDataActions extends sfActions
{
    /**
     * afsModelGridData actions are all executed in context of concrete model so
     * we are guessing early proper model name and its query class name
     *
     * @var string
     */
    protected $modelName;
    protected $modelQueryClass;

    function preExecute() {
	    $modelName = $this->getRequest()->getParameter('model');
        $modelQueryClass = "{$modelName}Query";
        if (!class_exists($modelName)) {
            throw new Exception("Model $modelName probably does not exist. Could not find class named $modelName");
        }

        $this->modelName = $modelName;
        $this->modelQueryClass = $modelQueryClass;
    }

    /**
     * @return ModelCriteria
     */
    private function getModelQuery()
    {
        return new $this->modelQueryClass;
    }

    /**
     * This method decodes rows data sended by ExtJS
     */
    private function fetchRows()
    {
        $rawData = file_get_contents('php://input');
        $data = json_decode($rawData, true);
        return $data['rows'];
    }

    /**
     * Returns all rows for given model in a format for ModelGrid view
     *
     * @param sfWebRequest $request
     * @return array
     */
    public function executeRead(sfWebRequest $request)
    {
        $query = $this->getModelQuery();
        $data = $query->find();
        $data2 = array();
        foreach ($data as $row) {
            $data2[] = $this->getModelObjectData($row);
        }
        $result = array(
            'rows' => $data2,
            'results' => count($data2),
            'success' =>true
        );

        return $result;
    }


    private function getModelObjectData($object)
    {
        $arrayWithKeys = $object->toArray();
        $col = 0;
        $tmp = array();
        foreach ($arrayWithKeys as $value) {
            $tmp["c{$col}"] = $value;
            $col++;
        }
        $tmp['id'] = $object->getPrimaryKey();
        return $tmp;
    }

    /**
     * Saves changes made to data in ModelGrid view
     *
     * @param sfWebRequest $request
     * @return array
     */
    public function executeUpdate(sfWebRequest $request)
    {
        $query = $this->getModelQuery();

        $rows = $this->fetchRows();
        $rowsIndexed = array();
        foreach ($rows as $row) {
            $rowsIndexed[$row['id']] = $row;
        }
        $ids = array_keys($rowsIndexed);
        $objects = $query->filterByPrimaryKeys($ids)->find();

        $result = array(
            'success' => true,
            'rows' => array()
        );

        try {
            foreach ($objects as $object) {
                    $peer = $object->getPeer();
                    $objectData = $rowsIndexed[$object->getPrimaryKey()];
                    unset($objectData['id']);
                    foreach ($objectData as $col => $value) {
                            $colNr = str_replace('c', '', $col);
                            $colPhpName = $peer->translateFieldName($colNr, BasePeer::TYPE_NUM, BasePeer::TYPE_PHPNAME);
                            $colSetterMethod = "set{$colPhpName}";
                            $object->$colSetterMethod($value);
                    }
                    $object->save();
                    $result['rows'][] = $this->getModelObjectData($object);
            }
        } catch (Exception $e) {
            $result['success'] = false;
            $result['error'] = $e->getMessage();
            return $result;
        }

        return $result;
    }

    /**
     * Creates new records
     *
     * @param sfWebRequest $request
     * @return array
     */
    public function executeCreate(sfWebRequest $request)
    {
        $rows = $this->fetchRows();
        $result = array('success' => true, 'rows' => array());
        $errors = array();
        foreach ($rows as $row) {
            $object = new $this->modelName;
            $peer = $object->getPeer();
            foreach ($row as $colId => $value) {
                $colId = str_replace('c', '', $colId);
                $object->setByPosition($colId, $value);
            }
            if ($object->isModified()) {
                try {
                    $object->save();
                } catch (PropelException $e) {
                    $errors[] = $e->getMessage() . ' for record: ' . print_r($row, true);
                }
            }
            if (!$object->isNew()) {
                $result['rows'][] = $this->getModelObjectData($object);
            } else {
                $result['rows'][] = $row;
            }
        }

        if (count($errors) > 0) {
            $result['errors'] = $errors;
            $result['success'] = false;
        }

        return $result;
    }

    /**
     * Deletes records
     *
     * @param sfWebRequest $request
     * @return array
     */
    public function executeDelete(sfWebRequest $request)
    {
        $rows = $this->fetchRows();
        $query = $this->getModelQuery();
        $query->filterByPrimaryKeys($rows)
            ->delete();
        return array('success' => true,'message' => 'Rows deleted succesfully');
    }
}