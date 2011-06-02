<?php
/**
 * Database SQL Query class 
 * 
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
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
     *
     * @param string $connection
     * @author Sergey Startsev
     */
    public function setConnection($connection)
    {
        $this->connection_name = $connection;
        
        $this->dbh = Propel::getConnection($connection, Propel::CONNECTION_READ);
        $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);
    }

    /**
     * Getting db connection handler
     * 
     * @return Propel
     * @author Sergey Startsev
     */
    public function getConnection()
    {
        return $this->dbh;
    }
    
    /**
     * Validation functionality
     * 
     * @param string $query
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function validate($query)
    {   
        if (preg_match('/alter|drop|create/si', $query)) {
            $afResponse = afResponseHelper::create()->success(false)->message('This operation or functionality has been disabled');
        } else {
            $afResponse = afResponseHelper::create()->success(true)->message('Validated successfully');
        }
        
        return $afResponse;
    }
    
    /**
     * Getting query type
     *
     * @param string $query 
     * @return string
     * @author Sergey Startsev
     */
    protected function getType($query)
    {   
        if (preg_match('/(?:(select|show))/sim', $query)) {
            $type = self::TYPE_SELECT;
        } elseif (preg_match('/(?:(update|delete|truncate|insert))/sim', $query)) {
            $type = self::TYPE_UPDATE;
        } elseif (preg_match('/(?:(drop|alter|create))/sim', $query)) {
            $type = self::TYPE_STRUCT;
        }
        
        return $type;
    }
    
    /**
     * Process query with select type
     *
     * @param string $query 
     * @param int $offset
     * @param int $limit
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processQuerySelect($query, $offset, $limit)
    {
        $stm = $this->dbh->prepare($query);
        $bExecuted = $stm->execute();
        
        if ($bExecuted) {
            if ($stm->rowCount() > 0) {
                $total = $stm->rowCount();

                // Limiting query
                $query_limited = $this->limiting($query, $offset, $limit);

                $stm = $this->dbh->prepare($query_limited);
                $stm->execute();

                if ($stm->rowCount() > 0) {
                    $data = $stm->fetchAll(PDO::FETCH_ASSOC);
                    $meta = $this->getFields($data);

                    $afResponse = afResponseHelper::create()->success(true)->data($meta, $data, $total)->query($query);
                } else {
                    $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
                }
            } else {
                $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
            }
        } else {
            $error_info = $stm->errorInfo();
            $afResponse = afResponseHelper::create()->success(false)->message($error_info)->query($query);
        }
        
        return $afResponse;
    }
    
    /**
     * Process query update type
     *
     * @param string $query 
     * @param int $offset 
     * @param int $limit 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processQueryUpdate($query, $offset, $limit)
    {
        $stm = $this->dbh->prepare($query);
        $bExecuted = $stm->execute();
        
        if ($bExecuted) {
            $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Query successfully executed')->query($query);
        } else {
            $error_info = $stm->errorInfo();
            $afResponse = afResponseHelper::create()->success(false)->message($error_info)->query($query);
        }
        
        return $afResponse;
    }
    
    /**
     * Process query struct type
     *
     * @param string $query 
     * @param int $offset 
     * @param int $limit 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processQueryStruct($query, $offset, $limit)
    {
        $stm = $this->dbh->prepare($query);
        $bExecuted = $stm->execute();
        
        if ($bExecuted) {
            
            // Run from refactored models functionality of changing schema, regenerate models
            
            $afResponse = afResponseHelper::create()
                            ->success(true)
                            ->data(array(), array(), 0)
                            ->message('Query successfully executed. Models regenerated')
                            ->query($query);
        } else {
            $error_info = $stm->errorInfo();
            $afResponse = afResponseHelper::create()->success(false)->message($error_info)->query($query);
        }
        
        return $afResponse;
    }
    
    /**
     * Limiting query by default
     * 
     * @param string $query
     * @param int $offset
     * @param int $limit
     * @return string
     * @author Sergey Startsev
     */
    private function limiting($query, $offset = 0, $limit = 50)
    {
        if (preg_match('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', $query, $matched)) {
            
            if (isset($matched[1]) && isset($matched[2])) {
                // native offset and limit exists
                
                $nOffset = (int)$matched[1] + $offset;
                $nLimit = ($matched[2] < $limit) ? $matched[2] : $limit;
                
                if (($nOffset + $nLimit) > ($matched[1] + $matched[2])) {
                    $nLimit = ($matched[1] + $matched[2]) - $nOffset;
                }
                
                $query = preg_replace('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', "LIMIT {$nOffset}, {$nLimit}", $query);
                
            } elseif (isset($matched[1]) && !isset($matched[2])) {
                // matched only limit
                
                $nLimit = ($matched[1] < $limit) ? $matched[1] : $limit;
                
                if (($offset + $limit) > $matched[1]) {
                    $nLimit = $matched[1] - $offset;
                }
                
                $query = preg_replace('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', "LIMIT {$offset}, {$nLimit}", $query);
            }
            
        } else {
            // query doesn't have native limit
            $query = $query . " LIMIT {$offset}, {$limit}";
        }
        
        return $query;
    }
    
}
