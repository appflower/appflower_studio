<?php

namespace AppFlower\Studio\Integrity\Rule\Config;

/**
 * Crumb that involve executors list
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Crumb
{
    /**
     * Rule name
     *
     * @var string
     */
    private $name;
    
    /**
     * Executors list
     *
     * @var array
     */
    private $executors = array();
    
    /**
     * Creator method
     *
     * @param string $name 
     * @return Crumb
     * @author Sergey Startsev
     */
    static public function create($name)
    {
        $instance = new self;
        $instance->setName($name);
        
        return $instance;
    }
    
    /**
     * private constructor
     *
     * @author Sergey Startsev
     */
    private function __construct() {}
    
    /**
     * Name setter
     *
     * @param string $name 
     * @return void
     * @author Sergey Startsev
     */
    public function setName($name)
    {
        $this->name = $name;
    }
    
    /**
     * Name getter
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getName()
    {
        return $this->name;
    }
    
    /**
     * Adding executor to crumb
     *
     * @param Executor $executor 
     * @return Crumb
     * @author Sergey Startsev
     */
    public function addExecutor(Executor\Executor $executor)
    {
        $this->executors[] = $executor;
        
        return $this;
    }
    
    /**
     * Verify exists executors or not
     *
     * @return bool
     * @author Sergey Startsev
     */
    public function hasExecutors()
    {
        return !empty($this->executors);
    }
    
    /**
     * Getting executors
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getExecutors()
    {
        return $this->executors;
    }
    
}
