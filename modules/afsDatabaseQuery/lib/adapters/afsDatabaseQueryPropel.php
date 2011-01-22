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
     * Processing query
     * 
     * @param $query Propel Query for executing
     * @return mixed
     */
    public function process($query)
    {
        $this->setQuery(trim($query));

        $aValidate = $this->validate();
        
        if ($aValidate['success']) {
            eval('$execute_query = ' . $query . ';');
            
            $sClass = get_class($execute_query);
            
            if ($execute_query instanceof PropelObjectCollection) {
                $oFormatter = $execute_query->getFormatter();
                
                $aResult = (array)$execute_query;
                
                if (count($aResult) > 0) {
                    $result = $this->fetchSuccess($this->prepareList($aResult));
                } else {
                    $result = $this->fetchInfo('Nothing has been found');
                }
                
            } elseif ($execute_query instanceof ModelCriteria) {
                $result = $this->fetchError("Please, check syntax");
                
            } elseif ($execute_query instanceof BaseObject) {
                if (is_null($execute_query)) {
                    $result = $this->fetchInfo('Nothing has been found');
                } else {
                    $result = $this->fetchSuccess(array($this->prepareOutput($execute_query)));
                }
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
                            
                            set_error_handler(array($this, 'eval_error_handler'));
                            @eval('$execute_query = ' . $this->query . ';');
                            restore_error_handler();
                            
                            if ($this->is_valid) {
                                $return = $this->fetchSuccess('Validated successfully');
                            } else {
                                $return = $this->fetchError("Please, check syntax");
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
    
    
}
