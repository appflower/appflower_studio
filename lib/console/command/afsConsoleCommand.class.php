<?php 
/**
 * Console command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsConsoleCommand
{
    /**
     * Default command 
     */
    const DEFAULT_COMMAND = 'default';
    
    /**
     * Don't need to create self instance - private constructor
     *
     * @author Sergey Startsev
     */
    private function __construct() {}
    
    /**
     * Fabric method - creates command class from given command 
     *
     * @param string $command 
     * @return afsBaseCommandConsole
     * @author Sergey Startsev
     */
    static public function create($command)
    {
        $command_class = self::getCommandClassName(self::getCommandName($command));
        
        if (!class_exists($command_class)) {
            $command_class = self::getCommandClassName('default');
        }
        
        $command_reflection = new ReflectionClass($command_class);
        $command_instance = $command_reflection->newInstance();
        $command_instance->setCommand($command);
        
        return $command_instance;
    }
    
    /**
     * Getting class name from given command name
     *
     * @param string $name 
     * @return string
     * @author Sergey Startsev
     */
    static public function getCommandClassName($name)
    {
        return "afs" . ucfirst($name) . "ConsoleCommand";
    }
    
    /**
     * Getting command name from given command
     *
     * @param string $command 
     * @return string
     * @author Sergey Startsev
     */
    static public function getCommandName($command)
    {
        return (preg_match('/(\w+)(?:\s|).*?/si', $command, $matched)) ? $matched[1] : self::DEFAULT_COMMAND;
    }
    
}
