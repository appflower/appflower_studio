<?php



/**
 * Skeleton subclass for representing a row from the 'project' table.
 *
 * 
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 *
 * @package    propel.generator.plugins.appFlowerStudioPlugin.lib.model
 */
class afsProject extends BaseafsProject {

    /**
     * @var studioAppConfiguration
     */
    private $projectAppConfiguration;

    public function getConfiguration() {
        if (!$this->projectAppConfiguration) {
            $this->projectAppConfiguration = new studioAppConfiguration('frontend', $this->getPath());
        }

        return $this->projectAppConfiguration;
    }
    public function getBaseUrl() {
        /**
         * we should add baseUrl field to project table, for now I just putted this fake method here
         */
        return 'http://seedcontrol/';
    }
} // Project
