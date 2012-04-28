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
        return $this->messages;
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
            
            $method->setAccessible(true);
            $response = $method->invoke($this);
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
        $this->messages[] = $message;
        
        $method_name = (is_null($assignee) && ($trace = debug_backtrace())) ? $trace[1]["function"] : $assignee;
        $this->impaired_actions[] = (substr($method_name, 0, 7)) ? substr($method_name, 7) : $method_name;
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
