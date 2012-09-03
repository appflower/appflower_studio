<?php

namespace AppFlower\Studio\Integrity\Rule\Config;

/**
 * Configurator for integrity
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Config
{
    /**
     * Added Crumbs list
     *
     * @var array
     */
    private $crumbs = array();
    
    /**
     * Creator method
     *
     * @return Config
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
     * Adding crumb to configurator
     *
     * @param Crumb $crumb 
     * @return Config
     * @author Sergey Startsev
     */
    public function add(Crumb $crumb)
    {
        $this->crumbs[] = $crumb;
        
        return $this;
    }
    
    /**
     * Getting crumbs
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getCrumbs()
    {
        return $this->crumbs;
    }
    
}
