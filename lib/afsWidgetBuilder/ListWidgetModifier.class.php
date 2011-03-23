<?php
/**
 * List widget modifier
 *
 * @author lukas
 */
class ListWidgetModifier extends ConcreteWidgetModifier {

    /**
     * no need for changes in list widget
     */
    public function modify(afsWidgetBuilderWidget $afsWBW, $newWidgetMode = false) {
        return $afsWBW->getDefinition();
    }
}
?>
