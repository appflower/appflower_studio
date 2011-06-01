<?php
/**
 * Base query adapter class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class BaseQueryAdapter
{
    /**
     * Query executed message
     */
    const QUERY_EXECUTED = 'Query has been successfully executed';
    
    /**
     * Query not executed message
     */
    const QUERY_NOT_EXECUTED = 'No one query not executed';
    
    /**
     * Query for processing
     */
    protected $query;
    
    /**
     * Query separator value
     */
    protected $separator = ';';
    
    /**
     * Connection name
     */
    protected $connection_name;
    
    public function __construct($connection = 'propel') 
    {
        $this->connection_name = $connection;
    }
    
    /**
     * Setting query for processing
     *
     * @param string $query 
     * @author Sergey Startsev
     */
    public function setQuery($query)
    {
        $this->query = $query;
    }
    
    /**
     * Getting query
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getQuery()
    {
        return $this->query;
    }
    
    /**
     * Processing query
     * 
     * @param string $query Propel Query for executing
     * @param int $offset 
     * @param int $limit
     * @return afResponse
     * @author Sergey Startsev
     */
    public function process($query, $offset = 0, $limit = 50)
    {
        $this->setQuery(trim($query));
        
        $dataset = array();
        $success = false;
        
        $queries = $this->separate();
        foreach ($queries as $query) {
            if (!empty($query)) {
                $response = $this->processQuery($query, $offset, $limit);
                $dataset[] = $response->asArray();
                $success |= $response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR);
            }
        }
        
        $message = ($success) ? self::QUERY_EXECUTED : self::QUERY_NOT_EXECUTED;
        
        return afResponseHelper::create()->dataset($dataset)->success($success)->message($message);
    }
    
    /**
     * Processing one query
     *
     * @param string $query 
     * @param int $offset 
     * @param int $limit 
     * @return afResponse
     * @author Sergey Startsev
     */
    abstract protected function processQuery($query, $offset, $limit);
    
    /**
     * Separate query to few using separator, which can be reloaded in child classes
     *
     * @return void
     * @author Sergey Startsev
     */
    protected function separate()
    {
        return explode($this->getSeparator(), $this->getQuery());
    }
    
    /**
     * Getting query separator
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getSeparator()
    {
        return $this->separator;
    }
    
    /**
     * Getting fields
     *
     * @param Array $data 
     * @return array
     * @author Sergey Startsev
     */
    protected function getFields(Array $data)
    {
        $fields = array();
        
        if (isset($data[0])) {
            $fields = array_keys($data[0]);
        }
        
        return $fields;
    }
    
}
