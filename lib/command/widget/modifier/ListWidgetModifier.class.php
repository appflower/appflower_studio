<?php
/**
 * List widget modifier
 *
 * @author Łukasz Wojciechowski <luwo@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class ListWidgetModifier extends ConcreteWidgetModifier 
{
    /**
     * no need for changes in list widget
     *
     * @param Array $definition 
     * @param boolean $newWidgetMode 
     * @return array
     * @author Łukasz Wojciechowski
     */
    public function modify(Array $definition, $newWidgetMode = false) {
        return $definition;
    }
    
}
