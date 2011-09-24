<?php
/**
 * Core studio Command class
 *
 * @author Startsev Sergey <startsev.sergey@gmail.com>
 */
class afStudioCommand
{
    /**
     * Getting Adaptee class
     * 
     * @param string $type - Type of Command class
     * @param string $command - Command name
     * 
     * @return object
     */
    public static function getAdapter($type, $command, $params = array())
    {
        $class_name = 'afStudio' . ucfirst($type) . 'Command';
        
        if (!class_exists($class_name)) {
            throw new afStudioCommandException("Command '{$command}' doesn't exists. Please create '{$class_name}' class.");
        }
        
        $oAdapter = new $class_name($command, $params);
        
        return $oAdapter;
    }
    
    /**
     * Processing command via command type
     * 
     * @param string $type - command type name (Layout, ...)
     * @param string $command - command name, that will be executed (get)
     * 
     * @return mixed
     */
    public static function process($type, $command, $params = array())
    {
        $oAdapter = self::getAdapter($type, $command, $params);
        $aResult = $oAdapter->process();
        
        return $aResult;
    }
    
}
