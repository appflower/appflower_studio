<?php

class afStudioUtil
{
  public static function getRootDir()
  {
    return sfConfig::get('sf_root_dir');
  }

  public static function getConfigDir()
  {
    return sfConfig::get('sf_config_dir');
  }
  
  public static function getDataDir()
  {
    return sfConfig::get('sf_data_dir');
  }
  
  public static function getFixturesDir()
  {
    return self::getDataDir()."/fixtures";
  }
  
  public static function getUploadsDir()
  {
    return self::getRootDir()."/web/uploads";
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
	
	/**
	 * @return the IP address
	 * @author radu
	 */
	public static function getIP()
    {
        $ip = false; // No IP found

        /**
         * User is behind a proxy and check that we discard RFC1918 IP addresses.
         * If these address are behind a proxy then only figure out which IP belongs
         * to the user.
         */
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(', ', $_SERVER['HTTP_X_FORWARDED_FOR']); // Put the IP's into an array which we shall work with.
            $no = count($ips);
            for ($i = 0 ; $i < $no ; $i++) {

                /**
                 * Skip RFC 1918 IP's 10.0.0.0/8, 172.16.0.0/12 and
                 * 192.168.0.0/16
                 * @todo remove deprecated eregi call
                 * @todo check of usage of this function - looks like a candidate for deletion
                 */
                if (!@eregi('^(10|172\.16|192\.168)\.', $ips[$i])) {
                    $ip = $ips[$i];
                    break;
                } // End if

            } // End for

        } // End if
        return ($ip ? $ip : isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '127.0.0.1'); // Return with the found IP, the remote address or the local loopback address

    }
    
    /**
     * @return host name from sf request class
     * @author radu
     */
    public static function getHost()
    {
    	return sfContext::getInstance()->getRequest()->getUriPrefix();
    }
    
    /**
     * @return an unique identifier for different purposes
     * @author radu
     */
    public static function unique()
    {
    	return md5(time());
    }
    
    /**
     * @author radu
     */
    public static function getTemplateConfig()
    {
      $pluginTemplateYml=sfYaml::load(sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/config/template.yml');
      $projectYmlPath = sfConfig::get('sf_root_dir').'/config/project.yml';
    	$projectYml=sfYaml::load($projectYmlPath);
    	
    	if(isset($projectYml['project']['template']))
    	{
    		$pluginTemplateYml['template']['current'] = $projectYml['project']['template']; 
    	}
    	else {
    	  $pluginTemplateYml['template']['current'] = $pluginTemplateYml['template']['default']; 
    	  
    	  $projectYml['project']['template'] = $pluginTemplateYml['template']['default'];
    	  
    	  afStudioUtil::writeFile($projectYmlPath,sfYaml::dump($projectYml,4));
    	}
    	
    	return $pluginTemplateYml;
    }
    
    /**
     * Write file functionality
     * 
     * @author radu
     * @return boolean - status
     */
    public static function writeFile($filePath, $content)
    {
        if (file_exists($filePath) && !is_writable($filePath)) return false;
        if (!file_exists($filePath) && !is_writable(dirname($filePath))) return false;
        
        return file_put_contents($filePath, $content);
    }
    
    public static function getAfServiceClient()
    {
        require_once sfConfig::get('sf_lib_dir').'/vendor/afServiceClient/src/lib/afServiceClient.php';
        $afClientOptions = sfConfig::get('app_afs_afService');
        return afServiceClient::create(
            $afClientOptions['url'],
            $afClientOptions['username'],
            $afClientOptions['password']
        );
    }
    
    /**
     * returns Propel connection params
     *
     * @param string $connection
     * @return array
     * @author Radu Topala <radu@appflower.com>
     */
    public static function getDbParams($connection = 'propel')
    {
        $configuration = sfYaml::load(sfConfig::get('sf_config_dir') . "/databases.yml");
        
        if (!isset($configuration['all'][$connection])) {
            throw new sfException("Connection '{$connection}' wasn't found in databases.yml");
        }
        
        $db = $configuration['all'][$connection]['param'];
        
        $info = array();
        list($info['driver'], $info['query']) = explode(':', $db['dsn']);
        
        if (isset($info['query'])) {
            $opts = explode(';', $info['query']);
            foreach ($opts as $opt) {
                list($key, $value) = explode('=', $opt);
                if (!isset($parsed[$key])) $parsed[$key] = urldecode($value);
            }
        }
        
        $db = array_merge($db,$parsed);
        
        return $db;
    }
}