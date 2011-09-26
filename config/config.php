<?php
$this->dispatcher->connect('routing.load_configuration', array('afsRouting', 'listenToRoutingLoadConfigurationEvent'));

$modules = afStudioUtil::getDirectories(sfConfig::get('sf_plugins_dir')."/appFlowerStudioPlugin/modules/",true);

sfConfig::set(  'sf_enabled_modules', 
                array_merge(
                            sfConfig::get('sf_enabled_modules'), 
                            $modules
                )
);
/**
 * use this to set the production:false/development:true environment of Studio
 */
sfConfig::set( 'afs_debug', true );

/**
 * setting the layout
 */
sfConfig::set('symfony.view.appFlowerStudio_studio_layout', sfConfig::get('sf_plugins_dir').'/appFlowerStudioPlugin/templates/layout');
sfConfig::set('symfony.view.appFlowerStudio_preview_layout', sfConfig::get('sf_plugins_dir').'/appFlowerStudioPlugin/templates/layout');


//todo: automatic insertion of schema.yml tables into existing db
