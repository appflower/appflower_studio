<?php
/**
 * Base model validator class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseModelValidator
{
    /**
     * First part name of validate methods
     */
    const PRE_EXECUTOR_NAME = 'validate';
    
    /**
     * Default error message
     */
    const DEFAULT_ERROR = 'Some error occured. Please check definition';
    
    /**
     * Message string presentation error name tag style
     */
    const MESSAGE_STRING_ERROR_NAME_STYLE = 'b';
    
    /**
     * Message string separator symbol
     */
    const MESSAGE_STRING_SEPARATOR_SYMBOL = '<br />';
    
    /**
     * Model instance
     *
     * @var afsBaseModel
     */
    protected $model = null;
    
    /**
     * Messages when validation processed
     *
     * @var array
     */
    protected $messages = array();
    
    /**
     * Validate status
     *
     * @var boolean
     */
    protected $status = true;
    
    /**
     * Getting is valid info
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function isValid()
    {
        return (bool) $this->status;
    }
    
    /**
     * Getting messages
     *
     * @param boolean $as_string 
     * @return mixed
     * @author Sergey Startsev
     */
    public function getMessages($as_string = false)
    {
        if (!$as_string) return $this->message;
        
        $messages = '';
        foreach ($this->messages as $error_name => $message) {
            $messages .=    $this->prepareErrorName($error_name) . self::MESSAGE_STRING_SEPARATOR_SYMBOL . 
                            $message . self::MESSAGE_STRING_SEPARATOR_SYMBOL . self::MESSAGE_STRING_SEPARATOR_SYMBOL;
        }
        $messages = rtrim($messages, self::MESSAGE_STRING_SEPARATOR_SYMBOL);
        
        return $messages;
    }
    
    /**
     * Executor method
     *
     * @return afsBaseModelValidator
     * @author Sergey Startsev
     */
    public function execute()
    {
        $this->status = true;
        $errors = array();
        
        foreach (get_class_methods($this) as $method) {
            if (substr($method, 0, strlen(self::PRE_EXECUTOR_NAME)) !== self::PRE_EXECUTOR_NAME) continue;
            
            $response = call_user_func(array($this, $method));
            if (!is_string($response) && !is_bool($response)) throw new afsBaseModelValidatorException("Validator should return string in case error or boolean");
            
            $status = (is_bool($response)) ? $response : false;
            
            if (!$status) {
                $error_name = $this->getMethodName($method, true);
                $errors[$error_name] = (is_string($response)) ? $response : self::DEFAULT_ERROR;
            }
        }
        
        if (!empty($errors)) {
            $this->status = false;
            $this->messages = $errors;
        }
        
        return $this;
    }
    
    /**
     * Getting model instance
     *
     * @return afsBaseModel
     * @author Sergey Startsev
     */
    protected function getModel()
    {
        if (is_null($this->model)) throw new afsBaseModelValidatorException("Model property should be defined");
        
        return $this->model;
    }
    
    /**
     * Getting definition
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function getDefinition()
    {
        $definition = $this->getModel()->getDefinition();
        if (!is_array($definition)) throw new afsBaseModelValidatorException("Wrong definition type - should be array");
        
        return $definition;
    }
    
    /**
     * Getting validate method name
     *
     * @param string $method 
     * @param boolean $is_humanize 
     * @return string
     * @author Sergey Startsev
     */
    protected function getMethodName($method, $is_humanize = false)
    {
        $name = substr($method, strlen(self::PRE_EXECUTOR_NAME), strlen($method) - strlen(self::PRE_EXECUTOR_NAME));
        
        if ($is_humanize) $name = sfInflector::humanize(sfInflector::underscore($name));
        
        return $name;
    }
    
    /**
     * Prepare error name
     *
     * @param string $error_name 
     * @return string
     * @author Sergey Startsev
     */
    protected function prepareErrorName($error_name)
    {
        return '<' . self::MESSAGE_STRING_ERROR_NAME_STYLE . '>' . $error_name . '</' . self::MESSAGE_STRING_ERROR_NAME_STYLE . '>';
    }
    
}
