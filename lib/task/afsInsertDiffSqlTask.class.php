<?php

require_once(dirname(__FILE__).'/../afsDbInfo.php');

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
      new sfCommandOption('connection', null, sfCommandOption::PARAMETER_REQUIRED, 'The connection name', 'propel'),
      new sfCommandOption('clean', null, sfCommandOption::PARAMETER_REQUIRED, 'Remove existing tables from appFlowerStudio schema.yml, if they exist in db', false),
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
    
    $sqlDir = sfConfig::get('sf_data_dir').'/sql';
    $sqlFilePath = "$sqlDir/plugins.appFlowerStudioPlugin.lib.model.schema.sql";

    $this->logSection("sql-diff", "building database patch");
    $diff = '';
    
  	if($options['clean']==true) { // remove existing tables from appFlowerStudio schema.yml, if they exist in db
  	
  		$i = new afsDbInfo();
  		$diff = $i->generateDropTables(afsDbInfo::getTableNamesFromFile($sqlFilePath));
  		
  	} else { //  check table changes in db and /plugins/afStudio/config/schema.yml and generate sql diff
	
	    $i = new afsDbInfo();
	    $i->loadFromDbForTables(Propel::getConnection($options['connection']), afsDbInfo::getTableNamesFromFile($sqlFilePath));
	    $i2 = new afsDbInfo();
		if (file_exists($sqlFilePath)) { 
			$i2->loadFromFile($sqlFilePath);
		}
	    $i -> checkForeignKeys($i2);
	    $diff = $i->getDiffWith($i2);
  	}
  		
//  write diff file to disk  
    $filename = sfConfig::get('sf_data_dir')."/sql/{$options['connection']}.appFlowerStudioPlugin.diff.sql";
    if($diff=='') {
      $this->logSection("sql-diff", "no difference found");
      return;
    }
    $this->logSection('sql-diff', "writing file $filename");
    afStudioUtil::writeFile($filename, $diff);
    
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
