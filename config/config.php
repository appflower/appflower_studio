<?php
$this->dispatcher->connect('routing.load_configuration', array('afsRouting', 'listenToRoutingLoadConfigurationEvent'));

sfConfig::set('sf_enabled_modules', array_merge(sfConfig::get('sf_enabled_modules'), array('appFlowerStudio', 'afsWidgetBuilder', 'afsDatabaseQuery', 'afsModelGridData')));