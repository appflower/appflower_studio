<?php

/**
 * checks all tables from Studio's schema.yml if they exist in db, and if they don't exist create them into the db.
 *
 * @package    afStudio
 * @subpackage task
 * @author     milos_silni
 */
class afsInsertDiffSqlTask extends sfBaseTask
{
  /**
   * @see sfTask
   */
  protected function configure()
  {
  	$this->addOptions(array(
      new sfCommandOption('application', null, sfCommandOption::PARAMETER_REQUIRED, 'The application name'),
      new sfCommandOption('env', null, sfCommandOption::PARAMETER_REQUIRED, 'The environment', 'dev'),
      new sfCommandOption('connection', null, sfCommandOption::PARAMETER_REQUIRED, 'The connection name', 'propel'),
    ));
    
    $this->namespace = 'afs';
    $this->name = 'insert-diff-sql';
    
    $this->briefDescription = 'Checks all Studio tables exist in db';

     $this->detailedDescription = <<<EOF
Checks all tables from Studio's schema.yml if they exist in db, and if they don't exist create them into the db.
EOF;
  }

  /**
   * @see sfTask
   */
  protected function execute($arguments = array(), $options = array())
  {
	$databaseManager = new sfDatabaseManager($this->configuration);
    $connection = $databaseManager->getDatabase($options['connection'] ? $options['connection'] : null)->getConnection();
        
    $buildSql = new sfPropelBuildSqlTask($this->dispatcher, $this->formatter);
    $buildSql->setCommandApplication($this->commandApplication);
    $buildSql->run();

//  check table changes in db and /plugins/afStudio/config/schema.yml and generate sql diff
    $this->logSection("sql-diff", "building database patch");
    
    $sqlDir = sfConfig::get('sf_data_dir').'/sql';
    $sqlFilePath = "$sqlDir/plugins.appFlowerStudioPlugin.lib.model.schema.sql";
    
    $i = new dbInfo();
    $i->loadFromDbForTables(Propel::getConnection($options['connection']), dbInfo::getTableNamesFromFile($sqlFilePath));

    $i2 = new dbInfo();
    
	if (file_exists($sqlFilePath)) { 
		$i2->loadFromFile($sqlFilePath);
	}
	
    $i -> checkForeignKeys($i2);
    $diff = $i->getDiffWith($i2);

//  write diff file to disk  
    $filename = sfConfig::get('sf_data_dir')."/sql/{$options['connection']}.appFlowerStudioPlugin.diff.sql";
    if($diff=='') {
      $this->logSection("sql-diff", "no difference found");
      return;
    }
    $this->logSection('sql-diff', "writing file $filename");
    file_put_contents($filename, $diff);
    
//  insert diff sql changes to db
    $i->executeSql("SET FOREIGN_KEY_CHECKS=0;\n".$diff."\nSET FOREIGN_KEY_CHECKS=1;", Propel::getConnection($options['connection']));  
    
//  ./symfony propel:build-model  
    $buildModel = new sfPropelBuildModelTask($this->dispatcher, $this->formatter);
    $buildModel->setCommandApplication($this->commandApplication);
    $buildModel->run();
    
//  ./symfony cc
    $clearCache = new sfCacheClearTask($this->dispatcher, $this->formatter);
    $clearCache->setCommandApplication($this->commandApplication);
    $clearCache->run();
  }
}
