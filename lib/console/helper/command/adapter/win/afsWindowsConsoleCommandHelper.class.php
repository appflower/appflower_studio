<?php
/**
 * Windows console command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWindowsConsoleCommandHelper extends afsBaseConsoleCommandHelper
{
    /**
     * default commands
     */
    protected $default_commands = array('dir',);
    
    /**
     * Deprecated commands list
     */
    protected $deprecated_commands = array('ping', 'trace',);
    
}
