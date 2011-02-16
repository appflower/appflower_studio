<?php
/**
 * afStudioUser
 *
 * @author startsev.sergey@gmail.com
 */
class afStudioUser
{
	/**
     * Cookie user identificator
     */
    const USER_IDENTIFICATOR = 'app_flower_studio_credentials';
    
    /**
     * User identificator - username
     */
    private $username;
    
    /**
     * Meta data area
     */
    private $first_name,
            $last_name,
            $email,
            $role;
    
    /**
     * User authentication status
     */
    private $is_authenticated = false;
    
    /**
     * Class instance
     */
    private static $instance = null;
    
    private function __construct() {}
    
    /**
     * Retrieve the instance of this class.
     */
    public static function getInstance()
    {
        if (!isset(self::$instance)) {
          self::$instance = new afStudioUser;
        }
        
        return self::$instance;
    }
    
    /**
     * Getting user status
     * 
     * @return boolean
     */
    public function isAuthenticated()
    {
        return $this->is_authenticated;
    }
    
    /**
     * Process authorization
     * 
     * @return boolean Has been authorized user
     */
    public function authorize()
    {
        if ($cookie = sfContext::getInstance()->getRequest()->getCookie(self::USER_IDENTIFICATOR)) {
            
            $aInfo = explode(':', $cookie);
            
            $sUsername = $aInfo[0];
            $sHash = $aInfo[1];
            
            $user = $this->retrieve($sUsername);
            
            if ($user) {
                $sHashNative = sha1($sUsername . $user['password']);
                
                if ($sHash == $sHashNative) {
                    $this->username = $sUsername;
                    $this->initialize($user);
                    
                    $this->is_authenticated = true;
                    
                    return true;
                } 
            }
        } 
        
        return false;
    }
    
    /**
     * Retrieve user via username from user collection
     * 
     * @param string Needle username
     * @return mixed
     */
    public static function retrieve($username)
    {
        $aUsers = self::getCollection();
            
        $user = (isset($aUsers[$username]) && !empty($aUsers[$username])) ? $aUsers[$username] : false;
        
        return $user;
    }
    
    /**
     * Sign out functionality
     */
    public function signOut()
    {
        sfContext::getInstance()->getResponse()->setCookie(self::USER_IDENTIFICATOR, '', time() + 1);
    }
    
    /**
     * Fix user to system using credentials
     * 
     * @param   string  $username
     * @param   string  $password
     * @param   boolean $remember
     */
    public static function set($username, $password, $remember = false)
    {
        sfContext::getInstance()->getResponse()->setCookie(
            self::USER_IDENTIFICATOR, 
            $username . ':' . sha1($username . sha1($password)), 
            (($remember) ? time() + 60*60*24*15 : 0)
        );
    }
    
    /**
     * Initialization user meta data
     * 
     * @param array
     */
    private function initialize($user)
    {
        if (isset($user['first_name'])) {
            $this->first_name = $user['first_name'];
        }
        
        if (isset($user['last_name'])) {
            $this->last_name = $user['last_name'];
        }
        
        if (isset($user['email'])) {
            $this->email = $user['email'];
        }
        
        if (isset($user['role'])) {
            $this->role = $user['role'];
        }
    } 
    
    /**
     * Getting meta First Name
     */
    public function getFirstName()
    {
        return $this->first_name;
    }
    
    /**
     * Getting meta Last Name
     */
    public function getLastName()
    {
        return $this->last_name;
    }
    
    /**
     * Getting meta Email
     */
    public function getEmail()
    {
        return $this->email;
    }
    
    /**
     * Getting meta Role
     */
    public function getRole()
    {
        return $this->role;
    }
    
    
    
    
    /**
     * Getting user collection path
     * 
     * @return string
     */
    public static function getCollectionPath()
    {
        return sfConfig::get('sf_plugins_dir') . '/appFlowerStudioPlugin/config/users.yml';
    }
    
    /**
     * Getting user collection 
     * 
     * @return array
     */
    public static function getCollection()
    {
        return sfYaml::load(self::getCollectionPath());
    }
    
    /**
     * Setting user collection
     * 
     * @param   array $definition 
     */
    public static function setCollection($definition)
    {
        file_put_contents(self::getCollectionPath(), sfYaml::dump($definition));
    }
    
}

