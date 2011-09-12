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
    private $vhostDomain = 'local';
    private $vhostDefinitionTemplate =
'Listen *:__SERVER_PORT__
NameVirtualHost *:__SERVER_PORT__
<VirtualHost *:__SERVER_PORT__>
  ServerName __SERVER_NAME__
  DocumentRoot __DOCUMENT_ROOT__

  <Directory "__DOCUMENT_ROOT__/web">
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
     */
    static function createFor($port, $slug)
    {
        return new ServerVirtualHost("{$port}_{$slug}");
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
        $definition = $this->vhostDefinitionTemplate;
        $definition = str_replace('__SERVER_PORT__', $this->port, $definition);
        $definition = str_replace('__SERVER_NAME__', "{$this->slug}.{$this->vhostDomain}", $definition);
        $definition = str_replace('__DOCUMENT_ROOT__', $documentRoot, $definition);
        return $definition;
    }
}

?>