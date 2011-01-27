<?php
$this->dispatcher->connect('routing.load_configuration', array('afsRouting', 'listenToRoutingLoadConfigurationEvent'));