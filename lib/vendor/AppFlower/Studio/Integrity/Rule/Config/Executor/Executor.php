<?php

namespace AppFlower\Studio\Integrity\Rule\Config\Executor;

/**
 * Executor class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <srartsev.sergey@gmail.com>
 */
class Executor
{
    /**
     * Executor name
     *
     * @var string
     */
    private $name;
    
    /**
     * Params list
     *
     * @var array
     */
    private $params = array();
    
    /**
     * Creator method
     *
     * @param string $name 
     * @return Executor
     * @author Sergey Startsev
     */
    static public function create($name)
    {
        $instance = new self;
        $instance->setName($name);
        
        return $instance;
    }
    
    /**
     * Private constructor
     *
     * @author Sergey Startsev
     */
    private function __construct() {}
    
    /**
     * Add parameter
     *
     * @param string $name 
     * @param mixed $value 
     * @return Executor
     * @author Sergey Startsev
     */
    public function addParameter($name, $value)
    {
        $this->params[$name] = $value;
        
        return $this;
    }
    
    /**
     * Getting parameter
     *
     * @param string $name 
     * @return mixed
     * @author Sergey Startsev
     */
    public function getParameter($name)
    {
        return (array_key_exists($name, $this->params)) ? $this->params[$name] : null;
    }
    
    /**
     * Getting parameters
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getParameters()
    {
        return $this->params;
    }
    
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
    
}
