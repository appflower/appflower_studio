<?php
/**
 * This class represents currently existing AF/studio virtual hosts
 *
 * @author lukas
 */
class ServerVirtualHostCollection {
    
    private $vhosts;
    
    function __construct($vhostsFilesDirectory) {
        $this->vhosts = $this->fetchStudioProjects($vhostsFilesDirectory);
    }
    
    function getAll()
    {
        return $this->vhosts;
    }
    
    /**
     * Iterates through existing vhosts looking for first not used port number
     * @return int 
     */
    function getPortForNewVirtualHost()
    {
        $vhostsCount = count($this->vhosts);
        if ($vhostsCount > 0) {
            $lastVhost = $this->vhosts[$vhostsCount-1];
            $lastVhostPort = $lastVhost->getPort();
            $newVhostPort = $lastVhostPort+1;
        } else {
            $newVhostPort = 10001;
        }
        
        return $newVhostPort;
    }
    
    /**
     * Returns vhost with provided $slug
     * 
     * @param string $slug
     * @return ServerVirtualHost
     */
    function getForSlug($slug)
    {
        foreach ($this->vhosts as $vhost) {
            if ($vhost->getSlug() == $slug) {
                return $vhost;
            }
        }
    }
    
    private function fetchStudioProjects($vhostsFilesDirectory)
    {
        $finder = new sfFinder();
        $vhostDefinitionPaths = $finder->in($vhostsFilesDirectory);
        $vhosts = array();
        foreach ($vhostDefinitionPaths as $vhostDefinitionPath) {
            $vhosts[] = new ServerVirtualHost($vhostDefinitionPath);
        }
        usort($vhosts, array($this,'sortVhosts'));
        
        return $vhosts;
    }
    
    
    function sortVhosts($vhost1, $vhost2)
    {
        if ($vhost1->getPort() < $vhost2->getPort()) {
            return -1;
        } else if($vhost1->getPort() > $vhost2->getPort()) {
            return 1;
        } else {
            return 0;
        }
    }
}

?>