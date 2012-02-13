<?php
require_once('generator/lib/model/AppData.php');
require_once('generator/lib/builder/util/XmlToAppData.php');
require_once('generator/lib/platform/DefaultPlatform.php');
require_once('generator/lib/model/diff/PropelDatabaseComparator.php');
require_once('generator/lib/util/PropelMigrationManager.php');


/**
 * creates diff using Propel 1.6
 *
 * @package    afStudio
 * @subpackage task
 * @author     Radu Topala
 */
class afsBuildSqlDiffTask extends sfPropelBaseTask
{
  /**
   * @see sfTask
   */
  protected function configure()
  {
  	$this->addOptions(array(
      new sfCommandOption('connection', null, sfCommandOption::PARAMETER_REQUIRED, 'The connection name', 'propel'),
      new sfCommandOption('clean', null, sfCommandOption::PARAMETER_REQUIRED, 'Remove existing tables from appFlowerStudio schema.yml, if they exist in db', false),
    ));
    
    
    $this->namespace = 'afs';
    $this->name = 'build-sql-diff';
    
    $this->briefDescription = 'Computes diff between current model and database';

    $this->detailedDescription = <<<EOF
The [afs:build-sql-diff|INFO] compares the current database structure and the
available schemas. If there is a difference, it creates a sql diff file :

  [./symfony afs:build-sql-diff|INFO]

The task reads the database connection settings in [config/databases.yml|COMMENT].

The task reads the schema information in [config/*schema.xml|COMMENT] and/or
[config/*schema.yml|COMMENT] from the project and all installed plugins.

You can mix and match YML and XML schema files. The task will convert
YML ones to XML before calling the Propel task.

The diff file is created in [data/sql/{connection}.diff.sql|COMMENT].
EOF;
  }

  /**
   * @see sfTask
   */
  protected function execute($arguments = array(), $options = array())
  {
	$databaseManager = new sfDatabaseManager($this->configuration);
    $connections = $this->getConnections($databaseManager);
	//$connection = $databaseManager->getDatabase($options['connection'] ? $options['connection'] : null)->getConnection();
	
	$i = new afsDbInfo();
        
    $this->logSection('propel', 'Reading databases structure...');
    $ad = new AppData();
    $totalNbTables = 0;
    foreach ($connections as $name => $params)
    {
      $pdo = $databaseManager->getDatabase($name)->getConnection();
      $database = new Database($name);
      $platform = $this->getPlatform($databaseManager, $name);
      $database->setPlatform($platform);
      $database->setDefaultIdMethod(IDMethod::NATIVE);
      $parser = $this->getParser($databaseManager, $name, $pdo);
      //$parser->setMigrationTable($options['migration-table']);
      $parser->setPlatform($platform);
      $nbTables = $parser->parse($database);
      $ad->addDatabase($database);
      $totalNbTables += $nbTables;
      $this->logSection('propel', sprintf('  %d tables imported from database "%s"', $nbTables, $name), null, 'COMMENT');
    }
    if ($totalNbTables) {
      $this->logSection('propel', sprintf('%d tables imported from databases.', $totalNbTables));
    } else {
      $this->logSection('propel', 'Database is empty');
    }
    
    $this->logSection('propel', 'Loading XML schema files...');
    Phing::startup(); // required to locate behavior classes...
    $this->schemaToXML(self::DO_NOT_CHECK_SCHEMA, 'generated-');
    $this->copyXmlSchemaFromPlugins('generated-');
    $appData = $this->getModels($databaseManager, true);
    $this->logSection('propel', sprintf('%d tables defined in the schema files.', $appData->countTables()));
    $this->cleanup(true);

    $this->logSection('sql-diff', 'Comparing databases and schemas...');
    $manager = new PropelMigrationManager();
    $manager->setConnections($connections);
    foreach ($ad->getDatabases() as $database) {
      $name = $database->getName();
      $filenameDiff = sfConfig::get('sf_data_dir')."/sql/{$name}.".time().".diff.sql";
      
      $this->logSection('sql-diff', sprintf('  Comparing database "%s"', $name), null, 'COMMENT');

      if (!$appData->hasDatabase($name)) {
        // FIXME: tables present in database but not in XML
        continue;
      }
      $databaseDiff = PropelDatabaseComparator::computeDiff($database, $appData->getDatabase($name));

      if (!$databaseDiff) {
        //no diff
      }

      $this->logSection('sql-diff', sprintf('Structure of database was modified in datasource "%s": %s', $name, $databaseDiff->getDescription()));
      
      $platform = $this->getPlatform($databaseManager, $name);
      //up sql
      $upDiff = $platform->getModifyDatabaseDDL($databaseDiff);
      //down sql
      $downDiff = $platform->getModifyDatabaseDDL($databaseDiff->getReverseDiff());
    
      if($databaseDiff)
      {
        $this->logSection('sql-diff', "Writing file $filenameDiff");  
        afStudioUtil::writeFile($filenameDiff, $upDiff);
      }
    }
  }
}
