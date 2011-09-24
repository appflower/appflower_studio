<?php
/**
 * afStudioUser
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioUser
{
    /**
     * Cookie user identificator
     */
    const   USER_IDENTIFICATOR = 'app_flower_studio_credentials';
    
    /**
     * Key for username
     */
    const   USERNAME = 'username';
    
    /**
     * Keys for user in meta file
     */
    const   EMAIL = 'email',
            PASSWORD = 'password',
            FIRST_NAME = 'first_name',
            LAST_NAME = 'last_name',
            ROLE = 'role';
    
    /**
     * User identificator - username
     */
    private $username;
    
    /**
     * Meta data area
     */
    private 
        $first_name,
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
    
    private function __clone() {}
    
    /**
     * Retrieve the instance of this class.
     * 
     * @return afStudioUser
     * @author Sergey Startsev
     */
    static public function getInstance()
    {
        if (!isset(self::$instance)) {
          self::$instance = new self;
        }
        
        return self::$instance;
    }
    
    /**
     * Retrieve user via username from user collection
     * 
     * @param string Needle username
     * @return mixed
     * @author Sergey Startsev
     */
    static public function retrieve($username)
    {
        $users = self::getCollection();
            
        return (isset($users[$username]) && !empty($users[$username])) ? $users[$username] : false;
    }
    
    /**
     * Retrieve user by his mail
     *
     * @param string $email
     * @return mixed
     * @author Sergey Startsev
     */
    static public function retrieveByEmail($email)
    {
        $users = self::getCollection();
        $aUser = array();
        
        foreach ($users as $username => $user) {
            if ($user['email'] == $email) {
                $aUser = $user;
                $aUser['username'] = $username;
                break;
            }
        }
        
        if (!empty($aUser)) return $aUser;
        
        return false;
    }
    
    /**
     * Updating user via username
     *
     * @param string $username
     * @param array $info
     * @return boolean
     * @author Sergey Startsev
     */
    static public function update($username, Array $info)
    {
        $users = self::getCollection();
        
        if (isset($users[$username])) {
            
            foreach ((array)$info as $name => $associate) {
                if (isset($users[$username][$name])) {
                    $users[$username][$name] = $associate;
                }
            }
            
            // Commit changes
            self::setCollection($users);
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Creating new user
     *
     * @param string $username
     * @param array $info
     * @return boolean
     * @author Sergey Startsev
     */
    static public function create($username, Array $info, $filePath = false)
    {
        $users = self::getCollection(
            (!$filePath) ? $filePath : sfConfig::get('sf_plugins_dir') . '/appFlowerStudioPlugin/config/users.yml'
        );
        
        $info[self::PASSWORD] = self::passwordRule($info[self::PASSWORD]);
        
        if ((!$filePath && !isset($users[$username])) || $filePath) {
            $users[$username] = $info;
            self::setCollection($users, $filePath);
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Deleting user functionality
     *
     * @param string $username
     * @return boolean
     * @author Sergey Startsev
     */
    static public function delete($username)
    {
        $users = self::getCollection();
        
        if (isset($users[$username])) {
            // deleting user from list
            unset($users[$username]);
            // commit changes
            self::setCollection($users);
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Password rule for creating (encoding)
     *
     * @param srting $password
     * @return string
     * @author Sergey Startsev
     */
    static public function passwordRule($password)
    {
        return sha1($password);
    }
    
    /**
     * Fix user to system using credentials
     * 
     * @param   string  $username
     * @param   string  $password
     * @param   boolean $remember
     * @author Sergey Startsev
     */
    static public function set($username, $password, $remember = false)
    {
        sfContext::getInstance()->getResponse()->setCookie(
            self::USER_IDENTIFICATOR, 
            $username . ':' . sha1($username . sha1($password)), 
            (($remember) ? time() + 60*60*24*15 : 0)
        );
    }
    
    /**
     * Validating associated array
     *
     * @param array $info - associated array
     * @return mixed
     * @author Sergey Startsev
     */
    static public function validate(Array $info)
    {
        return afStudioUserValidator::process($info);
    }
    
    /**
     * Getting user collection path
     * 
     * @return string
     * @author Sergey Startsev
     */
    static public function getCollectionPath($filePath = false)
    {
        return (!$filePath) ? sfConfig::get('sf_plugins_dir') . '/appFlowerStudioPlugin/config/users.yml' : $filePath;
    }
    
    /**
     * Getting user collection 
     * 
     * @return array
     * @author Sergey Startsev
     */
    static public function getCollection($filePath = false)
    {
        return sfYaml::load(self::getCollectionPath($filePath));
    }
    
    /**
     * Setting user collection
     * 
     * @param   array $definition 
     * @author Sergey Startsev
     */
    static public function setCollection(Array $definition, $filePath = false)
    {
        afStudioUtil::writeFile(self::getCollectionPath($filePath), sfYaml::dump($definition));
    }
    
    /**
     * Getting user status
     * 
     * @return boolean
     * @author Sergey Startsev
     */
    public function isAuthenticated()
    {
        return $this->is_authenticated;
    }
    
    /**
     * Process authorization
     * 
     * @return boolean - Has been authorized user
     * @author Sergey Startsev
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
     * Sign out functionality
     */
    public function signOut()
    {
        sfContext::getInstance()->getResponse()->setCookie(self::USER_IDENTIFICATOR, '', time() + 1);
    }
    
    /**
     * Getting username
     * 
     * @return string
     * @author Sergey Startsev
     */
    public function getUsername()
    {
        return $this->username;
    }
    
    /**
     * Getting meta First Name
     * 
     * @return string
     * @author Sergey Startsev
     */
    public function getFirstName()
    {
        return $this->first_name;
    }
    
    /**
     * Getting meta Last Name
     * 
     * @return string
     * @author Sergey Startsev
     */
    public function getLastName()
    {
        return $this->last_name;
    }
    
    /**
     * Getting meta Email
     * 
     * @return string
     * @author Sergey Startsev
     */
    public function getEmail()
    {
        return $this->email;
    }
    
    /**
     * Getting meta Role
     * 
     * @return string
     * @author Sergey Startsev
     */
    public function getRole()
    {
        return $this->role;
    }
    
    /**
     * Getting Name - Generate user name from meta-data
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getName()
    {
        if (!empty($this->last_name) && !empty($this->first_name)) {
            $sName = $this->first_name . ' ' . $this->last_name;
        } else {
            $sName = (!empty($this->first_name)) ? $this->first_name : ((!empty($this->last_name)) ? $this->last_name : $this->username);
        }
        
        return $sName;
    }
    
    /**
     * Getting Info about current user
     * 
     * @return mixed - If authenticated - array
     * @author Sergey Startsev
     */
    public function getInfo()
    {
        if ($this->isAuthenticated()) {
            return array(
                'name' => $this->getName(),
                'last_name' => $this->getLastName(),
                'first_name' => $this->getFirstName(),
                'email' => $this->getEmail(),
                'username' => $this->getUsername(),
                'is_admin' => $this->isAdmin(),
            );
        }
        
        return false;
    }
    
    /**
     * Checking - is current user admin
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function isAdmin()
    {
        return ($this->getRole() == 'admin');
    }
    
    /**
     * Initialization user meta data
     * 
     * @param array
     * @author Sergey Startsev
     */
    private function initialize(Array $user)
    {
        if (isset($user['first_name'])) $this->first_name = $user['first_name'];
        if (isset($user['last_name'])) $this->last_name = $user['last_name'];
        if (isset($user['email'])) $this->email = $user['email'];
        if (isset($user['role'])) $this->role = $user['role'];
    }
    
}
