<?php
/**
 * Base console command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseConsoleCommandHelper
{
    /**
     * Config commands identificator
     */
    const CONFIG_COMMANDS = 'afStudio_console_commands';
    
    /**
     * Config aliases identificator
     */
    const CONFIG_ALIASES = 'afStudio_console_aliases';
    
    /**
     * Default aliases 
     */
    protected $default_aliases = array();
    
    /**
     * default commands
     */
    protected $default_commands = array();
    
    /**
     * Deprecated commands list
     */
    protected $deprecated_commands = array();
    
    /**
     * Getting commands list
     *
     * @param boolean $explode 
     * @return array
     * @author Sergey Startsev
     */
    public function getCommands()
    {
        return sfConfig::get(self::CONFIG_COMMANDS, $this->default_commands);
    }
	
	/**
	 * Getting aliases 
	 *
	 * @return array
	 * @author Sergey Startsev
	 */
    public function getAliases()
    {
        return sfConfig::get(self::CONFIG_ALIASES, $this->default_aliases);
    }
    
    /**
     * Getting deprecated commands
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getDeprecated()
    {
        return $this->deprecated_commands;
    }
    
    /**
     * Checking does command contains deprecated sub commands
     * for example:  sf cc && top && htop && irb
     *
     * @param mixed $command 
     * @return boolean
     * @author Sergey Startsev
     */
    public function hasDeprecated($command)
    {
        $commands_array = (!is_array($command)) ? (array) $command : $command;
        
        foreach ($commands_array as $command_element) {
            $commands = explode('&&', $command_element);
            foreach ($commands as $sub_command) {
                $command_name = afsConsoleCommand::getCommandName(trim($sub_command));

                if ($command_name && in_array($command_name, $this->getDeprecated())) return true;
            }
        }
        
        return false;
    }
    
}
