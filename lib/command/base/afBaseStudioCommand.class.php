<?php
/**
 * @author startsev.sergey@gmail.com
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
     */
	public function process()
	{
		if($this->cmd != null) {
			$controller_name = 'process' . ucfirst(strtolower($this->cmd));
            
            if (method_exists($this, $controller_name)) {
                call_user_func(array($this, $controller_name));
            } else {
                throw new Exception("Controller: '{$controller_name}' not defined");
            }
            
            return $this->result;
		} else {
		    return false;
		}
	}
    
    /**
     * Setting command
     * 
     * @param $cmd String - command name
     */
    public function setCommand($cmd)
    {
        $this->cmd = $cmd;
    }
    
    /**
     * Getting current command
     * 
     * @return string
     */
    public function getCommand()
    {
        return $this->cmd;
    }
    
    /**
     * Getting parameters 
     */
    protected function getParameter($name)
    {
        if (isset($this->params[$name])) {
            return $this->params[$name];
        } else {
            return false;
        }
    }
    
    /**
     * Fetching error, prepare for output
     */
    protected function fetchError($content)
    {
        return $this->fetch($content, false);
    }
    
    /**
     * Fetching success, prepare for output
     */
    protected function fetchSuccess($content)
    {
        return $this->fetch($content, true);
    }
    
    /**
     * Fetching output
     */
    protected function fetch($content, $success)
    {
        return array('success' => $success, 'content' => $content);
    }
}
?>
