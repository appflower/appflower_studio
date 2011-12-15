<?php

ini_set("memory_limit", "160M");

/**
 * Initialize project tasks.
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsInitTask extends sfBaseTask
{
    /**
     * Required folders that should be defined in project
     *
     * @var array
     */
    private $required_folders = array(
        '/lib/studio',
        '/cache',
        '/log',
        '/data',
        '/web/images/desktop',
    );
    
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('type', null, sfCommandOption::PARAMETER_OPTIONAL, 'In which direction should be processed initalization', 'direct'),
            new sfCommandOption('db-recreate', null, sfCommandOption::PARAMETER_OPTIONAL, 'Should be recreated database from schema or not', true),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'init';
        $this->briefDescription = 'Initialize project tasks';
        
        $this->detailedDescription = <<<EOF
The [afs:init|INFO] initialize project tasks:

  [./symfony afs:init|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        $this->createFolders();
        
        $this->createTask('project:permissions')->run();
        
        $type_method = 'execute' . sfInflector::camelize($options['type']);
        if (!method_exists($this, $type_method)) throw new sfCommandException("Type method '{$type_method}' not defined.");
        
        call_user_func(array($this, $type_method), $arguments, $options);
        
        $this->createTask('propel:build-model')->run();
        $this->createTask('propel:build-forms')->run();
        
        $this->createTask('afs:fix-perms')->run();
        
        $this->createTask('appflower:validator-cache')->run(array('frontend', 'cache', 'yes'));
        $this->createTask('cc')->run();
    }
    
    /**
     * Execute specific direct initialization
     *
     * @param Array $arguments  
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function executeDirect(Array $arguments, Array $options)
    {
        if ($options['db-recreate'] === true || $options['db-recreate'] === 'true') {
            $this->createTask('propel:insert-sql')->run();
        }
    }
    
    /**
     * Execute specific to reverse initialization
     *
     * @param Array $arguments 
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function executeReverse(Array $arguments, Array $options)
    {
        $this->createTask('afs:update-schema')->run();
        $this->createTask('propel:insert-sql-diff')->run();
    }
    
    /**
     * Create folders procedure
     *
     * @return void
     * @author Sergey Startsev
     */
    private function createFolders()
    {
        $root_dir = sfConfig::get('sf_root_dir');
        
        foreach ($this->required_folders as $folder) {
            $path = "{$root_dir}{$folder}";
            if (!file_exists($path)) mkdir($path, 0777, true);
        }
    }
    
}
