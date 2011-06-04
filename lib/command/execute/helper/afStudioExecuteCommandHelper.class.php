<?php
/**
 * Studio Execute Command Helper class 
 * 
 * @author startsev.sergey@gmail.com
 */
class afStudioExecuteCommandHelper
{
    const DELIMITER = "<br/>";
    
    /**
     * Returns Prepared commands results - for now just imploded values
     * 
     * @return string
     */
    public static function processRun($aResult)
    {
    	$sResult = implode(self::DELIMITER, $aResult);
        
        return $sResult;
    }
    
}

