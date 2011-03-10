<?php
/**
 * User Manager Helper
 *
 * @author startsev.sergey@gmail.com
 */
class afUserManagerHelper
{
    /**
     * Merge errors delimiter
     */
    const MERGE_DELIMITER = '<br/>';
    
    /**
     * Merge 2 error arrays 
     *
     * @param array $errors_first
     * @param arrya $errors_second
     * @return array
     */
    public static function mergeErrors($errors_first, $errors_second)
    {
        foreach ($errors_second as $key => $error) {
            if (isset($errors_first[$key]) && !empty($errors_first[$key])) {
                $errors_first[$key] .= self::MERGE_DELIMITER . $error;
            } else {
                $errors_first[$key] = $error;
            }
        }
        
        return $errors_first;
    }
    
    /**
     * Prepare errors for output
     *
     * @param array $errors
     * @return array
     */
    public static function prepareErrors($errors)
    {
        $aErrors = array();
        foreach ($errors as $fieldname => $error) {
            $aErrors[] = array(
                'fieldname' => $fieldname,
                'message' => $error
            );
        }
        
        return $aErrors;
    } 
    
    
}