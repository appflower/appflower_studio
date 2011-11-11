<?php
/**
 * List widget modifier
 *
 * @author Łukasz Wojciechowski <luwo@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetListModifier extends afsBaseModelModifier 
{
    /**
     * no need for changes in list widget
     *
     * @param afsBaseModel $model
     * @return afsBaseModel
     * @author Łukasz Wojciechowski
     */
    public function modify(afsBaseModel $model) 
    {
        return $model;
    }
    
}
