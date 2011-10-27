<?php
/**
 * This is a "service" class that can be used to fetch informations about
 * server environment that studio is currently running on.
 * It can also be used to modify that environment (especially create new vhost)
 * 
 * This one is made only for apache but it can be broken apart to some
 * interface and many classes for many werbservers (nginx ?)
 * 
 * Some assumtions that needs to be taken into account.
 * * Vhosts will be launched on different port numbers starting from 10001
 *   So there should be no other service running on port > 10000 that could cause conflicts
 * * Apache must have Include statement used somewhere that includes dedicated
 *   directory with vhosts definitions of studio projects.
 *   the same directory must be passed to the constructor of this class
 * * There must be sudo installed and configured to allow www-data user use it without password
 *   This is needed to restart apache service
 * * You have to configure properly three studio settings in your app.yml file:
 afs_server_auto_vhost_creation_enabled, afs_server_env_studio_project_vhosts_dir, afs_server_env_apachectl_path
  Check studio's config.php file for default values of those settings
 * 
 * This class throws ServerException when something goes wrong
 * 
 * @author lukas
 */
class ServerEnvironmentService
{
    private $vhostsFilesDirectory;
    private $apachectlBinPath;
    /**
     * If we got domain suffix passed from outside we are assuming that we will
     * be using name based virtual hosts so all of them will be launched on 80 port
     * Otherwise we'll use different port for each project
     * 
     * @var string
     */
    private $vhostsDomainSuffix;
    /**
     * @var ServerVirtualHostCollection
     */
    private $existingVhostCollection;


    /**
     * Check correctness of passed directory and apachectl bin paths and 
     * permissions of current environment
     */
    function __construct($vhostsFilesDirectory, $apachectlBinPath, $vhostsDomainSuffix)
    {
        if (!(
            file_exists($vhostsFilesDirectory)
            && is_dir($vhostsFilesDirectory)
            && is_writable($vhostsFilesDirectory)
        )) {
            throw new ServerException(
                "Please make sure that $vhostsFilesDirectory directory exists and has proper permissions set"
            );
        }
        
        $this->vhostsFilesDirectory = $vhostsFilesDirectory;
        
        if (!is_executable($apachectlBinPath)) {
            throw new ServerException(
                "Please make sure that $apachectlBinPath file is executable"
            );
        }
        
        $this->apachectlBinPath = $apachectlBinPath;
        $this->vhostsDomainSuffix = $vhostsDomainSuffix;
        $this->fetchExistingVhosts();
    }
    
    private function fetchExistingVhosts()
    {
        $this->existingVhostCollection = new ServerVirtualHostCollection($this->vhostsFilesDirectory);
    }
    
    public function getExistingVhosts()
    {
        return $this->existingVhostCollection;
    }
    
    private function isSyntaxValid()
    {
        return $this->executeApachectl('-t');
    }
    
    private function executeApachectl($apachectlArgs, $sudo = false)
    {
        $cmd = '';
        if ($sudo) {
            $cmd = 'sudo ';
        }
            
        $cmd .= "$this->apachectlBinPath $apachectlArgs";
        exec($cmd, $output, $retVal);
        return $retVal === 0;
    }
    
    public function executeSymfonyTask($symfonyProjectDir, $taskAndParameters)
    {
        $cmd = "cd $symfonyProjectDir; sudo ./symfony $taskAndParameters";
        exec($cmd, $output, $retVal);
        return $retVal === 0;
    }
    
    /**
     * Issues graceful restart of web server
     */
    public function restartWebServer() {
        return $this->executeApachectl('graceful', true);
    }
    
    /**
     * From given $projectNameSlug and using provided $documentRoot creates
     * new virtual host on web server
     * 
     * @return ServerVirtualHost Created virtual host
     */
    function createNewProjectVhost($projectNameSlug, $documentRoot)
    {
        $currentVhost = $this->existingVhostCollection->getForSlug($projectNameSlug);
        if ($currentVhost) {
            throw new ServerException("Virtual host with slug '$projectNameSlug' already exists");
        }
        if ($this->vhostsDomainSuffix == '') {
            $newVhostPort = $this->existingVhostCollection->getPortForNewVirtualHost();
        } else {
            $newVhostPort = 80;
        }
        
        $newVhost = ServerVirtualHost::createFor($newVhostPort, $projectNameSlug, $this->vhostsDomainSuffix);
        $vhostDefinition = $newVhost->getVhostDefinition($documentRoot);
        $vhostDefinitionPath = $this->vhostsFilesDirectory.'/'.$newVhost->getFileName();
        
        if (file_exists($vhostDefinitionPath)) {
            throw new ServerException("Vhost definition file: $vhostDefinitionPath already exists");
        }
        
        $status = file_put_contents($vhostDefinitionPath, $vhostDefinition);
        
        if ($status == 0) {
            throw new ServerException("Vhost definition file: $vhostDefinitionPath could not be created.");
        }
        
        if (!$this->isSyntaxValid()) {
            throw new ServerException("Apache configuration is broken.");
        }
        
        return $newVhost;
    }
}
?>