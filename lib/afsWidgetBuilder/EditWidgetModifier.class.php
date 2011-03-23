<?php
/**
 * Edit widget modifier
 *
 * @author lukas
 */
class EditWidgetModifier extends ConcreteWidgetModifier {

    public function modify(afsWidgetBuilderWidget $afsWBW, $newWidgetMode = false) {
        $this->afsWBW = $afsWBW;
        $definition = $afsWBW->getDefinition();

        if ($newWidgetMode) {
            $definition = $this->searchForAndModifyForeignTableFields($definition);
        }
        return $definition;
    }

    private function searchForAndModifyForeignTableFields($definition)
    {
        if (isset($definition['i:fields']) ) {
            $fields = $definition['i:fields'];
            if (isset($fields['i:field'])) {
                $fields = $fields['i:field'];
                if (is_array($fields) && count($fields) > 0) {
                    foreach ($fields as $fieldKey => $field) {
                        $modifiedField = $this->checkAndModifyForeignTableField($field);
                        if ($modifiedField) {
                            $definition['i:fields']['i:field'][$fieldKey] = $modifiedField;
                        }
                    }
                }
            }
        }

        return $definition;
    }

    private function checkAndModifyForeignTableField($fieldDefinition)
    {
        FirePHP::getInstance(true)->fb($fieldDefinition);
        $peerClassName = $this->afsWBW->getDatasourceClassName();

        /* @var $tableMap TableMap */
        $tableMap = call_user_func("{$peerClassName}::getTableMap");
        $columnName = $fieldDefinition['name'];
        if ($tableMap->hasColumn($columnName)) {
            FirePHP::getInstance(true)->fb("Column found for $columnName");
            /* @var $column ColumnMap */
            $column = $tableMap->getColumn($columnName);
            if ($column->isForeignKey()) {
                FirePHP::getInstance(true)->fb("$columnName column is foreign key");

                $relatedColumnTableMap = $column->getRelation()->getForeignTable();
                $relatedModelName = $relatedColumnTableMap->getPhpName();

                $fieldDefinition['type'] = 'combo';
                $fieldDefinition['i:value'] = array(
                    'type' => 'orm',
                    'i:class' => 'ModelCriteriaFetcher',
                    'i:method' => array(
                        'name' => 'getDataForComboWidget',
                        'i:param' => array(
                            array(
                                'name' => 'does_not_matter',
                                '_content' => $relatedModelName
                            )
                        )
                    )
                );

            }
        }

        return $fieldDefinition;
    }
}
?>
