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
     * @return void
     * @author Sergey Startsev
     */
    protected function addMessage($message)
    {
        $this->messages[] = $message;
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
