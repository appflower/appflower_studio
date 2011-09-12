<?php
/**
 * Fixes afStudio permissions. Set server group to user groups
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsPermissionsTask extends sfBaseTask
{
    /**
     * Default mode 
     */
    const DEFAULT_MODE = "g+rwX";
    
    /**
     * Default recursive parameter
     */
    const DEFAULT_RECURSIVE = false;
    
    /**
     * Configuration file in studio environment
     */
    const CONFIGURATION = 'permissions.yml';
    
    /**
     * Folders identificator
     */
    const CONFIG_FOLDER = 'folders';
    
    /**
     * Config folder path identifacator
     */
    const CONFIG_FOLDER_PATH = 'path';
    
    /**
     * Config folder mode identifacator
     */
    const CONFIG_FOLDER_MODE = 'mode';
    
    /**
     * Config folder recursive identifacator
     */
    const CONFIG_FOLDER_RECURSIVE = 'recursive';
    
    /**
     * Config path type
     */
    const CONFIG_PATH_TYPE = 'path_type';
    
    /**
     * Config server identifacator
     */
    const CONFIG_SERVER = 'server';
    
    /**
     * Config server user identifacator
     */
    const CONFIG_SERVER_USER = 'user';
    
    /**
     * Config server user name identifacator
     */
    const CONFIG_SERVER_USER_NAME = 'name';
    
    /**
     * Related path type
     */
    const PATH_TYPE_RELATED = 'related';
    
    /**
     * Absolute path type
     */
    const PATH_TYPE_ABSOLUTE = 'absolute';
    
    /**
     * Parsed config file content
     *
     * @var Array
     */
    private $config = null;
    
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('set_web_group', null, sfCommandOption::PARAMETER_OPTIONAL, 'Should be setted www web group to project group as main', false),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'fix-perms';
        $this->briefDescription = 'Fixes af Studio permissions';
        
        $this->detailedDescription = <<<EOF
The [afStudio:permissions|INFO] task fixes af Studio permissions:

  [./symfony afStudio:permissions|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        if (strtolower(substr(PHP_OS, 0, 3)) !== 'win') {
            $root_dir = sfConfig::get('sf_root_dir');
            
            if ($options['set_web_group'] == 'true' || $options['set_web_group'] === true) {
                $this->setWebGroup($options);
            }
            
            // Fix permissions for setted folders
            $command_log = array();
            
            $folders = $this->getFolders();
            foreach ($folders as $folder) {
                $path = (!$this->isAbsolute($folder)) ? $root_dir : '';
                $path .= $this->getFolderPath($folder);
                
                if (file_exists($path)) {
                    $command = array();
                    $command[] = "chmod";
                    if ($this->isRecursive($folder)) $command[] = "-R";
                    $command[] = $this->getFolderMode($folder);
                    $command[] = $path;
                    
                    $command = implode(' ', $command);
                    
                    $change_creds = $this->run_command($command);
                    
                    $command_log[] = $command;
                    
                    $this->logSection('path', sprintf('change permissions %s to %s', $path, $this->getFolderMode($folder)));
                }
            }
            
            $this->log_it("Chmods:\n". implode("\n", $command_log));
        }
    }
    
    /**
     * Set web group as main group for project folder
     *
     * @param Array $options 
     * @return void
     * @author Sergey Startsev
     */
    private function setWebGroup(Array $options)
    {
        $root_dir = sfConfig::get('sf_root_dir');
        
        $dir_info = stat($root_dir);
        
        $owner_id = $dir_info['uid'];
        $owner_gid = $dir_info['gid'];
        $owner_name = $this->run_command("id -un {$owner_id}");
        if (empty($owner_name)) {
            $owner_name = $this->run_command("getent passwd | awk -F: '$3 == {$owner_id} { print $1 }'");
        }
        
        $current_user = get_current_user();
        
        $apache_user = $this->getServerUserName();
        
        if (!empty($apache_user)) {
            $apache_user_gid = $this->run_command("id -g {$apache_user}");
            $apache_user_group_name = $this->run_command("id -gn {$apache_user}");
            
            if (strtolower(PHP_OS) === 'darwin') {
                $change_usermod = $this->run_command("dseditgroup -o edit -a {$owner_name} -t user {$apache_user_group_name}");
            } else {
                $change_usermod = $this->run_command("usermod -a -G {$apache_user_gid} {$owner_name}");
            }
            
            if (!is_bool($change_usermod)) {
                $change_group = $this->run_command("chgrp -R {$apache_user_gid} {$root_dir}");
                
                $this->log_it(
                    "User: {$current_user}. " .
                    "Owner (Id: {$owner_id}, Name: {$owner_name}, Group Id: {$owner_gid}). " .
                    "Apache User: (Name: {$apache_user}, Group Id: {$apache_user_gid}). " . 
                    "Group Changed: {$owner_gid} -> {$apache_user_gid}. Added group to user '{$owner_name}' group '{$apache_user_gid}'\n"
                );
            } else {
                $this->log("Please run task using root credentials. {$change_usermod}");
                $this->log_it("User: {$current_user}. Trying to set credentials - fail. Need to run as root");
            }
        } else {
            $this->log_it("User: {$current_user}. Can't found apache user");
            throw new Exception("Can't found apache user. Please check that apache is running");
        }
    }
    
    /**
     * Execute command
     *
     * @param string $command 
     * @return mixed
     * @author Sergey Startsev
     */
    private function run_command($command)
    {
        ob_start();
        passthru("{$command} 2>&1", $executed);
        $console = trim(ob_get_clean());
        
        return (!$executed) ? $console : false;
    }
    
    /**
     * Log it functionality
     *
     * @param string $row 
     * @author Sergey Startsev
     */
    private function log_it($row)
    {
        $root_dir = sfConfig::get('sf_root_dir');
        $log_dir = "{$root_dir}/log";
        if (is_writable($log_dir)) {
            file_put_contents("{$log_dir}/afsPermissions.log", date("Y-m-d H:i:s") . " - {$row}\n", FILE_APPEND);
        }
    }
    
    /**
     * Get config path 
     *
     * @return string
     * @author Sergey Startsev
     */
    private function getConfigPath()
    {
        return sfConfig::get('sf_plugins_dir') . '/appFlowerStudioPlugin/config/' . self::CONFIGURATION;
    }
    
    /**
     * Getting config, parse config
     *
     * @return Array
     * @author Sergey Startsev
     */
    private function getConfig()
    {
        if (!file_exists($this->getConfigPath())) throw new Exception("Please, define " . self::CONFIGURATION . " config");
        if (is_null($this->config)) $this->config = sfYaml::load($this->getConfigPath());
        
        return $this->config;
    }
    
    /**
     * Getting folders
     *
     * @return Array
     * @author Sergey Startsev
     */
    private function getFolders()
    {
        $config = $this->getConfig();
        
        if (!isset($config[self::CONFIG_FOLDER])) {
            throw new Exception("Please define folders parameter");
        }
        
        return $config[self::CONFIG_FOLDER];
    }
    
    /**
     * Getting server options
     *
     * @return Array
     * @author Sergey Startsev
     */
    private function getServerOptions()
    {
        $config = $this->getConfig();
        
        if (isset($config[self::CONFIG_SERVER])) {
            return $config[self::CONFIG_SERVER];
        }
        
        return false;
    }
    
    /**
     * Getting server user name
     *
     * @return string
     * @author Sergey Startsev
     */
    private function getServerUserName()
    {
        $server = $this->getServerOptions();
        if ($server) {
            if (isset($server[self::CONFIG_SERVER_USER])) {
                if (isset($server[self::CONFIG_SERVER_USER][self::CONFIG_SERVER_USER_NAME])) {
                    $apache_user = $server[self::CONFIG_SERVER_USER][self::CONFIG_SERVER_USER_NAME];
                    
                    $user_exists = $this->run_command("id {$apache_user}");
                    if (is_bool($user_exists)) throw new Exception("Defined user doesn't exists");
                } else {
                    throw new Exception("Please set 'name' option for user");
                }
            } else {
                throw new Exception("Please set 'user' option");
            }
        } else {
            // prediction 
            $apache_user = trim(`ps axho user,comm|grep -E "httpd|apache"|uniq|grep -v "root"|awk 'END {print $1}'`);
            if (empty($apache_user)) {
                throw new Exception("Can't found server user");
            }
        }
        
        return $apache_user;
    }
    
    /**
     * Getting folder path from folder
     *
     * @param Array $folder 
     * @return string
     * @author Sergey Startsev
     */
    private function getFolderPath(Array $folder)
    {
        if (!isset($folder[self::CONFIG_FOLDER_PATH])) {
            throw new Exception("For folder not defined path parameter. Please re-check paths for folders");
        }
        
        return $folder[self::CONFIG_FOLDER_PATH];
    }
    
    /**
     * Check is recursive parameter set to true
     *
     * @param Array $folder 
     * @return boolean
     * @author Sergey Startsev
     */
    private function isRecursive(Array $folder)
    {
        if (isset($folder[self::CONFIG_FOLDER_RECURSIVE])) {
            return (bool)$folder[self::CONFIG_FOLDER_RECURSIVE];
        }
        
        return self::DEFAULT_RECURSIVE;
    }
    
    /**
     * Getting folder mode
     *
     * @param Array $folder 
     * @return string
     * @author Sergey Startsev
     */
    private function getFolderMode(Array $folder)
    {
        if (isset($folder[self::CONFIG_FOLDER_MODE])) {
            return $folder[self::CONFIG_FOLDER_MODE];
        }
        
        return self::DEFAULT_MODE;
    }
    
    /**
     * Getting path type
     *
     * @param Array $folder 
     * @return string
     * @author Sergey Startsev
     */
    private function getPathType(Array $folder)
    {
        if (isset($folder[self::CONFIG_PATH_TYPE])) {
            return $folder[self::CONFIG_PATH_TYPE];
        }
        
        return self::PATH_TYPE_RELATED;
    }
    
    /**
     * Checking is absolute path
     *
     * @param Array $folder 
     * @return boolean
     * @author Sergey Startsev
     */
    private function isAbsolute(Array $folder)
    {
        return $this->getPathType($folder) == self::PATH_TYPE_ABSOLUTE;
    }
    
    /**
     * Checking is related path
     *
     * @param Array $folder 
     * @return boolean
     * @author Sergey Startsev
     */
    private function isRelated(Array $folder)
    {
        return $this->getPathType($folder) == self::PATH_TYPE_RELATED;
    }
    
}
