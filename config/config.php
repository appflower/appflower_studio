<?php
ini_set("max_execution_time", "160");

require_once dirname(__DIR__).'/lib/vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaceFallbacks(array(
    dirname(__DIR__) . '/lib',
)); 
$loader->register();

$this->dispatcher->connect('routing.load_configuration', array('afsRouting', 'listenToRoutingLoadConfigurationEvent'));

$modules = afStudioUtil::getDirectories(sfConfig::get('sf_plugins_dir')."/appFlowerStudioPlugin/modules/",true);

sfConfig::set('sf_enabled_modules', array_merge(sfConfig::get('sf_enabled_modules'), $modules));
/**
 * setting the layout
 */
sfConfig::set('symfony.view.appFlowerStudio_studio_layout', sfConfig::get('sf_plugins_dir').'/appFlowerStudioPlugin/templates/layout');
sfConfig::set('symfony.view.appFlowerStudio_preview_layout', sfConfig::get('sf_plugins_dir').'/appFlowerStudioPlugin/templates/layout');
