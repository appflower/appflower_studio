<?php
$this->dispatcher->connect('routing.load_configuration', array('afsRouting', 'listenToRoutingLoadConfigurationEvent'));

$modules = afStudioUtil::getDirectories(sfConfig::get('sf_plugins_dir')."/appFlowerStudioPlugin/modules/",true);

sfConfig::set(  'sf_enabled_modules', 
                array_merge(
                            sfConfig::get('sf_enabled_modules'), 
                            $modules
                )
);

//todo: automatic insertion of schema.yml tables into existing db