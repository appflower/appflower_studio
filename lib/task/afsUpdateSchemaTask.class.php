<?php
/**
 * Extend Propel base task
 */
require_once(sfConfig::get('sf_plugins_dir') . '/sfPropelORMPlugin/lib/task/sfPropelBaseTask.class.php');

/**
 * Updates schemas in plugins.
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsUpdateSchemaTask extends sfPropelBaseTask
{
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('update-plugins', null, sfCommandOption::PARAMETER_OPTIONAL, 'Should be updated schemas in plugins', false),
            new sfCommandOption('plugins', null, sfCommandOption::PARAMETER_OPTIONAL, 'Update schemas in plugins(plugins separated by comma)', ''),
            new sfCommandOption('prefix', null, sfCommandOption::PARAMETER_OPTIONAL, 'Schemas prefix', ''),
            new sfCommandOption('application', null, sfCommandOption::PARAMETER_OPTIONAL, 'The application name', true),
            new sfCommandOption('env', null, sfCommandOption::PARAMETER_REQUIRED, 'The environment', 'cli'),
            new sfCommandOption('connection', null, sfCommandOption::PARAMETER_REQUIRED, 'The connection name', null),
            new sfCommandOption('xml', null, sfCommandOption::PARAMETER_NONE, 'Creates an XML schema instead of a YML one'),
            new sfCommandOption('phing-arg', null, sfCommandOption::PARAMETER_REQUIRED | sfCommandOption::IS_ARRAY, 'Arbitrary phing argument'),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'update-schema';
        $this->briefDescription = 'Updates schemas with related schemas in plugins';
        
        $this->detailedDescription = <<<EOF
The [afs:update-schema|INFO] task updates schemas in plugins from db:

  [./symfony afs:update-schema|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        $databaseManager = new sfDatabaseManager($this->configuration);
        
        foreach ($databaseManager->getNames() as $connection) {
            if (null !== $options['connection'] && $options['connection'] != $connection) {
                continue;
            }
            
            $this->reverseDatabase($databaseManager, $connection, $options);
        }
        
        $this->validateSchema();
    }
    
    /**
     * Reverse DB functionality
     * 
     * @author Sergey Startsev
     */
    protected function reverseDatabase($databaseManager, $connection, $options)
    {
        $name = 'propel' == $connection ? 'schema' : $connection.'-schema';
        
        $properties = $this->getPhingPropertiesForConnection($databaseManager, $connection);
        $properties['propel.default.schema.basename'] = $name;
        
        $ret = $this->callPhing('reverse', self::DO_NOT_CHECK_SCHEMA, $properties);
        
        if (!$ret) return 1;
        
        $xmlSchemaPath = sfConfig::get('sf_config_dir').'/'.$name.'.xml';
        $ymlSchemaPath = sfConfig::get('sf_config_dir').'/'.$name.'.yml';
        
        // Fix database name
        if (file_exists($xmlSchemaPath)) {
            $schema = file_get_contents($xmlSchemaPath);
            $schema = preg_replace('/<database\s+name="[^"]+"/s', '<database name="'.$connection.'" package="lib.model"', $schema);
            file_put_contents($xmlSchemaPath, $schema);
        }
        
        if (!$options['xml']) {
            $this->saveSchema(self::DO_NOT_CHECK_SCHEMA, $options, $options['prefix']);
            $this->cleanup();
            
            if (file_exists($xmlSchemaPath)) {
                unlink($xmlSchemaPath);
            }
        } else {
            if (file_exists($ymlSchemaPath)) {
                unlink($ymlSchemaPath);
            }
        }
    }
    
    /**
     * Deploy schema functionality
     *
     * @param string $checkSchema 
     * @param string $prefix 
     * @param array $options 
     * @author Sergey Startsev
     */
    protected function saveSchema($checkSchema = self::CHECK_SCHEMA, array $options = array(), $prefix = '')
    {
        $finder = sfFinder::type('file')->name('*schema.xml')->prune('doctrine');
        
        $schemas = array_unique(array_merge($finder->in(sfConfig::get('sf_config_dir')), $finder->in($this->configuration->getPluginSubPaths('/config'))));
        if (self::CHECK_SCHEMA === $checkSchema && !count($schemas)) {
            throw new sfCommandException('You must create a schema.xml file.');
        }
        
        $dbSchema = new sfPropelDatabaseSchema();
        foreach ($schemas as $schema) {
            $dbSchema->loadXML($schema);
            
            $dbSchema = $this->prepareSchema($dbSchema, $options, $prefix);
            
            $this->logSection('schema', sprintf('converting "%s" to YML', $schema));
            
            $localprefix = $prefix;
            
            // change prefix for plugins
            if (preg_match('#plugins[/\\\\]([^/\\\\]+)[/\\\\]#', $schema, $match)) {
                $localprefix = $prefix.$match[1].'-';
            }
            
            // save converted xml files in original directories
            $yml_file_name = str_replace('.xml', '.yml', basename($schema));
            
            $file = str_replace(basename($schema), $prefix.$yml_file_name,  $schema);
            $this->logSection('schema', sprintf('putting %s', $file));
            file_put_contents($file, $dbSchema->asYAML());
        }
    }
    
    /**
     * Get tables from schema
     *
     * @param string $schema_path 
     * @return array
     * @author Sergey Startsev
     */
    private function getSchemaTables($schema_path)
    {
        $dbSchema = new sfPropelDatabaseSchema;
        $dbSchema->loadYAML($schema_path);
        
        return array_keys($dbSchema->getTables());
    }
    
    /**
     * Getting schema structure
     *
     * @param string $schema_path 
     * @return array
     * @author Sergey Startsev
     */
    private function getSchemaStructure($schema_path)
    {
        $dbSchema = new sfPropelDatabaseSchema();
        $dbSchema->loadYAML($schema_path);
        
        return $dbSchema->asArray();
    }
    
    /**
     * Getting plugins schemas
     *
     * @return array
     * @author Sergey Startsev
     */
    private function getPluginsSchemas()
    {
        $this->configuration = new ProjectConfiguration(null, new sfEventDispatcher());
        
        return sfFinder::type('file')->name('*schema.yml')->prune('doctrine')->maxdepth(0)->in(array_values($this->configuration->getPluginSubPaths('/config')));
    }
    
    /**
     * Getting plugins tables
     *
     * @return array
     * @author Sergey Startsev
     */
    private function getPluginsTables()
    {
        $schemas = $this->getPluginsSchemas();
        
        $tables = array();
        foreach ($schemas as $schema) {
            if ($schema_tables = $this->getSchemaStructure($schema)) {
                foreach ($schema_tables as $connection => $table) {
                    if (empty($table)) continue;
                    if (!isset($tables[$connection])) $tables[$connection] = array();
                    $tables[$connection] = array_merge($tables[$connection], array_keys($this->getChildren($table)));
                }
            } 
        }
        
        return $tables;
    }
    
    /**
     * Prepare schema and deploy schema changes in plugins if setted
     *
     * @param sfPropelDatabaseSchema $dbSchema 
     * @param array $options 
     * @return sfPropelDatabaseSchema
     * @author Sergey Startsev
     */
    private function prepareSchema(sfPropelDatabaseSchema $dbSchema, array $options = array(), $prefix = '')
    {
        if ($options['update-plugins'] != 'false' && $options['update-plugins'] !== false) {
            $this->updatePluginsSchemas($dbSchema, (!empty($options['plugins'])) ? explode(',', $options['plugins']) : array(), $prefix);
        }
        
        $plugins_tables = $this->getPluginsTables();
        
        $aSchema = $dbSchema->asArray();
        
        $plugins_tables_list = $schema = array();
        
        foreach ($aSchema as $connection => $tables) {
            foreach ($tables as $table_name => $table_description) {
                if (isset($plugins_tables[$connection]) && in_array($table_name, $plugins_tables[$connection])) {
                    $plugins_tables_list[$connection][$table_name] = $table_description;
                } else {
                    $schema[$connection][$table_name] = $table_description;
                }
            }
        }
        
        $dbSchema->loadArray($schema);
        
        return $dbSchema;
    }
    
    /**
     * Update plugin schema
     *
     * @param string $schema_path 
     * @param sfPropelDatabaseSchema $dbSchema 
     * @param string $prefix 
     * @author Sergey Startsev
     */
    private function updatePluginSchema($schema_path, sfPropelDatabaseSchema $dbSchema, $prefix = '')
    {
        $schema_structure_updated = $schema_structure = $this->getSchemaStructure($schema_path);
        $current_schema = $dbSchema->asArray();
        
        foreach ($schema_structure as $connection => $tables) {
            foreach ($tables as $table_name => $table_structure) {
                if (isset($current_schema[$connection]) && in_array($table_name, $current_schema[$connection])) {
                    $schema_structure_updated[$connection][$table_name] = $table_description;
                }
            }
        }
        
        if (!empty($prefix)) $schema_path = dirname($schema_path) . "/{$prefix}schema.yml";
        
        $oSchema = new sfPropelDatabaseSchema;
        $oSchema->loadArray($schema_structure_updated);
        
        $this->logSection('schema', sprintf('putting %s', $schema_path));
        
        file_put_contents($schema_path, $oSchema->asYAML());
    }
    
    /**
     * Update plugins 
     *
     * @param sfPropelDatabaseSchema $dbSchema 
     * @param array $plugins 
     * @param string $prefix 
     * @author Sergey Startsev
     */
    private function updatePluginsSchemas(sfPropelDatabaseSchema $dbSchema, array $plugins = array(), $prefix = '')
    {
        $schemas = (array) $this->getPluginsSchemas();
        
        foreach ($schemas as $schema_path) {
            if (empty($plugins) || in_array(basename(dirname(dirname($schema_path))), $plugins)) {
                $this->updatePluginSchema($schema_path, $dbSchema, $prefix);
            }
        }
    }
    
    /**
     * Getting hash children
     *
     * @param Array $hash 
     * @return array
     * @author Sergey Startsev
     */
    public function getChildren(Array $hash)
    {
        foreach ($hash as $key => $value) if ($key[0] == '_') unset($hash[$key]);
        
        return $hash;
    }
    
    /**
     * Execute validate schema command
     *
     * @return boolean
     * @author Sergey Startsev
     */
    private function validateSchema()
    {
        $response = afStudioCommand::process('model', 'validateSchema');
        if (!$response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            throw new sfCommandException(implode("\n", $response->getParameter(afResponseMessageDecorator::IDENTIFICATOR)));
        }
        
        return true;
    }
    
}
