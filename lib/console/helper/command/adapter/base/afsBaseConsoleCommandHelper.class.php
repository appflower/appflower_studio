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
    const CONFIG_COMMANDS = 'app_afStudio_console_commands';
    
    /**
     * Config aliases identificator
     */
    const CONFIG_ALIASES = 'app_afStudio_console_aliases';
    
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
    protected $default_commands = array();
    
    /**
     * Deprecated commands list
     */
    protected $deprecated_commands = array();
    
    /**
     * Sub-commands separators
     */
    protected $commands_separators = array();
    
    /**
     * System commands list
     */
    protected $system_commands = array('sf', 'appflower', 'afs', 'batch', 'afsbatch', 'php', );
    
    /**
     * Getting commands list
     *
     * @param boolean $explode 
     * @return array
     * @author Sergey Startsev
     */
    public function getCommands()
    {
        // getting commands array 
        $commands = array_unique(array_merge(
            $this->getSystemCommands(), 
            sfConfig::get(self::CONFIG_COMMANDS, $this->default_commands)
        ));
        
        return array_diff($commands, $this->getDeprecated());
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
     * Getting separators
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getCommandsSeparators()
    {
        return $this->commands_separators;
    }
    
    /**
     * Getting system commands 
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getSystemCommands()
    {
        return $this->system_commands;
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
                
                if ($command_name && in_array($command_name, $this->getDeprecated())) return true;
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
        $command_prepared = str_replace($this->getCommandsSeparators(), self::PREPARED_SUBCOMMANDS_SEPARATOR, $command);
        $commands = explode(self::PREPARED_SUBCOMMANDS_SEPARATOR, $command_prepared);
        foreach ($commands as &$sub_command) $sub_command = trim($sub_command);
        
        return $commands;
    }
    
    /**
     * Prepare command for executing - replace alias commands with associated commands
     *
     * @param mixed $command 
     * @return array
     * @author Sergey Startsev
     */
    public function prepare($command)
    {
        $commands_array = (!is_array($command)) ? (array) $command : $command;
        
        if ($separators = $this->getCommandsSeparators()) {
            $patterns = array();
            $replacements = array();
            
            $separators_slashed = array();
            foreach ($separators as $separator) $separators_slashed[] = addcslashes($separator, '|\/?:');
            
            $separators_slashed = implode('|', $separators_slashed);
            $pre_pattern = "/((?:{$separators_slashed}|^)(?: |))(";
            $post_pattern = ")((?:$| |[". implode('', $separators) ."]))/";
            
            foreach ($this->getAliases() as $alias_name => $command_replacement) {
                $patterns[] = "{$pre_pattern}{$alias_name}{$post_pattern}";
                $replacements = "$1{$command_replacement}$3";
            }
            
            if (!empty($patterns) && !empty($replacements)) {
                foreach ($commands_array as &$command_element) $command_element = preg_replace($patterns, $replacements, $command_element);
            }
        }
        
        return $commands_array;
    }
    
}
