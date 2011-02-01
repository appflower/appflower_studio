<?php
/**
 * afStudioLayout tree panel Command
 *
 * @author startsev.sergey@gmail.com
 */
class afStudioLayoutCommand
{
    /**
     * Request instance
     */
	public $request = null;
    
    /**
     * Result of executing command
     */
	public $result = null;
    
    /**
     * Root Directory
     */
    public $realRoot = null;
	
    /**
     * Command will be executed
     */
    private $cmd;
    
    /**
     * Application name
     */
    private $app;
    
	public function __construct()
	{		
		$this->request = sfContext::getInstance()->getRequest();		
		
		$this->realRoot = afStudioUtil::getRootDir();
		
		$this->app = $this->request->hasParameter('app') ? $this->request->getParameter('app') : false;
		$this->moduleName = $this->request->hasParameter('moduleName') ? $this->request->getParameter('moduleName') : false;
		
		$this->start();
	}
	
    /**
     * Separate to different controllers part
     */
	public function start()
	{
		$cmd = $this->request->getParameterHolder()->has('cmd') ? $this->request->getParameterHolder()->get('cmd') : null;
			
		if($cmd != null)
		{	
			$controller_name = 'process' . ucfirst(strtolower($cmd));
            
            if (method_exists($this, $controller_name)) {
                call_user_func(array($this, $controller_name));
            } else {
                throw new Exception("Controller: '{$controller_name}' not defined");
            }
            
		}
	}
	
    /**
     * Getting tree list controller
     */
    private function processGet()
    {
        $tree = array();
        
        $aPageList = $this->getPagesList();
        
        foreach ($aPageList as $app => $aPage) {
            
            $treeNode['text'] = $app;
            $treeNode['type'] = 'app';
            
            if (count($aPage) > 0) {
                foreach ($aPage as $page) {
                    $treeNode['children'][] = array(
                        'app' => $app,
                        'text' => $page['text'],
                        'xmlPath' => $page['xmlPath'],
                        'leaf' => true
                    );
                }
            } else {
                $treeNode['leaf'] = true;
                $treeNode['iconCls'] = 'icon-folder';
            }
            
            $tree[] = $treeNode;
        }
        
        if(count($tree) > 0) {
            $this->result = $tree;
        } else {
            $this->result = array('success' => true);
        }
        
    }
    
    /**
     * Getting pages list from applications 
     * 
     * @return array
     */
    private function getPagesList()
    {
        $data = array();
        $apps = afStudioUtil::getDirectories($this->realRoot . "/apps/", true);
        
        foreach($apps as $app) {
            $xmlNames = afStudioUtil::getFiles($this->realRoot . "/apps/{$app}/config/pages/", true, 'xml');
            $xmlPaths = afStudioUtil::getFiles($this->realRoot . "/apps/{$app}/config/pages/", false, 'xml');
            
            if (count($xmlNames) > 0) {
                foreach ($xmlNames as $xk => $page) {
                    $data[$app][] = array(
                        'text' => $page,
                        'xmlPath' => $xmlPaths[$xk],
                    );
                }
            }
        }
        
        return $data;
    }
    
    
	public function end()
	{
		$this->result = json_encode($this->result);
		return $this->result;
	}
    
    
}
?>
