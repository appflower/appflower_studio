<?php
/**
 * Export project task
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsExportTask extends sfPropelBaseTask
{
    /**
     * OS export type
     */
    const TYPE_OS = 'os';
    
    /**
     * Extension export type
     */
    const TYPE_EXTENSION = 'extension';
    
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('by_os', null, sfCommandOption::PARAMETER_OPTIONAL, 'Should be exported via os command tar', false),
            new sfCommandOption('path', null, sfCommandOption::PARAMETER_OPTIONAL, 'Where should be located exported archive', './data/export'),
            new sfCommandOption('type', null, sfCommandOption::PARAMETER_OPTIONAL, "What type should be exported 'project' or 'db'", 'project'),
            new sfCommandOption('connection', null, sfCommandOption::PARAMETER_OPTIONAL, "DB connection", 'propel'),
            new sfCommandOption('project_name', null, sfCommandOption::PARAMETER_OPTIONAL, "Project name", ''),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'export';
        $this->briefDescription = 'Exports project or db dump';
        
        $this->detailedDescription = <<<EOF
The [afs:export|INFO] task export/pack current project:

  [./symfony afs:export|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        $this->extract(sfConfig::get('sf_root_dir'), $options);
    }
    
    /**
     * Extracting project
     *
     * @param string $source 
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function extract($source, Array $options)
    {
        $destination = $options['path'];
        $by_os = $options['by_os'];
        $type = $options['type'];
        
        if (!file_exists($destination)) afsFileSystem::create()->mkdirs($destination, 0775);
        if (substr($destination, -1, 1) != DIRECTORY_SEPARATOR) $destination .= DIRECTORY_SEPARATOR;
        
        // $project_name = pathinfo($source, PATHINFO_BASENAME);
        $project_name = (!empty($options['project_name'])) ? $options['project_name'] : pathinfo($source, PATHINFO_BASENAME);
        
        $export_method = "export" . ucfirst($type);
        
        if (!method_exists($this, $export_method)) throw new sfCommandException("Type '{$type}' doesn't supports");
        
        call_user_func(array($this, $export_method), $source, $destination, $by_os, $project_name, $options);
    }
    
    /**
     * Export db structure procedure
     *
     * @param string $source 
     * @param string $destination 
     * @param string $by_os 
     * @param string $project_name 
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function exportDb($source, $destination, $by_os, $project_name, Array $options)
    {
        if (($by_os === false || $by_os =='false')) {
            return $this->exportDbByPropel($source, $destination, $project_name, $options);
        }
        
        return $this->exportDbByOs($source, $destination, $project_name, $options);
    }
    
    /**
     * Export db by os
     *
     * @param string $source 
     * @param string $destination 
     * @param string $project_name 
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function exportDbByOs($source, $destination, $project_name, Array $options)
    {
        $this->log("Building sql file.");
        
        $configuration = sfYaml::load(sfConfig::get('sf_config_dir') . "/databases.yml");
        $connection = $options['connection'];
        
        if (!isset($configuration['all'][$connection])) {
            throw new sfCommandException("Connection '{$connection}' doesn't found in databases.yml");
        }
        
        $db = $configuration['all'][$connection]['param'];
        $dsn = $this->parseDSN($db['dsn']);
        
        $this->run_command("mysqldump -u{$db['username']} -p{$db['password']} {$dsn['dbname']} > {$destination}{$project_name}.sql");
        
        $this->logSection('exported', "{$destination}{$project_name}.sql");
    }
    
    /**
     * Export db by propel generates sql's
     *
     * @param string $source 
     * @param string $destination 
     * @param string $project_name 
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function exportDbByPropel($source, $destination, $project_name, Array $options)
    {
        $properties = $this->getProperties(sfConfig::get('sf_config_dir') . '/propel.ini');
        $sql_dir = str_replace('${propel.output.dir}', $properties['propel.output.dir'], $properties['propel.sql.dir']);
        
        // build task
        $this->schemaToXML(self::DO_NOT_CHECK_SCHEMA, 'generated-');
        $this->copyXmlSchemaFromPlugins('generated-');
        $ret = $this->callPhing('sql', self::CHECK_SCHEMA);
        $this->cleanup();
        
        $main_sql = 'lib.model.schema.sql';
        $export_sql = "{$project_name}.sql";
        $export_path = "{$destination}{$export_sql}";
        
        $this->log("Building sql files.");
        
        if (!file_exists("{$sql_dir}/{$main_sql}")) throw sfCommandException("Oops, please check credentials to data and right propel output dir.");
        
        $this->logSection('main-sql', "{$sql_dir}/{$main_sql}");
        
        afsFileSystem::create()->copy("{$sql_dir}/{$main_sql}", $export_path);
        
        $schemas = sfFinder::type('file')->name('*schema.yml')->prune('doctrine')->in($this->configuration->getPluginSubPaths('/config'));
        
        foreach ($schemas as &$schema) {
            $pattern = sfConfig::get('sf_plugins_dir') . "/(.*?)/";
            if (preg_match("#{$pattern}#si", $schema, $match)) $schema = $match[1];
            
            $plugin_sql_path = "{$sql_dir}/plugins.{$schema}.lib.model.schema.sql";
            if (file_exists($plugin_sql_path)) file_put_contents($export_path, file_get_contents($plugin_sql_path), FILE_APPEND);
            
            $this->logSection('plugin-sql', $plugin_sql_path);
        }
        
        $this->log("Created 1 file for import.");
        $this->logSection('exported', $export_path);
    }
    
    /**
     * Export project procedure
     *
     * @param string $source 
     * @param string $destination 
     * @param string $by_os 
     * @param string $project_name 
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function exportProject($source, $destination, $by_os, $project_name, Array $options)
    {
        $type_extract = $this->getType($by_os);
        $delegator_name = "extractProjectBy" . ucfirst($type_extract);
        
        $this->logSection('type', sprintf('export by %s', $type_extract));
        $this->logSection('path', sprintf('export project %s to %s folder', $project_name, $destination));
        $this->logSection('archive', sprintf('in destination path created %s archive', "{$project_name}.tar.gz"));
        
        $this->log('Exporting. Please wait..');
        
        if (!method_exists($this, $delegator_name)) throw new sfCommandException("Method '{$delegator_name}' doesn't exists");
        
        call_user_func(array($this, $delegator_name), $source, $destination, $project_name);
        
        $this->log('Done.');
    }
    
    /**
     * Getting export type
     *
     * @param string $by_os 
     * @return void
     * @author Sergey Startsev
     */
    private function getType($by_os = false)
    {
        if (($by_os === false || $by_os =='false')) {
            if (extension_loaded('zlib')) return self::TYPE_EXTENSION;
            if (strtolower(substr(PHP_OS, 0, 3)) === 'win') throw new sfCommandException("for export feature you should add 'zlib' extension");
            $this->log("Extension 'zlib' not loaded. Will try to export via os command..");
        }
        
        return self::TYPE_OS;
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
    private function extractProjectByExtension($source, $destination, $project)
    {
        $arch = new Archive_Tar("{$destination}{$project}.tar.gz", 'gz');
        
        $arch->setIgnoreList(array(
            '.git',
            '.gitignore',
            '.gitmodules',
            '.svn',
            'data',
            "{$project}.tar.gz",
        ));
        
        $arch->create(array("../" . pathinfo($source, PATHINFO_BASENAME)));
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
    private function extractProjectByOS($source, $destination, $project)
    {
        if (strtolower(substr(PHP_OS, 0, 3)) !== 'win') {
            $this->run_command(
                "tar -czf {$destination}{$project}.tar.gz " .
                "-C .. " .
                "--exclude='.git' --exclude='.gitignore' --exclude='.gitmodules' --exclude='.svn' --exclude='data/' --exclude='{$project}.tar.gz' " .
                pathinfo($source, PATHINFO_BASENAME)
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
    
    /**
     * Parse dsn field
     * 
     * @param string $dsn - DSN string example:  mysql:dbname=studio;host=localhost
     * @return array
     * @author Sergey Startsev
     */
    public function parseDSN($dsn)
    {
        $info = array();
        list($info['driver'], $info['query']) = explode(':', $dsn);
        
        if (isset($info['query'])) {
            $opts = explode(';', $info['query']);
            foreach ($opts as $opt) {
                list($key, $value) = explode('=', $opt);
                if (!isset($parsed[$key])) $parsed[$key] = urldecode($value);
            }
        }
        
        return $parsed;
    }
}
