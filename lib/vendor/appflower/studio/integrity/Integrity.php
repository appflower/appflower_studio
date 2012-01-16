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
     * Rule path
     */
    const RULE_PATH = 'rule';
    
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
     * @return afResponse
     * @author Sergey Startsev
     */
    public function check()
    {
        foreach ($this->getRules() as $rule) {
            $reflection = new \ReflectionClass("AppFlower\Studio\Integrity\Rule\\$rule\\$rule");
        }
    }
    
    /**
     * Getting Rules list
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function getRules()
    {
        $rules = array();
        $dirs = \sfFinder::type('file')->not_name('*Base*')->maxdepth(1)->ignore_version_control()->in(__DIR__ . DIRECTORY_SEPARATOR . self::RULE_PATH);
        
        foreach ($dirs as $dir) $rules[] = pathinfo($dir, PATHINFO_FILENAME);
        
        return (array)$rules;
    }
    
}
