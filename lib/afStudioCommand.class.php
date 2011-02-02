<?php
/**
 * afStudioCommand 
 *
 * @author startsev.sergey@gmail.com
 */
class afStudioCommand
{
	
    /**
     * Getting Adaptee class
     * 
     * @param $type Type of Command class
     * @param $command Command name
     * 
     * @return object
     */
    public static function getAdapter($type, $command)
    {
        $class_name = 'afStudio' . ucfirst(strtolower($type)) . 'Command';
        $oAdapter = new $class_name($command);
        
        return $oAdapter;
    }
    
    /**
     * Processing command via command type
     * 
     * @param $type command type name (Layout, ...)
     * @param $command command name, that will be executed (get)
     * 
     * @return mixed
     */
    public static function process($type, $command)
    {
        $oAdapter = self::getAdapter($type, $command);
        $aResult = $oAdapter->process();
        
        return $aResult;
    }
    
    
    
}

