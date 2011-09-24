<?php
/**
 * Mac console command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsMacConsoleCommandHelper extends afsUnixConsoleCommandHelper
{
    /**
     * Deprecated commands
     */
    protected $deprecated_commands = array('wget', 'free',);
    
}
