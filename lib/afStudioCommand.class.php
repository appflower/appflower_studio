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
    public static function getAdapter($type, $command, $params = array())
    {
        $class_name = 'afStudio' . ucfirst($type) . 'Command';
        $oAdapter = new $class_name($command, $params);
        
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
    public static function process($type, $command, $params = array())
    {
        $oAdapter = self::getAdapter($type, $command, $params);
        $aResult = $oAdapter->process();
        
        return $aResult;
    }
    
    
    
}

