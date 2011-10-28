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
 * setting the layout
 */
sfConfig::set('symfony.view.appFlowerStudio_studio_layout', sfConfig::get('sf_plugins_dir').'/appFlowerStudioPlugin/templates/layout');
sfConfig::set('symfony.view.appFlowerStudio_preview_layout', sfConfig::get('sf_plugins_dir').'/appFlowerStudioPlugin/templates/layout');


/**
 * When you disable projects management - create/load/recent project items 
 * in studio toolbar will not be available
 */
sfConfig::set( 'afs_projects_management_enabled', true);

/**
 * Configuration for ServerEnvironment class
 */
sfConfig::set( 'afs_server_auto_vhost_creation_enabled', false);
sfConfig::set( 'afs_server_env_studio_project_vhosts_dir', '/etc/httpd/studio_projects_vhosts');
sfConfig::set( 'afs_server_env_apachectl_path', '/usr/sbin/apachectl');
/**
 * If domain suffix is not provided created vhosts will use different port numbers
 * Otherwise it will be always 80 port with URL's like SLUG.DOMAIN_SUFFIX
 */
//sfConfig::set( 'afs_server_auto_vhost_domain_suffix', 'demo.appflower.com');


//todo: automatic insertion of schema.yml tables into existing db
