<?php
/**
 * @author   Radu Topala <radu@appflower.com>
 */

/**
 * This task displays a the appFlower engine/studio version
 */
class afsVersionTask extends sfBaseTask
{	  
	
  protected function configure()
  {
  	
  	$this->addOptions(array(
      new sfCommandOption('connection', null, sfCommandOption::PARAMETER_REQUIRED, 'The connection name', 'propel'),
    ));
  	
    $this->namespace        = 'afs';
    $this->name             = 'version';
    $this->briefDescription = 'Displays the version of appFlowerPlugin and appFlowerStudioPlugin';
    $this->detailedDescription = <<<EOF
The [afs:version|INFO] displays the version of appFlowerPlugin and appFlowerStudioPlugin :

  [./symfony afs:version|INFO]
EOF;
  }

  protected function execute($arguments = array(), $options = array())
  {
    $composerJsonEngine = sfConfig::get('sf_root_dir').'/plugins/appFlowerPlugin/composer.json';    
    $composerJsonStudio = sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/composer.json';
    
    if(file_exists($composerJsonEngine))
    {
        $composerJsonEngine = json_decode(file_get_contents($composerJsonEngine));
    }
    if(file_exists($composerJsonStudio))
    {
        $composerJsonStudio = json_decode(file_get_contents($composerJsonStudio));
    }
    
    $this->logSection('appFlowerPlugin', 'version '.$composerJsonEngine->version);
    $this->logSection('appFlowerStudioPlugin', 'version '.$composerJsonStudio->version);
  }  

}