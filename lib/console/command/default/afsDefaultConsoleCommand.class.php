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
        return (in_array(afsConsoleCommand::getCommandName($this->getCommand()), afsConsoleCommandHelper::create()->getCommands())) ? $this->getCommand() : '';
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
            $this->render($this->getPrefix() . $this->getCommand()), afStudioConsole::getCommands(false)
        );
        
        return $result;
    }
    
}
