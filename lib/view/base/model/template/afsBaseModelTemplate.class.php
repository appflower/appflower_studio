<?php
/**
 * Base model template class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseModelTemplate 
{
    /**
     * Templates folder, near current folder
     */
    const TEMPLATE_FOLDER = 'templates';
    
    /**
     * Template type class
     */
    const TEMPLATE_TYPE_CLASS = 'class';
    
    /**
     * Template postfix
     */
    const TEMPLATE_POSTFIX = 'template';
    
    /**
     * Parameters container
     */
    protected $params = array();
    
    /**
     * Content
     */
    protected $content;
    
    /**
     * Adding parameter to template renderer, alias for addParameter with return current object
     *
     * @param string $name 
     * @param string $value 
     * @return afsBaseModelTemplate
     * @author Sergey Startsev
     */
    public function add($name, $value)
    {
        $this->addParameter($name, $value);
        
        return $this;
    }
    
    /**
     * Adding parameter to template renderer.
     *
     * @param string $name 
     * @param string $value 
     * @author Sergey Startsev
     */
    public function addParameter($name, $value)
    {
        if ($this->hasParameter($name)) {
            throw new afsBaseModelTemplateException("Parameter '{$name}' already exists");
        }
        
        $this->params[$name] = $value;
    }
    
    /**
     * Getting parameters, can be processed with default parameter, if needed parameter doesn't exists
     * 
     * @param string $name
     * @param mixed $default
     * @return mixed
     * @author Sergey Startsev
     */
    public function getParameter($name, $default = null)
    {
        return ($this->hasParameter($name)) ? $this->params[$name] : $default;
    }
    
    /**
     * Checking exists parameter or not
     *
     * @param string $name 
     * @return boolean
     * @author Sergey Startsev
     */
    public function hasParameter($name)
    {
        return array_key_exists($name, $this->params);
    }
    
    /**
     * Getting processed data, alias for getContent
     *
     * @return string
     * @author Sergey Startsev
     */
    public function get()
    {
        return $this->getContent();
    }
    
    /**
     * Set content 
     *
     * @param string $content 
     * @author Sergey Startsev
     */
    public function setContent($content)
    {
        $this->content = $content;
    }
    
    /**
     * Getting content method
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getContent()
    {
        return $this->content;
    }
    
    /**
     * Renderer functionality
     *
     * @param string $file 
     * @return afsBaseModelTemplate
     * @author Sergey Startsev
     */
    public function render($file)
    {
        if (!file_exists($file)) {
            throw new afsBaseModelTemplateException("File '{$file}' doesn't exists");
        }
        
        extract($this->params);
        
        ob_start();
        ob_implicit_flush(0);

        try {
          require_once($file);
        } catch (Exception $e) {
          ob_end_clean();
          throw $e;
        }

        $this->content = ob_get_clean();
        
        return $this;
    }
    
    /**
     * Wrap via delegated call
     *
     * @param string $type 
     * @return afsBaseModelTemplate
     * @author Sergey Startsev
     */
    public function wrap($type)
    {
        $wrapper_name = 'wrap' . ucfirst(strtolower($type));
        if (method_exists($this, $wrapper_name)) {
            $content = call_user_func(array($this, $wrapper_name));
        } else {
            throw new afsBaseModelTemplateException("Wrapper: '{$wrapper_name}' not defined");
        }
        
        return $this;
    }
    
    /**
     * Php wrapper method
     *
     * @author Sergey Startsev
     */
    protected function wrapPhp()
    {
        $this->setContent("<" . "?php\n" . $this->getContent());
    }
    
    /**
     * Getting template path
     *
     * @param string $name 
     * @param string $type - template type
     * @param string $postfix - extension (example: class)
     * @return string
     * @author Sergey Startsev
     */
    protected function getTemplatePath($name, $type = self::TEMPLATE_TYPE_CLASS, $postfix = self::TEMPLATE_POSTFIX)
    {
        $reflection = new ReflectionClass(get_class($this));
        
        return dirname($reflection->getFileName()) . DIRECTORY_SEPARATOR. self::TEMPLATE_FOLDER . DIRECTORY_SEPARATOR . "{$name}.{$type}.{$postfix}";
    }
    
}
