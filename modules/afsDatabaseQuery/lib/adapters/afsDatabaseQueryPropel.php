<?php
/**
 * Database Propel Query class 
 * 
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsDatabaseQueryPropel extends BaseQueryAdapter
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
            $afResponse = $this->processClass($query, $execute_query, $total);
        } elseif (is_int($execute_query)) {
            $data = array(array($execute_query));
            $meta = $this->getFields($data);

            $afResponse = afResponseHelper::create()->data($meta, $data, $total)->query($query);
        } else {
            $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
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
        eval('$execute_query = ' . $query . ';');
        
        $afResponse = afResponseHelper::create()
                        ->success(true)
                        ->data(array(), array(), 0)
                        ->message('Query successfully executed')
                        ->query($query);
        
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
        if (preg_match('/->(?:(find|findOne|count|findPk|findOneOrCreate))\(.*?\)/sim', $query)) {
            $this->type = self::TYPE_SELECT;
        } elseif (preg_match('/->(?:(update|delete))\(.*?\)/sim', $query)) {
            $this->type = self::TYPE_UPDATE;
        }
        
        return $this->type;
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
        if (strpos($query, ';')) {
            $afResponse = afResponseHelper::create()->success(false)->message("Query shouldn't have ';' symbol")->query($query);
        } else {
            
            if ($this->checkSyntax($query)) {
            
                $bError = false;
                
                if (preg_match('/(.*?)\:\:create\(\)->/si', $query, $aMatchedClassName)) {
                    $sClassName = $aMatchedClassName[1];
                    
                    if (class_exists($sClassName)) {
                        
                        $aError = array();
                        if (preg_match_all('/->(.*?)\(.*?\)/si', $query, $aMatchedFunctions)){
                            
                            foreach ($aMatchedFunctions[1] as $function) {
                                if (!method_exists($sClassName, $function)) {
                                    $bError = true;
                                    $aError[] = $function;
                                }
                            }
                            
                            $afResponse = afResponseHelper::create()->success(true)->message($aMatchedFunctions[1])->query($query);
                        }
                        
                        if (!$bError) {
                            // Checking for errors when executing query
                            
                            // Handle shutdown function to catch fatal error
                            register_shutdown_function(array($this, 'handleShutdown'));
                            
                            // adding error handling to catching errors
                            set_error_handler(array($this, 'eval_error_handler'));
                            
                            // using try-catch to catching errors that symfony catch
                            try {
                                @eval('$execute_query = ' . $query . ';');
                            } catch (Exception $e) {
                                $this->is_valid = false;
                                $sMessage = $e->getMessage();
                            }
                            restore_error_handler();
                            
                            if ($this->is_valid) {
                                $afResponse = afResponseHelper::create()->success(true)->message('Validated successfully')->query($query);
                            } else {
                                if (isset($sMessage) && !empty($sMessage)) {
                                    $afResponse = afResponseHelper::create()->success(false)->message($sMessage)->query($query);
                                } else {
                                    $afResponse = afResponseHelper::create()->success(false)->message("Please, check syntax")->query($query);
                                }
                            }
                            
                        } else {
                            $sError = implode(', ', $aError);
                            $afResponse = afResponseHelper::create()->success(false)->message("Class {$sClassName} doesn't have functions: {$sError}")->query($query);
                        }
                    } else {
                        $afResponse = afResponseHelper::create()->success(false)->message("Class {$sClassName} doesn't exists")->query($query);
                    }
                    
                } else {
                    $afResponse = afResponseHelper::create()->success(false)->message("Query doesn't look a valid")->query($query);
                }
            } else {
                $afResponse = afResponseHelper::create()->success(false)->message("Syntax error")->query($query);
            }
        }
        
        return $afResponse;
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
        if ($execute_query instanceof PropelObjectCollection) {
            $oFormatter = $execute_query->getFormatter();
            
            $aResult = (array)$execute_query;
            
            if (count($aResult) > 0) {
                $data = $this->prepareList($aResult);
                $meta = $this->getFields($data);
                
                $afResponse = afResponseHelper::create()->success(true)->data($meta, $data, $total)->query($query);
            } else {
                $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
            }
            
        } elseif ($execute_query instanceof ModelCriteria) {
            // $result = $this->fetchError("Please, check syntax");
            $afResponse = afResponseHelper::create()->success(false)->message('Please, check syntax')->query($query);
            
        } elseif ($execute_query instanceof BaseObject) {
            if (is_null($execute_query)) {
                $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
            } else {
                $data = array($this->prepareOutput($execute_query));
                $meta = $this->getFields($data);
                
                $afResponse = afResponseHelper::create()->success(true)->data($meta, $data, $total)->query($query);
            }
        } elseif ($execute_query instanceof PropelArrayCollection) {
            
            $aResults = (array)$execute_query;
            
            if (count($aResults) > 0) {
                if (!is_array($aResults[0])) {
                    $oFormatter = $execute_query->getFormatter();
                    $aColumns = $oFormatter->getAsColumns();
                    $sColumn = str_replace('"', '', key($aColumns));
                    
                    foreach ($aResults as &$row) {
                        $row = array($sColumn => $row);
                    }
                }
                
                $data = $aResults;
                $meta = $this->getFields($data);
                
                $afResponse = afResponseHelper::create()->success(true)->data($meta, $data, $total)->query($query);
            } else {
                $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
            }
        } else {
            $afResponse = afResponseHelper::create()->success(true)->data(array(), array(), 0)->message('Nothing has been found')->query($query);
        }
        
        return $afResponse;
        
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
        if($error !== NULL){
            echo afResponseHelper::create()->success(false)->message('Please, check syntax. Fatal Error: ' . $error['message'])->asJson();
        } 
    }
    
}
