<?php

namespace AppFlower\Studio\Integrity\Rule\Model;

/**
 * Model helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Helper 
{
    /**
     * Get properties
     *
     * @param string $file 
     * @return array
     * @author Sergey Startsev
     */
    static public function getProperties($file)
    {
        $properties = array();
        
        if (false === $lines = @file($file)) throw new sfException('Unable to parse contents of the {$file} file.');
        
        foreach ($lines as $line) {
            $line = trim($line);
            
            if ('' == $line) continue;
            
            if (in_array($line[0], array('#', ';'))) continue;
            
            $pos = strpos($line, '=');
            $properties[trim(substr($line, 0, $pos))] = trim(substr($line, $pos + 1));
        }
        
        return $properties;
    }
    
    /**
     * Getting specific property
     *
     * @param string $file 
     * @param string $property 
     * @return mixed
     * @author Sergey Startsev
     */
    static public function getProperty($file, $property)
    {
        $properties = self::getProperties($file);
        
        return (array_key_exists($property, $properties)) ? $properties[$property] : null; 
    }
    
}
