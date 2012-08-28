<?php

namespace AppFlower\Studio\Integrity;

/**
 * Integrity functionality
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Integrity
{
    /**
     * Is integrity of system impaired or not
     *
     * @var boolean
     */
    private $is_impaired = false;
    
    /**
     * Messages where impaired integrity
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
     * Fabric method creator
     *
     * @return Integrity
     * @author Sergey Startsev
     */
    static public function create()
    {
        return new self;
    }
    
    /**
     * Private constructor
     *
     * @author Sergey Startsev
     */
    private function __construct() {}
    
    /**
     * Check integrity functionality
     * 
     * @example Integrity::create()->check();
     *          Integrity::create()->check(
     *              Rule\Config\Config::create()
     *                  ->add(Rule\Config\Crumb::create('Model'))
     *                  ->add(Rule\Config\Crumb::create('Permissions'))
     *          );
     *          Integrity::create()->check(
     *              IntegrityConfig\Config::create()
     *                  ->add(Rule\Config\Crumb::create('Model')->addExecutor(Rule\Config\Executor\Executor::create('schemaChecking')))
     *          );
     * 
     * @param  Rule\Config\Config config instance
     * @return Integrity
     * @author Sergey Startsev
     */
    public function check(Rule\Config\Config $config = null)
    {
        $message = array();
        $rules = call_user_func('AppFlower\Studio\Integrity\Helper::getRules', $config);
        
        foreach ($rules as $rule => $rule_methods) {
            $reflection = new \ReflectionClass("AppFlower\Studio\Integrity\Rule\\$rule\\$rule");
            $instance = $reflection->newInstance();
            $rule_instance = $instance->execute($rule_methods);
            $impaired_actions = $rule_instance->getImpairedActions();
            
            if (!empty($impaired_actions)) {
                $this->messages[$rule] = $rule_instance->getMessages();
                $this->impaired_actions[$rule] = $impaired_actions;
            }
        }
        
        if (!empty($this->messages)) $this->is_impaired = true;
        
        return $this;
    }
    
    /**
     * Get messages 
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getMessages()
    {
        return $this->messages;
    }
    
    /**
     * Checking is impaired integrity
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function isImpaired()
    {
        return (bool)$this->is_impaired;
    }
    
    /**
     * Render delegator
     *
     * @param string $type 
     * @return string
     * @author Sergey Startsev
     */
    public function render($type = Renderer\Helper::TYPE_HTML)
    {
        return Renderer\Renderer::create($this)->render($type);
    }
    
}
