<?php

require_once dirname(__DIR__) . '/vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'AppFlower\Studio'  => dirname(__DIR__) . '/vendor',
));
$loader->register();

use AppFlower\Studio\Integrity as Integrity;
use AppFlower\Studio\Integrity\Rule\Config as IntegrityConfig;

/**
 * Checks integrity of project
 * 
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsIntegrityTask extends sfBaseTask
{
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('rules', 'r', sfCommandOption::PARAMETER_OPTIONAL, 'List of rules separated by comma that should be executed', ''),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'integrity';
        $this->briefDescription = 'Checks integrity of project';
        
        $this->detailedDescription = <<<EOF
The [afs:integrity|INFO] task shows problems that may exists in project:

  [./symfony afs:integrity|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        $databaseManager = new sfDatabaseManager($this->configuration);
        
        $config = null;
        if (!empty($options['rules'])) {
            $config = IntegrityConfig\Config::create();
            foreach (explode(',', $options['rules']) as $rule_name) $config->add(IntegrityConfig\Crumb::create($rule_name));
        }
        $integrity = Integrity\Integrity::create()->check($config);
        
        if ($integrity->isImpaired()) {
            throw new sfCommandException($integrity->render(Integrity\Renderer\Helper::TYPE_TEXT));
        }
        
        $this->logSection('done', 'Project integrity is not impaired');
    }
    
}
