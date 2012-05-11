<?php 

namespace AppFlower\Studio\Integrity\Rule;

/**
 * Base integrity rule class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class Base
{
    /**
     * Execute method prefix
     */
    const PRE_EXECUTOR_NAME = 'execute';
    
    /**
     * Autofix execute method prefix
     */
    const PRE_AUTOFIX_NAME = 'autofix';
    
    /**
     * Flag should be used autofix or not
     *
     * @var boolean
     */
    private $use_autofix = true;
    
    /**
     * Messages
     *
     * @var array
     */
    private $messages = array();
    
    /**
     * Impaired actions
     *
     * @var array
     */
    private $impaired_actions = array();
    
    /**
     * Getting messages 
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getMessages()
    {
        $messages = array();
        foreach ($this->messages as $message) {
            $messages = array_merge($messages, $message);
        }
        
        return $messages;
    }
    
    /**
     * Getting impaired actions list
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getImpairedActions()
    {
        return $this->impaired_actions;
    }
    
    /**
     * Should be used autofix or not
     *
     * @param boolean $flag 
     * @return Base
     * @author Sergey Startsev
     */
    public function useAutofix($flag = true)
    {
        $this->use_autofix = (bool) $flag;
        
        return $this;
    }
    
    /**
     * Execute rules functionality
     *
     * @param array $methods
     * @return Base
     * @author Sergey Startsev
     */
    final public function execute(array $methods = array())
    {
        foreach ($this->getMethods($methods) as $method) {
            if (substr($method->getName(), 0, strlen(self::PRE_EXECUTOR_NAME)) !== self::PRE_EXECUTOR_NAME) continue;
            
            $raw_name = substr($method->getName(), strlen(self::PRE_EXECUTOR_NAME));
            
            $method->setAccessible(true);
            $method->invoke($this);
            
            if ($this->use_autofix && in_array($raw_name, $this->getImpairedActions()) && $this->doAutofix($raw_name)) {
                if (false !== ($action_position = array_search($raw_name, $this->impaired_actions))) {
                    unset($this->impaired_actions[$action_position]);
                }
                if (array_key_exists($raw_name, $this->messages)) unset($this->messages[$raw_name]);
                
                $method->invoke($this);
            }
        }
        
        return $this;
    }
    
    /**
     * Getting rule method name
     *
     * @param string $method 
     * @param boolean $is_humanize 
     * @return string
     * @author Sergey Startsev
     */
    protected function getMethodName($method, $is_humanize = false)
    {
        $pos = strpos($method, self::PRE_EXECUTOR_NAME);
        if (is_bool($pos)) return '';
        
        $name = substr($method, $pos + strlen(self::PRE_EXECUTOR_NAME), strlen($method) - ($pos + strlen(self::PRE_EXECUTOR_NAME)));
        
        if ($is_humanize) $name = \sfInflector::humanize(\sfInflector::underscore($name));
        
        return $name;
    }
    
    /**
     * Adding message to list 
     *
     * @param string $message 
     * @param string $assignee
     * @return void
     * @author Sergey Startsev
     */
    protected function addMessage($message, $assignee = null)
    {
        $method_name = (is_null($assignee) && ($trace = debug_backtrace())) ? $trace[1]["function"] : $assignee;
        $method_name = (substr($method_name, 0, 7)) ? substr($method_name, 7) : $method_name;
        $this->impaired_actions[] = $method_name;
        
        $this->messages[$method_name][] = $message;
    }
    
    /**
     * Do autofix functionality
     *
     * @param string $method_name 
     * @return boolean  (true - autofix has been found and executed, false - autofix method wasn't found)
     * @author Sergey Startsev
     */
    private function doAutofix($method_name)
    {
        $reflection = new \ReflectionClass(get_class($this));
        
        $autofix_name = self::PRE_AUTOFIX_NAME . ucfirst($method_name);
        if (!$reflection->hasMethod($autofix_name)) return false;
        
        $autofix_method = $reflection->getMethod($autofix_name);
        
        $autofix_method->setAccessible(true);
        $autofix_method->invoke($this);
        
        return true;
    }
    
    /**
     * Getting methods reflections
     *
     * @param array $methods 
     * @return array
     * @author Sergey Startsev
     */
    private function getMethods(array $methods = array())
    {
        $reflection = new \ReflectionClass(get_class($this));
        
        if (empty($methods)) return $reflection->getMethods(\ReflectionMethod::IS_PROTECTED);
        
        $methods_names = array();
        if (!empty($methods)) {
            foreach ($methods as $method) {
                if (!method_exists(get_class($this), self::PRE_EXECUTOR_NAME . ucfirst($method))) continue;
                $methods_names[] = $reflection->getMethod(self::PRE_EXECUTOR_NAME . ucfirst($method));
            }
        }
        
        return (array)$methods_names;
    }
    
}
