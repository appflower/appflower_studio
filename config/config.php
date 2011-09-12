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
sfConfig::set( 'afs_debug', false );

/**
 * Configuration for ServerEnvironment class
 */
sfConfig::set( 'afs_server_env_studio_project_vhosts_dir', '/etc/apache2/studio-projects');
sfConfig::set( 'afs_server_env_apachectl_path', '/usr/sbin/apachectl');


//todo: automatic insertion of schema.yml tables into existing db
