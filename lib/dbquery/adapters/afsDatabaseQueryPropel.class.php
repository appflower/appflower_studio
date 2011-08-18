<?php
/**
 * Database Propel Query class 
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsDatabaseQueryPropel extends afsBaseQueryAdapter
{
    /**
     * For checking validation handler
     */
    private $is_valid = true;
    
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
        eval('$execute_query = ' . $query . ';');
        
        $total = count($execute_query);
        
        if ($total > $limit) {
            $query_limited = $this->limiting($query, $offset, $limit);
            eval('$execute_query = ' . $query_limited . ';');
        }
        
        if (is_object($execute_query)) {
            $response = $this->processClass($query, $execute_query, $total);
        } elseif (is_int($execute_query)) {
            $data = array(array($execute_query));
            $meta = $this->getFields($data);

            $response = afResponseHelper::create()->data($meta, $data, $total)->query($query);
        } else {
            $response = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
        }
        
        return $response;
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
        eval('$execute_query = ' . $query . ';');
        
        if (preg_match('/(.*?)\:\:create\(\)->/si', $query, $matched)) {
            return $this->processQuerySelect("{$matched[1]}::create()->find()", 0, 50);
        }
        
        return afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Query successfully executed')->query($query);
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
        if (preg_match('/->(?:(find|findOne|count|findPk|findOneOrCreate))\(.*?\)/sim', $query)) return self::TYPE_SELECT;
        if (preg_match('/->(?:(update|delete))\(.*?\)/sim', $query)) return self::TYPE_UPDATE;
    }
    
    /**
     * Validate functionality
     * 
     * @param string $query
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function validate($query)
    {
        $response = afResponseHelper::create()->query($query);
        
        if (strpos($query, ';')) return $response->success(false)->message("Query shouldn't have ';' symbol");
        if (!$this->checkSyntax($query)) return $response->success(false)->message("Syntax error");
        if (!preg_match('/(.*?)\:\:create\(\)->/si', $query, $aMatchedClassName)) return $response->success(false)->message("Query doesn't look a valid");
        if (!class_exists($aMatchedClassName[1])) return $response->success(false)->message("Class {$aMatchedClassName[1]} doesn't exists");
        
        $sClassName = $aMatchedClassName[1];
        
        $aError = array();
        if (preg_match_all('/->(.*?)\(.*?\)/si', $query, $aMatchedFunctions)) {
            foreach ($aMatchedFunctions[1] as $function) if (!method_exists($sClassName, $function)) $aError[] = $function;
        }
        
        if (empty($aError)) {
            // Handle shutdown function to catch fatal error
            register_shutdown_function(array($this, 'handleShutdown'));
            
            // adding error handling to catching errors
            set_error_handler(array($this, 'eval_error_handler'));
            
            try {
                @eval('$execute_query = ' . $query . ';');
            } catch (Exception $e) {
                $this->is_valid = false;
                $sMessage = $e->getMessage();
            }
            restore_error_handler();
            
            if ($this->is_valid) return $response->success(true)->message('Validated successfully');
            if (isset($sMessage) && !empty($sMessage)) return $response->success(false)->message($sMessage);
            
            return $response->success(false)->message("Please, check syntax")->query($query);
        } 
        
        return $response->success(false)->message("Class {$sClassName} doesn't have functions: " . implode(', ', $aError));
    }
    
    /**
     * Checking syntax when evaluating query
     * 
     * @return boolean
     * @author Sergey Startsev
     */
    private function checkSyntax($query)
    {
        return @eval('return true; ' . $query . ';');
    }
    
    /**
     * Prepare object for output
     * 
     * @param object $object Object of result
     * @return array
     * @author Sergey Startsev
     */
    private function prepareOutput($object)
    {
        return array_merge($object->toArray('fieldName'), $object->getVirtualColumns());
    }
    
    /**
     * Prepare result list of objects for output
     * 
     * @param array $aList List of objects for processing
     * @return array
     * @author Sergey Startsev
     */
    private function prepareList($aList)
    {
        $aResult = array();
        foreach ((array)$aList as $object) {
            $aResult[] = self::prepareOutput($object);
        }
        
        return $aResult;
    }
    
    /**
     * Process class resutls
     * 
     * @param string $execute_query - Executed result 
     * @param mixed execute_query
     * @param int $total
     * @return afResponse
     * @author Sergey Startsev
     */
    private function processClass($query, $execute_query, $total)
    {
        $response = afResponseHelper::create()->query($query);
        
        if ($execute_query instanceof PropelObjectCollection) {
            $oFormatter = $execute_query->getFormatter();
            
            $aResult = (array)$execute_query;
            
            if (count($aResult) > 0) {
                $data = $this->prepareList($aResult);
                $meta = $this->getFields($data);
                
                $response->success(true)->data($meta, $data, $total);
            } else {
                $response->success(true)->data(array(), array(), 0)->message('Nothing has been found');
            }
        } elseif ($execute_query instanceof ModelCriteria) {
            $response->success(false)->message('Please, check syntax')->query($query);
        } elseif ($execute_query instanceof BaseObject) {
            if (is_null($execute_query)) {
                $response->success(true)->data(array(), array(), 0)->message('Nothing has been found');
            } else {
                $data = array($this->prepareOutput($execute_query));
                $meta = $this->getFields($data);
                
                $response->success(true)->data($meta, $data, $total);
            }
        } elseif ($execute_query instanceof PropelArrayCollection) {
            $aResults = (array)$execute_query;
            
            if (count($aResults) > 0) {
                if (!is_array($aResults[0])) {
                    $oFormatter = $execute_query->getFormatter();
                    $aColumns = $oFormatter->getAsColumns();
                    $sColumn = str_replace('"', '', key($aColumns));
                    
                    foreach ($aResults as &$row) $row = array($sColumn => $row);
                }
                
                $data = $aResults;
                $meta = $this->getFields($data);
                
                $response->success(true)->data($meta, $data, $total);
            } else {
                $response->success(true)->data(array(), array(), 0)->message('Nothing has been found');
            }
        } else {
            $response->success(true)->data(array(), array(), 0)->message('Nothing has been found');
        }
        
        return $response;
    }
    
    /**
     * Limiting query
     * 
     * @param string $query
     * @param int $offset
     * @param int $limit
     * @return string
     * @author Sergey Startsev
     */
    private function limiting($query, $offset = 0, $limit = 50)
    {
        $bMatchedOffset = preg_match('/::create\(\).*?->offset\(\s*?(\d+)\s*\)/sim', $query, $matched_offset);
        $bMatchedLimit = preg_match('/::create\(\).*?->limit\(\s*?(\d+)\s*\)/sim', $query, $matched_limit);
        
        if ($bMatchedOffset && $bMatchedLimit) {
            // Limit and offset has been matched
            
            $nOffset = (int)$matched_offset[1] + $offset;
            $nLimit = ($matched_limit[1] < $limit) ? $matched_limit[1] : $limit;
            
            if (($nOffset + $nLimit) > ($matched_offset[1] + $matched_limit[1])) {
                $nLimit = ($matched_offset[1] + $matched_limit[1]) - $nOffset;
            }
            
            $query = preg_replace('/->offset\(\s*?(\d+)\s*\)/sim', "->offset({$nOffset})", $query);
            $query = preg_replace('/->limit\(\s*?(\d+)\s*\)/sim', "->limit({$nLimit})", $query);
        } elseif (!$bMatchedOffset && $bMatchedLimit) {
            // Matched only limit
            
            $nLimit = ($matched_limit[1] < $limit) ? $matched_limit[1] : $limit;
            
            if (($offset + $limit) > $matched_limit[1]) {
                $nLimit = $matched_limit[1] - $offset;
            }
            
            $nPosition = strripos($query, '->');
            if ($nPosition !== false) {
                $sSelect = substr($query, $nPosition, strlen($query));
                $query = str_replace($sSelect, "->offset({$offset}){$sSelect}", $query);
            }
            
            $query = preg_replace('/->limit\(\s*?(\d+)\s*\)/sim', "->limit({$nLimit})", $query);
        } else {
            // Nothing has been matched
            
            $nPosition = strripos($query, '->');
            if ($nPosition !== false) {
                $sSelect = substr($query, $nPosition, strlen($query));
                $query = str_replace($sSelect, "->offset({$offset})->limit({$limit}){$sSelect}", $query);
            }
        }
        
        return $query;
    }
    
    /**
     * Eval error handler
     *
     * @author Sergey Startsev
     */
    public function eval_error_handler($number, $error, $file, $line)
    {
        $this->is_valid = false;
    }
    
    /**
     * Hadle fatal error via shutdown function
     * 
     * @return string
     * @author Sergey Startsev
     */
    public function handleShutdown() 
    {
        $error = error_get_last();
        if ($error !== NULL) {
            echo afResponseHelper::create()->success(false)->message('Please, check syntax. Fatal Error: ' . $error['message'])->asJson();
            die;
        } 
    }
    
}
