<?php

abstract class BaseQueryAdapter
{
    const TYPE_ERROR = 'error';
    const TYPE_SUCCESS = 'success';
    const TYPE_INFO = 'info';
    
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
    protected function fetchError($content)
    {
        return $this->fetch($content, false, self::TYPE_ERROR);
    }
    
    /**
     * Fetching success, prepare for output
     */
    protected function fetchSuccess($content)
    {
        return $this->fetch($content, true, self::TYPE_SUCCESS);
    }
    
    /**
     * Fetching info, prepare for output
     */
    protected function fetchInfo($content)
    {
        return $this->fetch($content, true, self::TYPE_INFO);
    }
    
    /**
     * Fetching output
     */
    protected function fetch($content, $success, $type)
    {
        return array('success' => $success, 'type' => $type, 'content' => $content);
    }
    
}
