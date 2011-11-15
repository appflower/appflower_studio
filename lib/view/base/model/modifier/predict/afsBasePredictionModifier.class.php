<?php
/**
 * Base prediction modifier
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBasePredictionModifier
{
    /**
     * Definition
     *
     * @var array
     */
    protected $definition;
    
    /**
     * Setting definition
     *
     * @param Array $definition 
     * @return void
     * @author Sergey Startsev
     */
    public function setDefinition(Array $definition)
    {
        $this->definition = $definition;
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
    
}
