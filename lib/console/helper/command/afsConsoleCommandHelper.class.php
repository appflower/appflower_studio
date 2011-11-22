<?php
/**
 * Console command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsConsoleCommandHelper
{
    /**
     * Fabric method
     *
     * @return afsConsoleCommandHelper
     * @author Sergey Startsev
     */
    static public function create()
    {
        return new self;
    }
    
    /**
     * Delegate call to command helper classes
     *
     * @param string $method 
     * @param string $arguments 
     * @return mixed
     * @author Sergey Startsev
     */
    public function __call($method, $arguments)
    {
        $helper = 'afs' . ucfirst(afsConsoleHelper::getOsType()) . 'ConsoleCommandHelper';
        
        if (!class_exists($helper)) throw new afsConsoleCommandHelperException("This '{$helper}' adaptee doesn't exists");
        
        $reflection = new ReflectionClass($helper);
        $instance = $reflection->newInstance();
        
        if (!method_exists($instance, $method)) throw new afsConsoleCommandHelperException("Method '{$method}' doesn't exists in '{$helper}' helper");
        
        return call_user_func_array(array($instance, $method), $arguments);
    }
    
}
