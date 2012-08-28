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
    
    /**
     * Getting oldest version from db
     *
     * @return int
     */
    static public function getOldestVersion()
    {
        $con = \Propel::getConnection();
        $stm = $con->prepare(sprintf('SELECT version FROM %s', 'propel_migration'));
        $stm->execute();
        
        $data = $stm->fetch(\PDO::FETCH_ASSOC);
        
        return $data['version'];
    }
    
    /**
     * Getting migrations files timestamps
     *
     * @return array
     */
    static public function getMigrations()
    {
        $path = \sfConfig::get('sf_root_dir') . DIRECTORY_SEPARATOR . 'lib/model/migration';
        $migrationTimestamps = array();
        
        if (is_dir($path)) {
            $files = scandir($path);
            foreach ($files as $file) {
                if (preg_match('/^PropelMigration_(\d+)\.php$/', $file, $matches)) {
                    $migrationTimestamps[] = (integer) $matches[1];
                }
            }
        }
        
        return $migrationTimestamps;
    }
    
    /**
     * Getting valid migrations timestamps
     *
     * @return array
     */
    static public function getValidMigrations()
    {
        $oldestMigrationTimestamp = self::getOldestVersion();
        $migrationTimestamps = self::getMigrations();
        
        foreach ($migrationTimestamps as $key => $timestamp) {
            if ($timestamp <= $oldestMigrationTimestamp) {
                unset($migrationTimestamps[$key]);
            }
        }
        sort($migrationTimestamps);
        
        return $migrationTimestamps;
    }
    
}
