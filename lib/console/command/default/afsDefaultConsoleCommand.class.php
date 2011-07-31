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
        $parts = explode(" ", $this->getCommand());
        $parts[0] = afStudioUtil::getValueFromArrayKey(afsConsoleCommandHelper::getAliases(), $parts[0], $parts[0]);
        
        $command = implode(" ", $parts);
        $parts = explode(" ", $command);
        $command = afStudioUtil::getValueFromArrayKey(afsConsoleCommandHelper::getAliases(), $command, $command);
        
        $exec = '';
        if (in_array($parts[0], afsConsoleCommandHelper::getCommands())) {
            $exec = sprintf('%s', $command);
        }
        
        return $exec;
    }
    
    /**
     * Getting description if command empty
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getDescription()
    {
        $result = sprintf(
            "%s<li>This command is not available. You can do : <strong>%s</strong></li>",
            $this->render($this->getPrefix() . $this->getCommand()), afsConsoleCommandHelper::getCommands(false)
        );
        
        return $result;
    }
    
}
