<?php

/**
 * generating module skeleton for afStudio
 *
 * @package    afStudio
 * @subpackage task
 * @author     radu
 */
class afsGenerateModuleTask extends sfBaseTask
{
  /**
   * @see sfTask
   */
  protected function configure()
  {
  	$this->addArguments(array(
      new sfCommandArgument('application', sfCommandArgument::REQUIRED, 'The application name'),
      new sfCommandArgument('module', sfCommandArgument::REQUIRED, 'The module name'),
    ));
  	
    $this->namespace = 'afs';
    $this->name = 'generate-module';
    
    $this->briefDescription = 'Generates a new module for Studio';

     $this->detailedDescription = <<<EOF
The [generate:module|INFO] task creates the basic directory structure
for a new module in an existing application:

  [./symfony generate:module frontend article|INFO]

If a module with the same name already exists in the application,
it throws a [sfCommandException|COMMENT].
EOF;
  }

  /**
   * @see sfTask
   */
  protected function execute($arguments = array(), $options = array())
  {
  	$app    = $arguments['application'];
    $module = $arguments['module'];

    // Validate the module name
    if (!preg_match('/^[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*$/', $module))
    {
      throw new sfCommandException(sprintf('The module name "%s" is invalid.', $module));
    }

    $moduleDir = sfConfig::get('sf_app_module_dir').'/'.$module;

    if (is_dir($moduleDir))
    {
      throw new sfCommandException(sprintf('The module "%s" already exists in the "%s" application.', $moduleDir, $app));
    }

    $skeletonDir = dirname(__FILE__).'/skeleton/module';
    
    // create basic application structure
    $finder = sfFinder::type('any')->discard('.sf')->ignore_version_control();
    $this->getFilesystem()->mirror($skeletonDir.'/module', $moduleDir, $finder);
  }
}
