<?php 

namespace AppFlower\Studio\Integrity\Renderer;

use AppFlower\Studio\Integrity\Integrity as Integrity;

/**
 * Integrity renderer class
 *
 * @package appFlowerStudio
 * @subpackage Renderer
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Renderer
{
    /**
     * Integrity instance
     *
     * @var Integrity
     */
    private $integrity = null;
    
    /**
     * private constructor
     */
    private function __construct() {}
    
    /**
     * Fabric method creator
     *
     * @param Integrity $integrity 
     * @return Renderer
     * @author Sergey Startsev
     */
    static public function create(Integrity $integrity)
    {
        $instance = new self;
        $instance->integrity = $integrity;
        
        return $instance;
    }
    
    /**
     * Getting encapsulated integrity
     *
     * @return Integrity
     * @author Sergey Startsev
     */
    public function getIntegrity()
    {
        return $this->integrity;
    }
    
    /**
     * Render processing
     *
     * @param string $type
     * @return mixed
     * @author Sergey Startsev
     */
    public function render($type = Helper::TYPE_HTML)
    {
        $renderer_method = "renderAs" . ucfirst($type);
        
        if (!method_exists($this, $renderer_method)) {
            throw new sfException("for type '{$type}' not defined method for rendering");
        }
        
        return call_user_func(array($this, $renderer_method));
    }
    
    /**
     * Render integrity results as text
     *
     * @param string $delimiter 
     * @return string
     * @author Sergey Startsev
     */
    protected function renderAsText($delimiter = "\n")
    {
        $integrity = $this->getIntegrity();
        
        $result = '';
        foreach ((array) $integrity->getMessages() as $rule => $messages) {
            if (!empty($result)) $result .= $rule . $delimiter . $delimiter;
            $result .= $rule . ':';
            foreach ($messages as $message) $result .= $delimiter . $message;
        }
        
        return trim($result);
    }
    
    /**
     * Render integrity results as html
     *
     * @param string $delimiter 
     * @return string
     * @author Sergey Startsev
     */
    protected function renderAsHtml($delimiter = "<br/>")
    {
        $integrity = $this->getIntegrity();
        
        $result = '';
        foreach ((array) $integrity->getMessages() as $rule => $messages) {
            if (!empty($result)) $result .= $delimiter . $delimiter;
            $result .= "<b>{$rule}</b>:";
            foreach ($messages as $message) $result .= $delimiter . $message;
        }
        
        return $result;
    }
    
}
