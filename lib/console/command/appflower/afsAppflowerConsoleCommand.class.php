<?php
/**
 * Afs console command class 
 *
 * @package appFLowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsAppflowerConsoleCommand extends afsBaseConsoleCommand
{
    /**
     * Command name
     */
    protected $name = 'appflower';
    
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
        $command = 'appflower:' . substr($this->getCommand(), 10);
        
        return sprintf('%s "%s" %s', $this->getCli(), afStudioUtil::getRootDir() . '/symfony', $command);
    }
    
}
