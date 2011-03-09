<?php
/**
 * afStudioExecute Command
 *
 * @author startsev.sergey@gmail.com
 */
class afStudioExecuteCommand extends afBaseStudioCommand
{
    /**
     * Execute run controller
     */
    protected function processRun()
    {
        $afConsole = afStudioConsole::getInstance();
        
        $sResult = $afConsole->execute('sf propel:build-model');
        $sResult .= $afConsole->execute('sf appflower:validator-cache frontend cache yes');
        $sResult .= $afConsole->execute('sf cc');
        $sResult .= $afConsole->execute('sf afs:fix-perms');
        
        $this->result = $this->fetchSuccess($sResult);
    }
    
    
}
