<?php
/**
 * Console command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsConsoleCommandHelper
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
    static public $default_aliases = array(
        'll' => 'ls -l',
    );
    
    /**
     * default commands
     */
    static public $default_commands = 'sf appflower afs git batch man ll ls pwd cat mkdir rm cp mv touch chmod free df find clear php';
    
    /**
     * Getting commands list
     *
     * @param boolean $explode 
     * @return mixed - string or array
     * @author Sergey Startsev
     */
    static public function getCommands($explode = true)
    {
        $commands = sfConfig::get(self::CONFIG_COMMANDS, self::$default_commands);
        
        return ($explode) ? explode(' ', $commands) : $commands;
    }
	
	/**
	 * Getting aliases 
	 *
	 * @return array
	 * @author Sergey Startsev
	 */
    static public function getAliases()
    {
        return sfConfig::get(self::CONFIG_ALIASES, self::$default_aliases);
    }
    
}
