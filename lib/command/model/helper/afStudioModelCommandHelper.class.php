<?php
/**
 * Model command helper class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModelCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Deploy schema changes to DB
     * 
     * @return string - Console results
     * @author Sergey Startsev
     */
	static public function deploy()
	{
        $console = afStudioConsole::getInstance()->execute(array(
            'sf cc',
            'sf appflower:validator-cache frontend cache yes',
            'sf propel:insert-sql-diff', 
            'sf propel:build-model',
        ));
        
        return $console;
	}
	
	/**
	 * Update existed schemas from database
	 *
	 * @return string - Console results
	 * @author Sergey Startsev
	 */
	static public function updateSchemas()
	{
	    $console = afStudioConsole::getInstance()->execute(array(
            'sf cc',
            'sf appflower:validator-cache frontend cache yes',
            'sf propel:build-schema',
            'sf propel:build-model',
        ));
        
        return $console;
	}
	
	/**
	 * Validates Model's name
	 * 
	 * @param string $name
	 * @return boolean
	 */
	static public function isValidName($name) 
	{
		return preg_match("/^[^\d]\w*$/i", $name);
	}
	
	
	/**
	 * Sort models array
	 *
	 * @param Array $models 
	 * @return array
	 */
	static public function sortModels(Array $models)
	{
		usort($models, 'self::compareModelNames');
		
		return $models;
	}
    
    /**
     * Comparing callback for sort models method
     *
     * @param string $model1 
     * @param string $model2 
     * @return int
     */
	static private function compareModelNames($model1, $model2)
	{
		$model1Name = strtolower($model1['text']);
		$model2Name = strtolower($model2['text']);
		
		if ($model1Name > $model2Name) return 1;
		if ($model1Name < $model2Name) return -1;
        
		return 0;
	}
	
}
