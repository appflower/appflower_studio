<?php
/**
 * Studio console class
 * 
 * @package appFlowerStudio
 * @author Radu Topala <radu@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioConsole
{
    /**
     * Current working directory 
     */
    public $pwd;
    
    /**
     * Uname system
     */
    public $uname;
    
    /**
     * Short uname
     */
    public $uname_short;
    
    /**
     * Current prompt
     */
    public $prompt;
    
    /**
     * Whoami
     */
    public $whoami;
    
    /**
     * Last executed command status
     */
    private $lastExecReturnCode;
    
    /**
     * Class instance
     */
    static private $instance = null;
    
    public function __construct() 
    {
        $this->uname = $this->getUname(false);
        $this->uname_short = $this->getUname(true);
        
        $this->prompt = $this->getPrompt();
    }
    
    /**
     * Retrieve the instance of this class.
     * 
     * @return afStudioConsole
     */
    static public function getInstance()
    {
        if (!isset(self::$instance)) {
          self::$instance = new self;
        }
        
        return self::$instance;
    }
    
    /**
     * Getting commands - delegate method
     *
     * @param boolean $explode 
     * @return mixed
     * @author Sergey Startsev
     */
    static public function getCommands($explode = true)
    {
        return afsConsoleCommandHelper::getCommands($explode);
    }
    
    /**
     * Getting command aliases - delegate method
     *
     * @return array
     * @author Sergey Startsev
     */
    static public function getAliases()
    {
        return afsConsoleCommandHelper::getAliases();
    }
    
    /**
     * Execute command - delegates call execute command to afsConsoleCommand class
     *
     * @param mixed $commands - array(multiple commands) or string(single command)
     * @return string
     * @author Sergey Startsev
     */
    public function execute($commands)
    {
        if ($commands != 'start') {
			$aCommands = (!is_array($commands)) ? (array) $commands : $commands;
            
            $result = array();
            foreach ($aCommands as $command) {
                $command_instance = afsConsoleCommand::create($command)->setPrompt($this->getPrompt());
                $result = array_merge($result, $command_instance->execute());
                
                $this->lastExecReturnCode = $command_instance->getLastStatus();
            }
        } else {
            $result = $this->getDescription();
        }
        
        return implode('', $result);
    }
    
    /**
     * Getting description
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getDescription()
    {
        $rows = array(
            "Logged as {$this->getWhoami()} on {$this->getUname()}",
            str_repeat("-", 20),
            "Current working directory : {$this->getPwd()}",
            "Commands Available :",
            "<strong>" . afsConsoleCommandHelper::getCommands(false) . "</strong>",
            "Symfony commands can be run by prefixing with sf<br />Example: sf cc ( clear cache )",
            "AppFlower Studio tasks commands can be run by prefixing with afs<br />Example: afs fix-perms ( fixes the permissions needed by the Studio )",
            str_repeat("-", 20),
        );
        
        $result = array();
        foreach ($rows as $row) $result[] = afsRenderConsoleCommand::render($row);
        
        return $result;
    }
    
    /**
     * Getting last command status code
     *
     * @return boolean
     * @author Łukasz Wojciechowski
     */
    public function wasLastCommandSuccessfull()
    {
        return $this->lastExecReturnCode;
    }
    
    /**
     * Getting Whoami description
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getWhoami()
    {
        if (empty($this->whoami)) {
            if (afsConsoleHelper::isUnixLikeOs()) {
                $whoami = afsFileSystem::create()->execute('whoami');
                $this->whoami = (strlen($whoami[1]) == 0) ? trim($whoami[0]) : 'unknown_user';
            }
        }
        
        return $this->whoami;
    }
    
    /**
     * Getting pwd command result
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPwd()
    {
        if (empty($this->pwd)) {
            if (afsConsoleHelper::isUnixLikeOs()) {
                $pwd = afsFileSystem::create()->execute('pwd');
                $this->pwd = (strlen($pwd[1]) == 0) ? $pwd[0] : '';
            }
        }
        
        return $this->pwd;
    }
    
    /**
     * Getting uname
     *
     * @param boolean $short 
     * @return string
     * @author Sergey Startsev
     */
    public function getUname($short = false)
    {
        return ($short) ? php_uname('n') : php_uname();
    }
    
    /**
     * Getting prompt
     *
     * @return string
     * @author Sergey Startsev
     */
    private function getPrompt()
    {
        if (empty($this->prompt)) {
            $this->prompt = $this->getWhoami() . '@' . $this->getUname(true) . ':' . '~/' . afStudioUtil::unRootify($this->getPwd()) . '$&nbsp;';
        }
        
        return $this->prompt;
    }
    
}
