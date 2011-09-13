<?php
/**
 * Afs console command class 
 *
 * @package appFLowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsAfsConsoleCommand extends afsBaseConsoleCommand
{
    /**
     * Command name
     */
    protected $name = 'afs';
    
    /**
     * Command prefix
     */
    protected $prefix = 'symfony ';
    
    /**
     * Prepare command
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function prepare()
    {
        $command = 'afs:' . substr($this->getCommand(), 4);
        
        return sprintf('%s "%s" %s', $this->getCli(), afStudioUtil::getRootDir() . '/symfony', $command);
    }
    
}
