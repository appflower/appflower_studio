<?php
/**
 * Base definition class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseDefinition
{
    /**
     * Packed definition status
     */
    const STATUS_PACKED = 'packed';
    
    /**
     * Unpacked definition status
     */
    const STATUS_UNPACKED = 'unpacked';
    
    /**
     * Definition name
     */
    protected $definition_name = null;
    
    /**
     * Definition
     */
    protected $definition;
    
    /**
     * Current status 
     */
    protected $status = null;
    
    public function __construct() {}
    
    /**
     * Getting model name, model_name - abstract property that should be declarated in all models
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getDefinitionName()
    {
        if (is_null($this->definition_name)) {
            throw new afsBaseDefinitionException("Definition name property should be declarated in definition class");
        }
        
        return $this->definition_name;
    }
    
    /**
     * Get result, get definition alias
     *
     * @return mixed
     * @author Sergey Startsev
     */
    public function get()
    {
        return $this->getDefinition();
    }
    
    /**
     * Checking is packed status
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function isPacked()
    {
        return $this->isStatus(self::STATUS_PACKED);
    }
    
    /**
     * Checking is unpacked status
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function isUnpacked()
    {
        return $this->isStatus(self::STATUS_UNPACKED);
    }
    
    /**
     * Initialize definition with response of current instance
     *
     * @param string $definition 
     * @return afsBaseDefinition
     * @author Sergey Startsev
     */
    public function init($definition)
    {
        $this->setDefinition($definition);
        
        return $this;
    }
    
    /**
     * Packing definition
     *
     * @return afsBaseDefinition
     * @author Sergey Startsev
     */
    public function pack()
    {
        if ($this->isPacked() || !is_array($this->getDefinition())) {
            throw new afsBaseDefinitionException("Definition already packed");
        }
        
        $definition = $this->doPack($this->getDefinition());
        $this->setDefinition($definition);
        
        $this->setStatus(self::STATUS_PACKED);
        
        return $this;
    }
    
    /**
     * Unpacking definition
     *
     * @return afsBaseDefinition
     * @author Sergey Startsev
     */
    public function unpack()
    {
        if ($this->isUnpacked() || is_array($this->getDefinition())) {
            throw new afsBaseDefinitionException("Definition already unpacked");
        }
        
        // call reloaded unpack method
        $definition = $this->doUnpack($this->getDefinition());
        
        if (!is_array($definition)) {
            throw new afsBaseDefinitionException("'doUnpack' should return array");
        }
        $this->setDefinition($definition);
        
        $this->setStatus(self::STATUS_UNPACKED);
        
        return $this;
    }
    
    /**
     * Validate definition
     *
     * @return mixed
     * @author Sergey Startsev
     */
    public function validate()
    {
        $status = $this->getStatus();
        if (is_null($status)) {
            throw new afsBaseDefinitionException("Actions not processed with definition");
        }
        
        $status = ucfirst(strtolower($status));
        $validator_name = "doValidate{$status}";
        
        if (!method_exists($this, $validator_name)) {
            throw new afsBaseDefinitionException("Method '{$validator_name}' not defined in '{$this->getDefinitionName()}' definition class");
        }
        
        // call delegated validators
        return call_user_func(array($this, $validator_name));
    }
    
    /**
     * Getting definition
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function getDefinition()
    {
        return $this->definition;
    }
    
    /**
     * Setting definition
     *
     * @param mixed $definition 
     * @author Sergey Startsev
     */
    protected function setDefinition($definition)
    {
        $this->definition = $definition;
    }
    
    /**
     * Get current status
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getStatus()
    {
        return $this->status;
    }
    
    /**
     * Setting status
     *
     * @param string $status 
     * @author Sergey Startsev
     */
    protected function setStatus($status)
    {
        $this->status = $status;
    }
    
    /**
     * Checking status
     *
     * @param string $status 
     * @return boolean
     * @author Sergey Startsev
     */
    protected function isStatus($status)
    {
        return ($this->getStatus() == $status);
    }
    
    /**
     * Pack definition
     *
     * @return mixed
     * @author Sergey Startsev
     */
    abstract protected function doPack(Array $definition);
    
    /**
     * Unpack initialized definition to array
     *
     * @return array
     * @author Sergey Startsev
     */
    abstract protected function doUnpack($definition);
    
}
