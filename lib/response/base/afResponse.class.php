<?php
/**
 * Response class
 *
 * @package appflower
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afResponse extends afResponseBase
{
    /**
     * Render object as string
     *
     * @return string
     * @author Sergey Startsev
     */
    public function __toString()
    {
        return $this->asJson();
    }
    
    /**
     * Render result as json
     *
     * @return string
     * @author Sergey Startsev
     */
    public function asJson()
    {
        return json_encode($this->getParameters());
    }
    
    /**
     * Render as array - default as keeped..
     *
     * @return array
     * @author Sergey Startsev
     */
    public function asArray()
    {
        return $this->getParameters();
    }
    
    /**
     * Process decorator functionality
     *
     * @param string $method 
     * @param mixed $arguments 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function __call($method, $arguments)
    {
        // Getting decorator class name
        $decorator = 'afResponse' . ucfirst($method) . 'Decorator';
        
        if (class_exists($decorator)) {
            // Create new reflection
            $reflection = new ReflectionClass($decorator);
            
            // Send this as first parameter
            array_unshift($arguments, $this);
            
            return $reflection->newInstanceArgs($arguments);
        } else {
            throw new afResponseException("This decorator doesn't exists");
        }
    }
    
}