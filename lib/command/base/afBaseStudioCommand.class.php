<?php
/**
 * Base Studio Command class
 * 
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afBaseStudioCommand
{
    /**
     * Result of executing command
     */
	protected $result = null;
    
    /**
     * Command will be executed
     */
    protected $cmd;
    
    /**
     * Parameters 
     */
    protected $params;
    
	public function __construct($command = '', $params = array())
	{		
		$this->cmd = $command;
        $this->params = $params;
	}
	
    /**
     * Separate to different controllers part
     * 
     * @return mixed
     * @author Sergey Startsev
     */
	public function process()
	{
		if($this->cmd != null) {
			$controller_name = 'process' . ucfirst($this->cmd);
            
            if (method_exists($this, $controller_name)) {
                call_user_func(array($this, $controller_name));
            } else {
                throw new afStudioCommandException("Controller: '{$controller_name}' not defined");
            }
            
            return $this->result;
		} else {
		    return false;
		}
	}
    
    /**
     * Setting command
     * 
     * @param string $cmd - command name
     * @author Sergey Startsev
     */
    public function setCommand($cmd)
    {
        $this->cmd = $cmd;
    }
    
    /**
     * Getting current command
     * 
     * @return string
     * @author Sergey Startsev
     */
    public function getCommand()
    {
        return $this->cmd;
    }
    
    /**
     * Getting parameters 
     * 
     * @param string $name
     * @param mixed $default
     * @return mixed
     * @author Sergey Startsev
     */
    protected function getParameter($name, $default = false)
    {
        return isset($this->params[$name]) ? $this->params[$name] : $default;
    }
    
    
    /**
     * Fetching error, prepare for output
     */
    protected function fetchError($content, $console = false)
    {
        return $this->fetch($content, false, $console);
    }
    
    /**
     * Fetching success, prepare for output
     */
    protected function fetchSuccess($content, $console = false)
    {
        return $this->fetch($content, true, $console);
    }
    
    /**
     * Fetching output
     */
    protected function fetch($content, $success, $console)
    {
        $return = array('success' => $success, 'content' => $content);
        
        if($console)
        {
        	$return = array_merge($return, array('console'=>$console));
        }
        
        return $return;
    }
}
