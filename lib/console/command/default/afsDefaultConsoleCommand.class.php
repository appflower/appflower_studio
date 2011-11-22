<?php
/**
 * Default console command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsDefaultConsoleCommand extends afsBaseConsoleCommand
{
    /**
     * Command name
     */
    protected $name = 'default';
    
    /**
     * Commadn prefix
     */
    protected $prefix = '';
    
    /**
     * Prepare command method
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function prepare()
    {
        return $this->getCommand();
    }
    
}
