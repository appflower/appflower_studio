<?php
/**
 * Database SQL Query class 
 * 
 * @author startsev.sergey@gmail.com
 */
class afsDatabaseQuerySql extends BaseQueryAdapter
{
    /*
     * Database connection handler
     */
    private $dbh;
    
    public function __construct($connection = 'propel')
    {
        parent::__construct($connection);
        
        if (!empty($connection)) {
            $this->setConnection($connection);
        }
    }

    /**
     * Setting db connection
     */
    public function setConnection($connection)
    {
        $this->connection_name = $connection;
        
        $this->dbh = Propel::getConnection($connection, Propel::CONNECTION_READ);
        $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
    }

    /**
     * Getting db connection
     */
    public function getConnection()
    {
        return $this->dbh;
    }
    
    /**
     * Processing query
     * 
     * @param $query SQL query for executing
     * @return mixed
     */
    public function process($query)
    {
        $this->setQuery($query);
        
        $aValidate = $this->validate();
        
        if ($aValidate['success']) {
            $stm = $this->dbh->prepare($this->query);
            $bExecuted = $stm->execute();
            
            if ($bExecuted) {
                if ($stm->rowCount() > 0) {
                    $result = $this->fetchSuccess($stm->fetchAll(PDO::FETCH_ASSOC));
                } else {
                    $result = $this->fetchInfo('Nothing has been found');
                }
            } else {
                $aErrorInfo = $stm->errorInfo();
                $result = $this->fetchError($aErrorInfo[2]);
            }
        } else {
            $result = $aValidate;
        }
        
        return $result;
    }
    
    /**
     * Validation functionality
     * 
     * @return array
     */
    private function validate()
    {
        if (preg_match('/alter|drop|create|;|insert|update|delete/si', $this->query)) {
            $return = $this->fetchError('This operation or functionality has been disabled');
        } else {
            $return = $this->fetchSuccess('Validated successfully');
        }
        
        return $return;
    }
    
    
    
}
