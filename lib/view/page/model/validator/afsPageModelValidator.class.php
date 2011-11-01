<?php
/**
 * Page model validator class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsPageModelValidator extends afsBaseModelValidator
{
    /**
     * Private constructor
     *
     * @author Sergey Startsev
     */
    private function __construct() {}
    
    /**
     * Fabric method - create self 
     *
     * @param afsPageModel $widget 
     * @return afsPageModelValidator
     * @author Sergey Startsev
     */
    static public function create(afsPageModel $widget)
    {
        $instance = new self;
        $instance->model = $widget;
        
        return $instance;
    }
    
    /**
     * Validate empty page definition
     *
     * @return mixed
     * @author Sergey Startsev
     */
    protected function validateEmptyPageDefinition()
    {
        $definition = $this->getDefinition();
        
        if (!$this->getModel()->isNew() && array_key_exists('i:area', $definition) && !array_key_exists('i:component', $definition['i:area'])) {
            return "Page should contain one or more component";
        }
        
        return true;
    }
    
}
