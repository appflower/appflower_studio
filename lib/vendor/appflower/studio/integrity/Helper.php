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
        $prepared_args = array();
        
        $finder = \sfFinder::type('file')->prune('base')->not_name('*Base*', '*Helper*')->maxdepth(1)->ignore_version_control();
        if (!empty($args)) {
            foreach ($args as $key => $value) {
                if (!is_array($value)) {
                    $prepared_args[$value] = array();
                    continue;
                }
                $prepared_args[key($value)] = current($value);
            }
            $names = array_keys($prepared_args);
            
            array_walk($names, function(&$v, $k) { $v = $v . ".php";});
            call_user_func_array(array($finder, 'name'), $names);
        }
        
        $dirs = $finder->in(__DIR__ . DIRECTORY_SEPARATOR . self::RULE_PATH);
        foreach ($dirs as $dir) {
            $rule_name = pathinfo($dir, PATHINFO_FILENAME);
            $rules[$rule_name] = (array_key_exists($rule_name, $prepared_args)) ? $prepared_args[$rule_name] : array();
        }
        
        return (array)$rules;
    }
    
}
