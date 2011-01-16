<?php

abstract class BaseQueryAdapter
{
    protected $query;
    protected $connection_name;
    
    public function __construct($connection = 'propel') 
    {
        $this->connection_name = $connection;
    }
    
    /**
     * Processing query
     */
    abstract public function process($query);
    
    /**
     * Setting query for processing
     */
    public function setQuery($query)
    {
        $this->query = $query;
    }
    
    /**
     * Fetching error, prepare for output
     */
    protected function fetchError($text)
    {
        return array('success' => false, 'error' => $text);
    }
    
    /**
     * Fetching success, prepare for output
     */
    protected function fetchSuccess($result)
    {
        return array('success' => true, 'result' => $result);
    }
}
