<?php
/**
 * Base studio console command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseConsoleCommand
{
    /**
     * Application config identificator for command line interface
     */
    const CONFIG_CLI = 'app_afStudio_console_cli'; 
    
    /**
     * Command prefix 
     */
    protected $prefix;
    
    /**
     * Entered command
     */
    protected $command;
    
    /**
     * Current user prompt
     */
    protected $prompt;
    
    /**
     * last executed command status
     */
    private $last_executed_status;
    
    /**
     * Main method - execution setted command
     *
     * @return string
     * @author Sergey Startsev
     */
    public final function execute()
    {
        $command = $this->prepare();
        
        $result = array();
        
        if (empty($command)) {
            if (!method_exists($this, 'getDescription')) {
                throw new afsBaseConsoleCommandException("If command empty - you should define getDescription method");
            }
            $result[] = $this->getDescription();
        } else {
            // execute 
            ob_start();
            passthru($command . ' 2>&1', $status);
            $raw = ob_get_clean();
            
            // getting command execute code
            $this->last_executed_status = $status;
            
            if ($status > 0) {
                $result[] = $this->render($command) . afsRenderConsoleCommand::render($raw, array('class' => 'afStudio_result_command'));
            } else {
                $arr = explode("\n", $raw);
                $result[] = $this->render($command);
                
                foreach ($arr as $a) $res[] = afsRenderConsoleCommand::render($a, array('class' => 'afStudio_result_command'));
                
                if ($res) $result[] = implode('', $res);
            }
        }
        
        return $result;
    }
    
    /**
     * Set command accessor
     *
     * @param string $command 
     * @return afsBaseConsoleCommand
     * @author Sergey Startsev
     */
    public function setCommand($command)
    {
        $this->command = $command;
        
        return $this;
    }
    
    /**
     * Get command accessor
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getCommand()
    {
        return $this->command;
    }
    
    /**
     * Getting prefix
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPrefix()
    {
        return $this->prefix;
    }
    
    /**
     * Setting prompt
     *
     * @param string $prompt 
     * @return afsBaseConsoleCommand
     * @author Sergey Startsev
     */
    public function setPrompt($prompt)
    {
        $this->prompt = $prompt;
        
        return $this;
    }
    
    /**
     * Getting prompt 
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPrompt()
    {
        return $this->prompt;
    }
    
    /**
     * Getting last executed command status
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function getLastStatus()
    {
        return $this->last_executed_status === 0;
    }
    
    /**
     * Getting command line interface
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getCli()
    {
        return ($cli = sfConfig::get(self::CONFIG_CLI)) ? $cli : sfToolkit::getPhpCli();
    }
    
    /**
     * Delegate render to afsRenderConsoleCommand class
     *
     * @param string $content 
     * @param array $attributes 
     * @param string $tag 
     * @return string
     * @author Sergey Startsev
     */
    protected function render($content, array $attributes = array('class' => 'afStudio_command_user'), $tag = afsRenderConsoleCommand::DEFAULT_TAG)
    {
        return afsRenderConsoleCommand::render("{$this->getPrompt()}{$content}", $attributes, $tag);
    }
    
    /**
     * Prepare method - should return string - prepared command for execute
     *
     * @return string - prepared command
     * @author Sergey Startsev
     */
    abstract protected function prepare();
    
}
