<?php
/**
 * Base view model class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseModel
{
    /**
     * Model name 
     * 
     * @var string
     */
    protected $model_name = null;
    
    /**
     * Is new object of model
     *
     * @var boolean
     */
    protected $_new = true;
    
    /**
     * Definition in array format
     *
     * @var array
     */
    protected $definition;
    
    public function __construct() {}
    
    /**
     * Check is instance new or not
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function isNew()
    {
        return $this->_new;
    }
    
    /**
     * Setting instance status
     *
     * @param string $b 
     * @return boolean
     * @author Sergey Startsev
     */
    public function setNew($b)
	{
		$this->_new = (boolean) $b;
	}
    
    /**
     * Getting definition
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getDefinition()
    {
        return $this->definition;
    }
    
    /**
     * Setting definition
     *
     * @param Array $definition 
     * @author Sergey Startsev
     */
    public function setDefinition(Array $definition)
    {
        $this->definition = $definition;
    }
    
    /**
     * Getting model name, model_name - abstract property that should be declarated in all models
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getModelName()
    {
        if (is_null($this->model_name)) {
            throw new afsBaseModelException("Model name property should be declarated in model class");
        }
        
        return $this->model_name;
    }
    
    /**
     * Getting modifier
     *
     * @param string $name 
     * @return void
     * @author Sergey Startsev
     */
    protected function getModifier($name)
    {
        $model = $this->getModelName();
        $modifier = 'afs' . ucfirst(strtolower($model)) . ucfirst(strtolower($name)) . 'Modifier';
        
        if (!class_exists($modifier)) {
            throw new afsBaseModelException("I dont know which concrete builder class to use for widget type: {$modifier}");
        }
        
        $modifier = new $modifier;
        
        return $modifier;
    }
    
}
