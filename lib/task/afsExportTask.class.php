<?php
/**
 * Export project task
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsExportTask extends sfBaseTask
{
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('by_os', null, sfCommandOption::PARAMETER_OPTIONAL, 'Should be exported via os command tar', false),
            new sfCommandOption('path', null, sfCommandOption::PARAMETER_OPTIONAL, 'Where should be located exported archive', './data'),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'export-project';
        $this->briefDescription = 'Exports project';
        
        $this->detailedDescription = <<<EOF
The [afs:export-project|INFO] task export/pack current project:

  [./symfony afs:export-project|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        $this->extract(sfConfig::get('sf_root_dir'), $options['path'], $options['by_os']);
    }
    
    /**
     * Extracting project
     *
     * @param string $source 
     * @param string $destination 
     * @param string $by_os 
     * @return void
     * @author Sergey Startsev
     */
    private function extract($source, $destination, $by_os)
    {
        $delegator_name = (($by_os == false || $by_os == 'false') && extension_loaded('zlib')) ? 'ByExtension' : 'ByOS';
        
        if (!file_exists($destination)) afsFileSystem::create()->mkdirs($destination, 0777);
        if (substr($destination, -1, 1) != DIRECTORY_SEPARATOR) $destination .= DIRECTORY_SEPARATOR;
        
        $project_name = pathinfo($source, PATHINFO_BASENAME);
        
        $this->logSection('path', sprintf('export project %s to %s folder', $project_name, $destination));
        $this->logSection('archive', sprintf('in destination path created %s archive', "{$project_name}.tar.gz"));
        
        $this->log('Extracting. Please wait..');
        
        call_user_func(array($this, "extract{$delegator_name}"), $source, $destination, $project_name);
        
        $this->log('Done.');
    }
    
    /**
     * Extract via extension
     *
     * @param string $source 
     * @param string $destination 
     * @param string $project 
     * @return void
     * @author Sergey Startsev
     */
    private function extractByExtension($source, $destination, $project)
    {
        $arch = new Archive_Tar("{$destination}{$project}.tar.gz", 'gz');
        
        $arch->setIgnoreList(array(
            '.git',
            '.gitignore',
            '.gitmodules',
            '.svn',
            "{$project}.tar.gz",
        ));
        
        $arch->create(array("../{$project}"));
    }
    
    /**
     * Extracting via os command
     *
     * @param string $source 
     * @param string $destination 
     * @param string $project 
     * @return void
     * @author Sergey Startsev
     */
    private function extractByOS($source, $destination, $project)
    {
        if (strtolower(substr(PHP_OS, 0, 3)) !== 'win') {
            $this->run_command( 
                "tar -czf {$destination}{$project}.tar.gz ".
                "--exclude='.git' --exclude='.gitignore' --exclude='.gitmodules' --exclude='.svn' ".
                "../{$project}"
            );
        }
    }
    
    /**
     * Execute command
     *
     * @param string $command 
     * @return mixed
     * @author Sergey Startsev
     */
    private function run_command($command)
    {
        ob_start();
        passthru("{$command} 2>&1", $executed);
        $console = trim(ob_get_clean());
        
        return (!$executed) ? $console : false;
    }
    
}
