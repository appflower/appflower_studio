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
        $aCommands = array(
            'sf propel:build-model',
            'sf appflower:validator-cache frontend cache yes',
            'sf cc',
            'sf afs:fix-perms'
        );
        
        $aResult = $this->executeCommands($aCommands);
        
        $sResult = afStudioExecuteCommandHelper::processRun($aResult);       

        $this->result = $this->fetchSuccess($sResult);
    }
    
    /**
     * Execute commands list
     *
     * @param array $aCommands
     * @return array
     */
    private function executeCommands($aCommands)
    {
        $afConsole = afStudioConsole::getInstance();
        
        $aResult = array();
        foreach ($aCommands as $command) {
            $aResult[] = $afConsole->execute($command);
        }
        
        return $aResult;
    }
}
