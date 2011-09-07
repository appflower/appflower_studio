<?php
/**
 * This is a "service" class that can be used to fetch informations about
 * server environment that studio is currently running on.
 * It can also be used to modify that environment
 * 
 * This one is made only for apache but it can be broken apart to some
 * interface and many classes for many werbservers (nginx ?)
 * 
 * Some assumtions that needs to be taken into account.
 * * Apache must be configured to listen on 10001-10100 ports - each port is dedicated to one AF/studio project
 *   So we are assuming maximum number of 100 projects managed on one server environment
 * * Apache must have Include statement used somewhere that includes dediacted
 *   directory with vhosts definitions of studio projects.
 *   the same directory must be passed to the constructor of this class
 * * There must be sudo installed and configured to allow www-data user use it without password
 *   This is needed to restart apache service
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
     * @var ServerVirtualHostCollection
     */
    private $existingVhostCollection;


    /**
     * Check correctness of passed directory and apachectl bin paths and 
     * permissions of current environment
     */
    function __construct($vhostsFilesDirectory, $apachectlBinPath)
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
        $this->fetchExistingVhosts();
    }
    
    private function fetchExistingVhosts()
    {
        $this->existingVhostCollection = new ServerVirtualHostCollection($this->vhostsFilesDirectory);
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
        
        $newVhostPort = $this->existingVhostCollection->getPortForNewVirtualHost();
        
        $newVhost = ServerVirtualHost::createFor($newVhostPort, $projectNameSlug);
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