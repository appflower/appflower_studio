<?php
/**
 * Base class for edit, list and other widget types modifier classes
 * When widget definition returns from JS side it is unserialized to xml data
 *
 * @author lukas
 */
abstract class ConcreteWidgetModifier
{
    /**
     * This method gets new widget representation created on JS side
     * It can modify it specially for concrete widget type and return modified definition
     *
     * @param array $definition
     * @return array modified definition
     */
    abstract function modify(afsWidgetBuilderWidget $afsWBW);
}
?>
