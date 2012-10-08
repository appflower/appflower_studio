<?php

/**
 * Checks db connectivity, should be used before running any db action
 * 
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Radu Topala <radu@appflower.com>
 */
class afsDbConnectivityTask extends sfPropelBaseTask
{
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->namespace = 'afs';
        $this->name = 'db-connectivity';
        $this->briefDescription = 'Checks db connectivity';
        
        $this->detailedDescription = <<<EOF
The [afs:db-connectivity|INFO] task shows if app can connect to db:

  [./symfony afs:db-connectivity|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        $databaseManager = new sfDatabaseManager($this->configuration);
        $connections = $this->getConnections($databaseManager);
        
        foreach ($connections as $name => $params)
        {
            try {
                $pdo = $databaseManager->getDatabase($name)->getConnection();
            }
            catch (sfException $e) {}
            catch (Exception $e) {
                $this->logSection('error', '`'.$name.'` connection has some issues, please check connection parameters from ./config/databases.yml');       
                
                return false;
            }
        }
        
        return true;
    }
    
}
