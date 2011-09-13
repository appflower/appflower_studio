<?php
/**
 * Symfony console command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsSfConsoleCommand extends afsBaseConsoleCommand
{
    /**
     * Command name
     */
    protected $name = 'sf';
    
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
        $command = substr($this->getCommand(), 3);
        
        return sprintf('%s "%s" %s', $this->getCli(), afStudioUtil::getRootDir() . '/symfony', $command);
    }
    
}
