<?php
/**
 * We need this "fake" configuration class to access other project structure
 * This class is used by afConfigUtils when alternative project root directory is in use
 *
 * In normal conditions this class guesses application name from its class name
 * This is why we must pass in application name directly
 */
class studioAppConfiguration extends sfApplicationConfiguration
{
    protected $forcedApplicationName;
    public function __construct($application, $rootDir) {
        $this->forcedApplicationName = $application;
        parent::__construct('prod', false, $rootDir);
    }
    public function getApplication() {
        return $this->forcedApplicationName;
    }
    public function setup()
    {
    }
    /**
    * This method is empty version of original one
    * It was running some code that could interfere with already instantiated studio configuration
    * For now it looks like everything is working without that code
    */
    public function initConfiguration()
    {
    }
}
