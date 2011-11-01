<?php
/**
 * This class represents one virtual host definition
 * It can be treated also as one studio project
 * 
 * It is initiated from path to that given vhost definition file.
 * We are assuming that one file per each virtual host exists
 *
 * @author lukas
 */
class ServerVirtualHost {
    
    private $port;
    private $slug;
    private $filename;
    private $vhostDomain;
    private $vhostDefinitionTemplatePart1 =
'Listen *:__SERVER_PORT__
NameVirtualHost *:__SERVER_PORT__';
    private $vhostDefinitionTemplatePart2 =
'<VirtualHost *:__SERVER_PORT__>
  ServerName __SERVER_NAME__
  DocumentRoot __DOCUMENT_ROOT__

  <Directory "__DOCUMENT_ROOT__">
    AllowOverride All
  </Directory>
  
</VirtualHost>';
    
    /**
     * Name of the file should have strict format.
     * It is port number followed by underscore and project slug name
     * Example: 10001_mynewcoolproject or 10074_my_crm
     * 
     * @param type $vhostDefinitionPath Path to file where vhost declaration is stored
     *                                  It can also be just filename alone
     */
    function __construct($vhostDefinitionPath)
    {
        $this->filename = basename($vhostDefinitionPath);
        $filenameParts = explode('_', $this->filename);
        
        $this->port = $filenameParts[0];
        if (count($filenameParts) == 2) {
            $this->slug = $filenameParts[1];
        } else {
            $this->slug = join('', array_slice($filenameParts, 1));
        }
    }
    
    /**
     * Creates Vhost object from provided $port and $slug
     * If $vhostDomain is passed it replaces default from this class definition
     */
    static function createFor($port, $slug, $vhostDomain = null)
    {
        $vhost = new ServerVirtualHost("{$port}_{$slug}");
        if ($vhostDomain) {
            $vhost->setVhostDomain($vhostDomain);
        }
        return $vhost;
    }
    
    function setVhostDomain($vhostDomain)
    {
        $this->vhostDomain = $vhostDomain;
    }
    
    function getURL()
    {
        if ($this->vhostDomain) {
            $url = $this->slug.'.'.$this->vhostDomain;
        } else {
            $url = $_SERVER['HTTP_HOST'];
        }
        
        $url .= ($this->port != 80 ? ':'.$this->port : '');
        return $url;
    }
    
    function getFilename()
    {
        return $this->filename;
    }
    
    function getPort()
    {
        return $this->port;
    }
    
    function getSlug()
    {
        return $this->slug;
    }
    
    /**
     * Renders content of vhost definition file
     * 
     * @param string $documentRoot a DoumenRoot that will be used in the definition
     * @return string Complete web server vhost definition
     */
    function getVhostDefinition($documentRoot)
    {
        $definition = '';
        if ($this->port != 80) {
            $definition .= $this->vhostDefinitionTemplatePart1;
        }
        $definition .= "\n".$this->vhostDefinitionTemplatePart2;
        $definition = str_replace('__SERVER_PORT__', $this->port, $definition);
        $definition = str_replace('__SERVER_NAME__', $this->getURL(), $definition);
        $definition = str_replace('__DOCUMENT_ROOT__', $documentRoot, $definition);
        return $definition;
    }
}

?>