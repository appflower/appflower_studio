<?php
/**
 * Studio project command helper class 
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioProjectCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Returns Prepared commands results - for now just imploded values
     * 
     * @return string
     * @author Sergey Startsev
     */
    static public function processRun()
    {
        $commands = array(
            'sf propel:build-model',
            'sf appflower:validator-cache frontend cache yes',
            'sf cc',
        );
        
        return afStudioConsole::getInstance()->execute($commands);
    }
    
}

