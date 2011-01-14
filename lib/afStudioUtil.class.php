<?php

class afStudioUtil
{
  public static function getRootDir()
  {
      $currentProject = sfContext::getInstance()->getConfiguration()->getCurrentProject();
      if ($currentProject) {
          $rootDir =  $currentProject->getConfiguration()->getRootDir();
      } else {
          $rootDir = sfConfig::get('sf_root_dir');
      }

      $lastChar = $rootDir[(strlen($rootDir)-1)];
      if ($lastChar != '/') {
          $rootDir .= '/';
      }

      return $rootDir;
  }

  public static function getAfConfigUtil($moduleName)
  {
      $configuration = self::getConfiguration();
      return new afConfigUtils($moduleName, $configuration);
  }

  public static function getConfiguration()
  {
      $currentProject = sfContext::getInstance()->getConfiguration()->getCurrentProject();
      if ($currentProject) {
          return $currentProject->getConfiguration();
      } else {
          return sfContext::getInstance()->getConfiguration();
      }
  }

  public static function getConfigDir()
  {
      $rootDir = self::getRootDir();
      return "{$rootDir}config/";
  }

  /*
   * remove sfConfig::get('sf_root_dir') from path
   */
  public static function unRootify($path)
  {
    if (self::isInProject($path))
    {
      $path = substr($path, strlen(self::getRootDir()));
    }
    
    return trim($path, '/');
  }
  
  /*
   * add sfConfig::get('sf_root_dir') to path
   */
  public static function rootify($path)
  {
    if (!self::isInProject($path))
    {
      $path = self::join(self::getRootDir(), $path);
    }
    else
    {
      $path = self::join($path);
    }
    
    return $path;
  }
  
  public static function isInProject($path)
  {
    return strpos($path, self::getRootDir().'/') === 0;
  }
  
  public static function appExists($application)
  {
    return file_exists(self::rootify('apps/'.$application.'/config/'.$application.'Configuration.class.php'));
  }
  
  public static function join()
  {
    $parts = func_get_args();

    /*
     * Join path parts with $separator
     */
    $dirtyPath = implode('/', $parts);
    
    if(strpos($dirtyPath, '//') !== false)
    {
      $dirtyPath = preg_replace('|(/{2,})|', '/', $dirtyPath);
    }

    $cleanPath = '/'.trim($dirtyPath, '/');
    
    return $cleanPath;
  }
  
  /*
   * Returns the value of an array, if the key exists
   */
  public static function getValueFromArrayKey($array, $key, $default = null, $defaultIfNull = false)
  {
    if (!is_array($array))
    {
      return $default;
    }

    if (false === $defaultIfNull)
    {
      if(isset($array[$key]))
      {
        return $array[$key];
      }
      else
      {
        return $default;
      }
    }

    if(!empty($array[$key]))
    {
      return $array[$key];
    }
    else
    {
      return $default;
    }
  }
  
  
	public static function objectToArray($object)
	{	
		if(is_array($object) || is_object($object))
		{
		
			$array = array();			
			foreach($object as $key => $value)			
			{			
				$array[$key] = object_to_array($value);			
			}
			
			return $array;
		}
		
		return $object;
	}
	
	/**
	 * get the first directories under a path
	 * @author radu
	 */
	public static function getDirectories($path, $justNames=false)
	{
		$directories = sfFinder::type('directory')->maxdepth(0)->ignore_version_control()->in($path);
		
		if(!$justNames)
		{
			return $directories;
		}
		else {
			foreach ($directories as $k=>$directory)
			{
				$directories[$k]=basename($directory);
			}
			return $directories;
		}
	}
	
	/**
	 * get the first files under a path
	 * @author radu
	 */
	public static function getFiles($path, $justNames = false, $extension = false)
	{
		$files = sfFinder::type('file')->maxdepth(0)->ignore_version_control()->in($path);
		
		if($extension)
		{
			foreach ($files as $k=>$file)
			{
				if(strtolower(substr(strrchr($file,"."),1))!=$extension)
				{
					unset($files[$k]);
				}
			}
		}
		
		if(!$justNames)
		{
			return $files;
		}
		else {
			foreach ($files as $k=>$file)
			{
				$files[$k]=basename($file);
			}
			return $files;
		}
	}
}