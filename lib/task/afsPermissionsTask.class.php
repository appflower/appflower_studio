<?php

/**
 * Fixes afStudio permissions.
 *
 * @package    afStudio
 * @subpackage task
 * @author     radu
 */
class afsPermissionsTask extends sfBaseTask
{
  /**
   * @see sfTask
   */
  protected function configure()
  {
    $this->namespace = 'afs';
    $this->name = 'fix-perms';
    $this->briefDescription = 'Fixes af Studio permissions';

    $this->detailedDescription = <<<EOF
The [afStudio:permissions|INFO] task fixes af Studio permissions:

  [./symfony afStudio:permissions|INFO]
EOF;
  }

  /**
   * @see sfTask
   */
  protected function execute($arguments = array(), $options = array())
  {
  	/**
  	 * fixing perms on all schemas
  	 */
  	$this->configuration = new ProjectConfiguration(null, new sfEventDispatcher());
	$finder = sfFinder::type('file')->name('*schema.yml')->prune('doctrine');
	$dirs = array_merge(array(sfConfig::get('sf_config_dir')), $this->configuration->getPluginSubPaths('/config'));
	$schemas = $finder->in($dirs);
	
	foreach ($schemas as $schema)
    {
    	$this->getFilesystem()->chmod($schema, 0777);
    }
    
    $customSchemaFilename = str_replace(array(
        str_replace(DIRECTORY_SEPARATOR, '/', sfConfig::get('sf_root_dir')).'/',
        'plugins/',
        'config/',
        '/',
        'schema.yml'
      ), array('', '', '', '_', 'schema.custom.yml'), $schema);
	  $customSchemas = sfFinder::type('file')->name($customSchemaFilename)->in($dirs);
	
	  foreach ($customSchemas as $customSchema)
	  {
	  	$this->getFilesystem()->chmod($customSchema, 0777);
	  }
	  
	  /**
	   * fixing perms on modules
	   */
	  $modules = sfFinder::type('any')->in(sfConfig::get('sf_root_dir').'/apps/');
	  
	  foreach ($modules as $module)
	  {
	  	$this->getFilesystem()->chmod($module, 0777);
	  }
      
	  /**
	   * fixing perms on studio plugin data dir
	   */
	  $dataDir = sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/data';
      $this->getFilesystem()->chmod($dataDir, 0777);
	  
	  /**
	   * fixing perms on all yml files
	   */
	  $appymls = sfFinder::type('file')->name('*.yml')->prune('symfony')->in(sfConfig::get('sf_root_dir'));
	  
	  foreach ($appymls as $appyml)
	  {
	  	$this->getFilesystem()->chmod($appyml, 0777);
	  }
  }
}
