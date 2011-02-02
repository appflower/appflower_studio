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
    
	public function __construct($command = '')
	{		
		$this->cmd = $command;
	}
	
    /**
     * Separate to different controllers part
     */
	public function process()
	{
		// $cmd = $this->request->getParameterHolder()->has('cmd') ? $this->request->getParameterHolder()->get('cmd') : null;
			
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
    
}
?>
