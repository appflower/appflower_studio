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
        /**
         * include path to propel generator
         */
        sfToolkit::addIncludePath(array(sfConfig::get('sf_propel_path').'/generator/lib'));
                
        $this->logBlock('Creating specific AppFlower folders',"QUESTION");
        $this->createFolders();
        
        $this->logBlock('Setting Symfony project permissions',"QUESTION");
        $this->createTask('project:permissions')->run();
        
        $type_method = 'execute' . sfInflector::camelize($options['type']);
        if (!method_exists($this, $type_method)) throw new sfCommandException("Type method '{$type_method}' not defined.");
        
        $this->logBlock('Building sql from current schema',"QUESTION");
        $this->createTask('propel:build-sql')->run();
        
        call_user_func(array($this, $type_method), $arguments, $options);
        
        //$this->createTask('propel:diff')->run();
        //$this->createTask('propel:migrate')->run();
                
        $this->logBlock('Creating models from current schema',"QUESTION");
        $this->createTask('propel:build-model')->run();
        
        $this->logBlock('Creating forms from current schema',"QUESTION");
        $this->createTask('propel:build-forms')->run();
        
        $this->logBlock('Setting AppFlower project permissions',"QUESTION");
        $this->createTask('afs:fix-perms')->run();
        
        $this->logBlock('Creating AppFlower validator cache',"QUESTION");
        $this->createTask('appflower:validator-cache')->run(array('frontend', 'cache', 'yes'));
        
        $this->logBlock('Clearing Symfony cache',"QUESTION");
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
            $this->logBlock('Inserting sql from current schema',"QUESTION");
            $this->createTask('propel:insert-sql')->run(array(),array('no-confirmation'));
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
        $this->logBlock('Update schema from current database',"QUESTION");
        $this->createTask('afs:update-schema')->run();
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
