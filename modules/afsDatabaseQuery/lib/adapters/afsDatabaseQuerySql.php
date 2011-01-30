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
    
    /**
     * Total found rows
     */
    private $total = 0;
    
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
     * @param $offset 
     * @param $limit
     * @return mixed
     */
    public function process($query, $offset = 0, $limit = 50)
    {
        $this->setQuery($query);
        
        $aValidate = $this->validate();
        
        if ($aValidate['success']) {
            $stm = $this->dbh->prepare($this->query);
            $bExecuted = $stm->execute();
            
            if ($bExecuted) {
                if ($stm->rowCount() > 0) {
                    
                    $this->total = $stm->rowCount();
                    
                    // Re-setting query
                    $this->limiting($offset, $limit);
                    
                    $stm = $this->dbh->prepare($this->query);
                    $stm->execute();
                    
                    if ($stm->rowCount() > 0) {
                        $aResult = array(
                                        'result' => $stm->fetchAll(PDO::FETCH_ASSOC),
                                        'count' => $this->total
                        );
                        $result = $this->fetchSuccess($aResult);
                    } else {
                        $result = $this->fetchInfo('Nothing has been found');
                    }
                    
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
    
    /**
     * Limiting query by default
     * 
     * @param $offset
     * @param $limit
     */
    private function limiting($offset = 0, $limit = 50)
    {
        /**
         * TODO: limit nivelirign 
         * exmaplt: http://studio/afsDatabaseQuery/query?query=SELECT%20*%20FROM%20timezones%20limit%2060&offset=50&limit=50
         */
        
        if (preg_match('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', $this->query, $matched)) {
            
            if (isset($matched[1]) && isset($matched[2])) {
                // native offset and limit exists
                
                $nOffset = (int)$matched[1] + $offset;
                $nLimit = ($matched[2] < $limit) ? $matched[2] : $limit;
                
                if (($nOffset + $nLimit) > ($matched[1] + $matched[2])) {
                    $nLimit = ($matched[1] + $matched[2]) - $nOffset;
                }
                
                $this->query = preg_replace('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', "LIMIT {$nOffset}, {$nLimit}", $this->query);
                
            } elseif (isset($matched[1]) && !isset($matched[2])) {
                // matched only limit
                
                $nLimit = ($matched[1] < $limit) ? $matched[1] : $limit;
                
                if (($offset + $limit) > $matched[1]) {
                    $nLimit = $matched[1] - $offset;
                }
                
                $this->query = preg_replace('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', "LIMIT {$offset}, {$nLimit}", $this->query);
            }
            
        } else {
            // query doesn't have native limit
            
            $this->query = $this->query . " LIMIT {$offset}, {$limit}";
        }
    }
    
}
