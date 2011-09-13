<?php
/**
 * Database SQL Query class 
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsDatabaseQuerySql extends afsBaseQueryAdapter
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
     * Validation functionality - if needed to deprecate some methods need to update this method 
     * nothing to validate, all validation on catching propel exception.
     * 
     * @param string $query
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function validate($query)
    {
        return afResponseHelper::create()->success(true)->message('Validated successfully');
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
        if (preg_match('/(?:(select|show))/sim', $query)) return self::TYPE_SELECT;
        if (preg_match('/(?:(update|delete|truncate|insert))/sim', $query)) return self::TYPE_UPDATE;
        if (preg_match('/(?:(drop|alter|create))/sim', $query)) return self::TYPE_STRUCT;
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
        
        $response = afResponseHelper::create();
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
                    
                    return $response->success(true)->data($meta, $data, $total)->query($query);
                }   
            } 
            
            return $response->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
        } 
        
        return $response->success(false)->message($stm->errorInfo())->query($query);
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
        $response = afResponseHelper::create();
        
        $stm = $this->dbh->prepare($query);
        if ($stm->execute()) {
            if (preg_match('/(?:update|delete\s{1,}from|truncate|insert\s{1,}into)\s{1,}(.*?)(?:\s|$)/si', $query, $matched)) {
               return $this->processQuerySelect("SELECT * FROM {$matched[1]}", 0, 50);
            }
            
            return $response->success(true)->data(array(), array(), 0)->message('Query successfully executed')->query($query);
        }
        
        return $response->success(false)->message($stm->errorInfo())->query($query);
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
        
        $response = afResponseHelper::create();
        if ($bExecuted) {
            afStudioCommand::process('model', 'updateSchemas');
            
            if (preg_match('/(?:alter\s{1,}table)\s{1,}(.*?)(?:\s|$)/si', $query, $matched)) {
               return $this->processQuerySelect("SELECT * FROM {$matched[1]}", 0, 50);
            }
            
            return $response->success(true)->data(array(), array(), 0)->message('Query successfully executed. Models regenerated')->query($query);
        } 
        
        return $response->success(false)->message($stm->errorInfo())->query($query);
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
                
                if (($nOffset + $nLimit) > ($matched[1] + $matched[2])) $nLimit = ($matched[1] + $matched[2]) - $nOffset;
                
                $query = preg_replace('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', "LIMIT {$nOffset}, {$nLimit}", $query);
                
            } elseif (isset($matched[1]) && !isset($matched[2])) {
                // matched only limit
                
                $nLimit = ($matched[1] < $limit) ? $matched[1] : $limit;
                
                if (($offset + $limit) > $matched[1]) $nLimit = $matched[1] - $offset;
                
                $query = preg_replace('/limit\s+?(\d+)\s*?(?:,\s*(\d+))?$/im', "LIMIT {$offset}, {$nLimit}", $query);
            }
        } else {
            // query doesn't have native limit
            $query = $query . " LIMIT {$offset}, {$limit}";
        }
        
        return $query;
    }
    
}
