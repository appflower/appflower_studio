<?php
/**
 * Core studio Command class
 *
 * @package appFlowerStudio
 * @author Startsev Sergey <startsev.sergey@gmail.com>
 */
class afStudioCommand
{
    /**
     * Private constructor
     *
     * @return void
     * @author Sergey Startsev
     */
    private function __contruct() {}
    
    /**
     * Getting Adaptee class
     * 
     * @param string $type - Type of Command class
     * @param string $command - Command name
     * @param array $params
     * @return object
     * @author Sergey Startsev
     */
    static public function getAdapter($type, $command, array $params = array())
    {
        $class_name = 'afStudio' . ucfirst($type) . 'Command';
        
        if (!class_exists($class_name)) {
            throw new afStudioCommandException("Command '{$command}' doesn't exists. Please create '{$class_name}' class.");
        }
        
        $reflection = new ReflectionClass($class_name);
        
        return $reflection->newInstance($command, $params);
    }
    
    /**
     * Processing command via command type
     * 
     * @param string $type - command type name (Layout, ...)
     * @param string $command - command name, that will be executed (get)
     * @param array $params
     * @return mixed
     * @author Sergey Startsev
     */
    static public function process($type, $command, array $params = array())
    {
        return self::getAdapter($type, $command, $params)->process();
    }
    
}
