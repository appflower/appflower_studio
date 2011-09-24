<?php
/**
 * afStudioUserValidator - Validate fields before saving/updating
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioUserValidator
{
    /**
     * Default error template
     */
    const ERROR_DEFAULT = "Field `%field%` not valid";
    
    /**
     * Empty error template
     */
    const ERROR_EMPTY = "`%field%` shouldn't be empty";
    
    /**
     * More than some symbols error template
     */
    const ERROR_MORE_THAN = "`%field%` should be more than %value% symbols";
    
    /**
     * Validate processing
     *
     * @param array $info
     * @return mixed - Array or boolean
     * @author Sergey Startsev
     */
    public static function process(Array $info)
    {
        $aErrors = array();
        
        foreach ((array)$info as $field_name => $field_value) {
            $validator_name = 'validate' . self::getPhpName($field_name);
            
            if (method_exists(__CLASS__, $validator_name)) {
                $validate = call_user_func(array(__CLASS__, $validator_name), $field_value);
                if (!is_bool($validate) || $validate === false) {
                    $aErrors[$field_name] = (is_string($validate)) ? $validate : self::templateDefault($field_name);
                }
            } else {
                // If needed in future uncomment to next string to throw error if validate function doesn't exists
                // throw new Exception("Validator: '{$validator_name}' not defined");
            }
        }
        
        if (!empty($aErrors)) return $aErrors;
        
        return true;
    }
    
    /**
     * Username validate functionality
     *
     * @param srting $value
     * @return mixed
     * @author Sergey Startsev
     */
    public static function validateUsername($value)
    {
        if (empty($value)) return self::fetchError(self::templateEmpty('Username'));
        if (strlen($value) < 3) return self::fetchError(self::templateMoreThan('Username', 3));
        if (!preg_match('/^[a-zA-Z0-9_]{1,}$/i', $value)) return self::fetchError("Username has deprecated symbols. a-z, 0-9 and _ allowed");
        
        return true;
    }
    
    /**
     * First Name validate functionality
     *
     * @param string $value
     * @return mixed
     * @author Sergey Startsev
     */
    public static function validateFirstName($value)
    {
        if (empty($value)) {
            return self::fetchError(self::templateEmpty('First Name'));
        }
        
        return true;
    }
    
    /**
     * Last Name validate functionality
     *
     * @param string $value
     * @return mixed
     * @author Sergey Startsev
     */
    public static function validateLastName($value)
    {
        if (empty($value)) {
            return self::fetchError(self::templateEmpty('Last Name'));
        }
        
        return true;
    }
    
    /**
     * Password validate functionality
     *
     * @param string $value
     * @return mixed
     * @author Sergey Startsev
     */
    public static function validatePassword($value)
    {
        if (empty($value)) {
            return self::fetchError(self::templateEmpty('Password'));
        } elseif (strlen($value) < 5) {
            return self::fetchError(self::templateMoreThan('Password', 5));
        } 
        
        // Valid
        return true;
    }
    
    /**
     * Email validate functionality
     *
     * @param string $value
     * @return mixed
     * @author Sergey Startsev
     */
    public static function validateEmail($value)
    {
        if (empty($value)) {
            return self::fetchError(self::templateEmpty('Email'));
        } elseif (!preg_match('/^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i', $value)) {
            return self::fetchError(self::templateDefault('Email'));
        } else {
            return true;
        }
    }
    
    /**
     * Role validate functionality
     *
     * @param string $value
     * @return mixed
     * @author Sergey Startsev
     */
    public static function validateRole($value)
    {
        if (empty($value)) {
            return self::fetchError(self::templateEmpty('Role'));
        } elseif ($value != 'user' && $value != 'admin') {
            return self::fetchError('Role should be one of `admin`, `user`');
        }
        
        return true;
    }
    
    /**
     * Fetching error, for now just return message
     *
     * @param string $message
     * @return string
     * @author Sergey Startsev
     */
    private static function fetchError($message)
    {
        return $message;
    }
    
    /**
     * Getting validate name function
     *
     * @param string $schemaName
     * @return string
     * @author Sergey Startsev
     */
    private static function getPhpName($schemaName)
    {
        $name = "";
        $tok = strtok($schemaName, '_');
        while ($tok !== false) {
            $name .= ucfirst($tok);
            $tok = strtok('_');
        }
        return $name;
    }
    
    /**
     * Getting template for empty output
     *
     * @param string $field
     * @return string
     * @author Sergey Startsev
     */
    private static function templateEmpty($field)
    {
        return str_replace('%field%', $field, self::ERROR_EMPTY);
    }
    
    /**
     * Getting template for 'more than' template
     *
     * @param string $field
     * @param int $value
     * @return string
     * @author Sergey Startsev
     */
    private static function templateMoreThan($field, $value)
    {
        return str_replace(array('%field%', '%value%'), array($field, $value), self::ERROR_MORE_THAN );
    }
    
    /**
     * Getting default template for field
     *
     * @param string $field
     * @return string
     * @author Sergey Startsev
     */
    private static function templateDefault($field)
    {
        return str_replace('%field%', $field, self::ERROR_DEFAULT);
    }
    
}
