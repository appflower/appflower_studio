<?php

require_once dirname(__DIR__) . '/vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'AppFlower\Studio' => dirname(__DIR__) . '/vendor',
));
$loader->register();

use AppFlower\Studio\Session\Session;

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
    private $pwd;
    
    /**
     * Uname system
     */
    private $uname;
    
    /**
     * Short uname
     */
    private $uname_short;
    
    /**
     * Current prompt
     */
    private $prompt;
    
    /**
     * Whoami
     */
    private $whoami;
    
    /**
     * Last executed command status
     */
    private $lastExecReturnCode;
    
    /**
     * Class instance
     */
    static private $instance = null;
    
    /**
     * Private constructor
     */
    private function __construct() {}
    
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
    static public function getCommands($as_array = true)
    {
        $commands = afsConsoleCommandHelper::create()->getCommands();
        
        return (!$as_array) ? implode(' ', $commands) : $commands;
    }
    
    /**
     * Getting command aliases - delegate method
     *
     * @return array
     * @author Sergey Startsev
     */
    static public function getAliases()
    {
        return afsConsoleCommandHelper::create()->getAliases();
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
            if (!afsConsoleCommandHelper::create()->hasDeprecated($aCommands)) {
                $aCommands = afsConsoleCommandHelper::create()->prepare($aCommands);
                
                foreach ($aCommands as $command) {
                    foreach (afsConsoleCommandHelper::create()->getSubCommands($command) as $sub_command) {
                        $command_instance = afsConsoleCommand::create($sub_command)->setPrompt($this->getPrompt());
                        $result = array_merge($result, $command_instance->execute());
                        
                        $this->lastExecReturnCode = $command_instance->getLastStatus();
                    }
                }
            } else {
                $result[] = afsRenderConsoleCommand::render("Some commands that you wanna execute has been deprecated");
                $result[] = afsRenderConsoleCommand::render("Deprecated commands: " . implode(', ', afsConsoleCommandHelper::create()->getDeprecated()));
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
            "<strong>" . $this->getCommands(false) . "</strong>",
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
            $session = new Session();
            if ($session->get('pwd')) {
                $this->pwd = $session->get('pwd');
            }
        }
        
        return $this->pwd;
    }

    /**
     * Setting pwd value
     *
     * @author Michal Piotrowski
     */
    public function setPwd($pwd)
    {
        $this->pwd = $pwd;
        $session = new Session();
        $session->set('pwd', $pwd);
    }

    /**
     * Getting uname
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getUname()
    {
        if (empty($this->uname)) {
            $this->uname = php_uname();
        }
        
        return $this->uname;
    }
    
    /**
     * Getting short uname
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getUnameShort()
    {
        if (empty($this->uname_short)) {
            $this->uname_short = php_uname('n');
        }
        
        return $this->uname_short;
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
            $this->prompt = $this->getWhoami() . '@' . $this->getUnameShort() . ':' . '~/' . afStudioUtil::unRootify($this->getPwd()) . '$&nbsp;';
        }
        
        return $this->prompt;
    }
    
}
