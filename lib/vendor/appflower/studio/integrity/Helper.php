<?php

namespace AppFLower\Studio\Integrity;

/**
 * Integrity helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Helper
{
    /**
     * Rule path
     */
    const RULE_PATH = 'rule';
    
    /**
     * Getting Rules list
     *
     * @return array
     * @author Sergey Startsev
     */
    static public function getRules()
    {
        $rules = array();
        $args = func_get_args();
        
        $finder = \sfFinder::type('file')->prune('base')->not_name('*Base*')->maxdepth(1)->ignore_version_control();
        if (!empty($args)) {
            array_walk($args, function(&$v, $k) { $v = $v . ".php";});
            call_user_func_array(array($finder, 'name'), $args);
        }
        
        $dirs = $finder->in(__DIR__ . DIRECTORY_SEPARATOR . self::RULE_PATH);
        foreach ($dirs as $dir) $rules[] = pathinfo($dir, PATHINFO_FILENAME);
        
        return (array)$rules;
    }
    
}
