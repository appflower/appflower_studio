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
        
        if (!$this->getModel()->isNew() && !$this->isKeyDefined('i:component', $definition)) {
            return "Page should contain one or more component";
        }
        
        return true;
    }
    
    /**
     * Recursive key search 
     *
     * @param string $needle 
     * @param array $haystack 
     * @return boolean
     * @author Sergey Startsev
     */
    private function isKeyDefined($needle, Array $haystack)
    {
        $result = array_key_exists($needle, $haystack);
        if ($result) return $result;
        
        foreach ($haystack as $v) {
            if (is_array($v)) $result = $this->isKeyDefined($needle, $v);
            if ($result) return $result;
        }
        
        return $result;
    }
    
}
