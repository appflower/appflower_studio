<?php
/**
 * Unix console command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsUnixConsoleCommandHelper extends afsBaseConsoleCommandHelper
{
    /**
     * Default aliases 
     */
    protected $base_default_aliases = array(
        'll' => 'ls -l',
    );
    
    /**
     * default commands
     */
    protected $base_default_commands = array('sf', 'appflower', 'afs', 'git', 'batch', 'man', 'll', 'ls', 'pwd', 'cat', 'mkdir', 'rm', 'cp', 'mv', 'touch', 'chmod', 'free', 'df', 'find', 'clear', 'php',);
    
    /**
     * Default deprecated commands list
     */
    protected $base_deprecated_commands = array('top', 'htop', 'irb', 'ping',);
    
    /**
     * Reload deprecated method to extend parent list
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getDeprecated()
    {
        return array_merge($this->base_deprecated_commands, $this->deprecated_commands);
    }
    
    /**
     * Reload aliases method to extend parent list
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getAliases()
    {
        return array_merge($this->base_default_aliases, $this->default_aliases);
    }
    
    /**
     * Reload commands method to extend parent list
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getCommands()
    {
        return array_merge($this->base_default_commands, $this->default_commands);
    }
    
}
