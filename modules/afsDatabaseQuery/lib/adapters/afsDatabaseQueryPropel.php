<?php
/**
 * Database Propel Query class 
 * 
 * @author startsev.sergey@gmail.com
 */
class afsDatabaseQueryPropel extends BaseQueryAdapter
{
    /**
     * For checking validation handler
     */
    private $is_valid = true;
    
    /**
     * Total found rows
     */
    private $total = 0;
    /**
     * Processing query
     * 
     * @param $query Propel Query for executing
     * @param $offset 
     * @param $limit
     * @return mixed
     */
    public function process($query, $offset = 0, $limit = 50)
    {
        $this->setQuery(trim($query));

        $aValidate = $this->validate();
        
        if ($aValidate['success']) {
            eval('$execute_query = ' . $this->query . ';');
            
            $this->total = count($execute_query);
            
            if ($this->total > $limit) {
                $this->limiting($offset, $limit);
                eval('$execute_query = ' . $this->query . ';');
            }
            
            if (is_object($execute_query)) {
                $result = $this->processClass($execute_query);
            } elseif (is_int($execute_query)) {
                
                $aResult = array(
                                'result' => array(array($execute_query)),
                                'count' => $this->total
                );
                $result = $this->fetchSuccess($aResult);
            } else {
                $result = $this->fetchInfo('Nothing has been found');
            }
        } else {
            $result = $aValidate;
        }
        
        return $result;
    }
    
    /**
     * Eval error handler
     */
    public function eval_error_handler($number, $error, $file, $line)
    {
        $this->is_valid = false;
    }
    
    /**
     * Validate functionality
     * 
     * @return array
     */
    private function validate()
    {
        if (strpos($this->query, ';')) {
            $return = $this->fetchError("Query shouldn't have ';' symbol");
        } else {
            
            if ($this->checkSyntax()) {
            
                $bError = false;
                
                if (preg_match('/(.*?)\:\:create\(\)->/si', $this->query, $aMatchedClassName)) {
                    $sClassName = $aMatchedClassName[1];
                    
                    if (class_exists($sClassName)) {
                        
                        $aError = array();
                        if (preg_match_all('/->(.*?)\(.*?\)/si', $this->query, $aMatchedFunctions)){
                            
                            foreach ($aMatchedFunctions[1] as $function) {
                                if (!method_exists($sClassName, $function)) {
                                    $bError = true;
                                    $aError[] = $function;
                                }
                            }
                            
                            $return = $this->fetchSuccess($aMatchedFunctions[1]);
                        }
                        
                        if (!$bError) {
                            // Checking for errors when executing query
                            
                            // Handle shutdown function to catch fatal error
                            register_shutdown_function(array($this, 'handleShutdown'));
                            
                            // adding error handling to catching errors
                            set_error_handler(array($this, 'eval_error_handler'));
                            
                            // using try-catch to catching errors that symfony catch
                            try {
                                @eval('$execute_query = ' . $this->query . ';');
                            } catch (Exception $e) {
                                $this->is_valid = false;
                                $sMessage = $e->getMessage();
                            }
                            restore_error_handler();
                            
                            if ($this->is_valid) {
                                $return = $this->fetchSuccess('Validated successfully');
                            } else {
                                if (isset($sMessage) && !empty($sMessage)) {
                                    $return = $this->fetchError($sMessage);
                                } else {
                                    $return = $this->fetchError("Please, check syntax");
                                }
                            }
                            
                        } else {
                            $sError = implode(', ', $aError);
                            $return = $this->fetchError("Class {$sClassName} doesn't have functions: {$sError}"); 
                        }
                    } else {
                        $return = $this->fetchError("Class {$sClassName} doesn't exists");
                    }
                    
                } else {
                    $return = $this->fetchError("Query doesn't look a valid");
                }
            } else {
                $return = $this->fetchError("Syntax error");
            }
        }
        
        return $return;
    }
    
    /**
     * Checking syntax when evaluating query
     * 
     * @return boolean
     */
    private function checkSyntax()
    {
        return @eval('return true; ' . $this->query . ';');
    }
    
    /**
     * Prepare object for output
     * 
     * @param $object Object of result
     * @return array
     */
    private function prepareOutput($object)
    {
        return array_merge($object->toArray('fieldName'), $object->getVirtualColumns());
    }
    
    /**
     * Prepare result list of objects for output
     * 
     * @param $aList List of objects for processing
     * @return array
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
     * Hadle fatal error via shutdown function
     */
    public function handleShutdown() {
        $error = error_get_last();
        if($error !== NULL){
            echo json_encode($this->fetchError('Please, check syntax. Fatal Error: ' . $error['message']));
        } 
    }
    
    /**
     * Process class resutls
     * 
     * @param $execute_query Executed result 
     * @return mixed
     */
    private function processClass($execute_query)
    {
        if ($execute_query instanceof PropelObjectCollection) {
            $oFormatter = $execute_query->getFormatter();
            
            $aResult = (array)$execute_query;
            
            if (count($aResult) > 0) {
                $aResult = array(
                                'result' => $this->prepareList($aResult),
                                'count' => $this->total
                );
                $result = $this->fetchSuccess($aResult);
            } else {
                $result = $this->fetchInfo('Nothing has been found');
            }
            
        } elseif ($execute_query instanceof ModelCriteria) {
            $result = $this->fetchError("Please, check syntax");
            
        } elseif ($execute_query instanceof BaseObject) {
            if (is_null($execute_query)) {
                $result = $this->fetchInfo('Nothing has been found');
            } else {
                $aResult = array(
                                'result' => $this->fetchSuccess(array($this->prepareOutput($execute_query))),
                                'count' => $this->total
                );
                $result = $aResult;
            }
        } elseif ($execute_query instanceof PropelArrayCollection) {
            $aResult = (array)$execute_query;
            
            if (count($aResult) > 0) {
                $aResult = array(
                                'result' => $aResult,
                                'count' => $this->total
                );
                $result = $this->fetchSuccess($aResult);
            } else {
                $result = $this->fetchInfo('Nothing has been found');
            }
        } else {
            $result = $this->fetchInfo('Nothing has been found');
        }
        
        return $result;
        
    }
    
    /**
     * Limiting query by default
     * 
     * @param $offset
     * @param $limit
     */
    private function limiting($offset = 0, $limit = 50)
    {
        $bMatchedOffset = preg_match('/::create\(\).*?->offset\(\s*?(\d+)\s*\)/sim', $this->query, $matched_offset);
        $bMatchedLimit = preg_match('/::create\(\).*?->limit\(\s*?(\d+)\s*\)/sim', $this->query, $matched_limit);
        
        if ($bMatchedOffset && $bMatchedLimit) {
            // Limit and offset has been matched
            
            $nOffset = (int)$matched_offset[1] + $offset;
            $nLimit = ($matched_limit[1] < $limit) ? $matched_limit[1] : $limit;
            
            if (($nOffset + $nLimit) > ($matched_offset[1] + $matched_limit[1])) {
                $nLimit = ($matched_offset[1] + $matched_limit[1]) - $nOffset;
            }
            
            $this->query = preg_replace('/->offset\(\s*?(\d+)\s*\)/sim', "->offset({$nOffset})", $this->query);
            $this->query = preg_replace('/->limit\(\s*?(\d+)\s*\)/sim', "->limit({$nLimit})", $this->query);
        } elseif (!$bMatchedOffset && $bMatchedLimit) {
            // Matched only limit
            
            $nLimit = ($matched_limit[1] < $limit) ? $matched_limit[1] : $limit;
            
            if (($offset + $limit) > $matched_limit[1]) {
                $nLimit = $matched_limit[1] - $offset;
            }
            
            $nPosition = strripos($this->query, '->');
            if ($nPosition !== false) {
                $sSelect = substr($this->query, $nPosition, strlen($this->query));
                $this->query = str_replace($sSelect, "->offset({$offset}){$sSelect}", $this->query);
            }
            
            $this->query = preg_replace('/->limit\(\s*?(\d+)\s*\)/sim', "->limit({$nLimit})", $this->query);
        } else {
            // Nothing has been matched
            
            $nPosition = strripos($this->query, '->');
            if ($nPosition !== false) {
                $sSelect = substr($this->query, $nPosition, strlen($this->query));
                $this->query = str_replace($sSelect, "->offset({$offset})->limit({$limit}){$sSelect}", $this->query);
            }
        }
        
    }
    
}
