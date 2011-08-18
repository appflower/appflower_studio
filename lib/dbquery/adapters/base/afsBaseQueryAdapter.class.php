<?php
/**
 * Base query adapter class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseQueryAdapter
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
     * Structure query type
     */
    const TYPE_STRUCT = 'struct';
    
    /**
     * Select query type
     */
    const TYPE_SELECT = 'select';
    
    /**
     * Update query type
     */
    const TYPE_UPDATE = 'update';
    
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
    public final function process($query, $offset = 0, $limit = 50)
    {
        $this->setQuery(trim($query));
        
        $dataset = array();
        $success = false;
        
        $queries = $this->separate();
        foreach ($queries as $query) {
            if (!empty($query)) {
                $query = trim($query);
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
    protected function processQuery($query, $offset, $limit)
    {
        $response = $this->validate($query);
        
        if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            $response = $this->processQueryType($query, $offset, $limit);
        }
        
        return $response;
    }
    
    /**
     * Process query by it's type
     *
     * @param string $query 
     * @param int $offset 
     * @param int $limit 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processQueryType($query, $offset, $limit)
    {
        $method = 'processQuery' . ucfirst($this->getType($query));
        
        if (!method_exists($this, $method)) {
            throw new afsBaseQueryAdapterException("You should define method '{$method}'");
        }
        
        return call_user_func_array(array($this, $method), array($query, $offset, $limit));
    }
    
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
        return (isset($data[0])) ? array_keys($data[0]) : array();
    }
    
    /**
     * Validation functionality
     * 
     * @param string $query
     * @return afResponse
     * @author Sergey Startsev
     */
    abstract protected function validate($query);
    
    /**
     * Getting query type
     *
     * @param string $query 
     * @return string
     * @author Sergey Startsev
     */
    abstract protected function getType($query);
    
}
