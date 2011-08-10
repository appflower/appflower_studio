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
     * Prepared sub-commands separator
     */
    const PREPARED_SUBCOMMANDS_SEPARATOR = '##';
    
    /**
     * Default aliases 
     */
    protected $default_aliases = array();
    
    /**
     * default commands
     */
    protected $default_commands = array('sf', 'appflower', 'afs', 'php',);
    
    /**
     * Deprecated commands list
     */
    protected $deprecated_commands = array();
    
    /**
     * Sub-commands separators
     */
    protected $commands_separators = array();
    
    /**
     * Getting commands list
     *
     * @param boolean $explode 
     * @return array
     * @author Sergey Startsev
     */
    public function getCommands()
    {
        return array_diff(sfConfig::get(self::CONFIG_COMMANDS, $this->default_commands), $this->getDeprecated());
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
     * @param mixed $command - array/string
     * @return boolean
     * @author Sergey Startsev
     */
    public function hasDeprecated($command)
    {
        $commands_array = (!is_array($command)) ? (array) $command : $command;
        
        foreach ($commands_array as $command_element) {
            foreach ($this->getSubCommands($command_element) as $sub_command) {
                $command_name = afsConsoleCommand::getCommandName(trim($sub_command));
                
                if ($command_name && !in_array($command_name, $this->getCommands())) return true;
            }
        }
        
        return false;
    }
    
    /**
     * Getting sub commands
     *
     * @param string $command 
     * @return array
     * @author Sergey Startsev
     */
    public function getSubCommands($command)
    {
        $command_prepared = str_replace($this->commands_separators, self::PREPARED_SUBCOMMANDS_SEPARATOR, $command);
        $commands = explode(self::PREPARED_SUBCOMMANDS_SEPARATOR, $command_prepared);
        foreach ($commands as &$sub_command) $sub_command = trim($sub_command);
        
        return $commands;
    }
    
}
