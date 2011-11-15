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
     * Overloaded modifier method caller
     *
     * @param afsBaseModel $model
     * @return afsBaseModel
     * @author Sergey Startsev
     */
    public function modify(afsBaseModel $model) 
    {
        $definition = $model->getDefinition();
        
        if ($model->isNew()) {
            $definition = afsWidgetListPredictionModifier::create($definition)->filtering()->sorting()->getDefinition();
        }
        
        $model->setDefinition($definition);
        
        return $model;
    }
    
}
