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
		
		// $this->start();
	}
	
	public function start()
	{
		$cmd = $this->request->getParameterHolder()->has('cmd') ? $this->request->getParameterHolder()->get('cmd') : null;
			
		if($cmd != null)
		{	
			$controller_name = 'process' . ucfirst(strtolower($cmd));
            
            if (method_exists($this, $controller_name)) {
                call_user_func(array($this, $controller_name));
            } else {
                // TODO: throw
            }
            
		}
	}
	
    private function processGet()
    {
        $i=0;
                    
        $data = array();
        $apps = afStudioUtil::getDirectories($this->realRoot . "/apps/", true);
        
        foreach($apps as $app)
        {
            $data[$i]['text'] = $app;
            $data[$i]['type'] = 'app';
            
            $xmlNames = afStudioUtil::getFiles($this->realRoot . "/apps/{$app}/config/pages/", true, 'xml');
            $xmlPaths = afStudioUtil::getFiles($this->realRoot . "/apps/{$app}/config/pages/", false, 'xml');
            
            $j=0;
            
            if (count($xmlNames) > 0) {
                foreach ($xmlNames as $xk => $page) {
                    $data[$i]['children'][$j]['app'] = $app;
                    $data[$i]['children'][$j]['text'] = $page;
                    $data[$i]['children'][$j]['xmlPath'] = $xmlPaths[$xk];
                    $data[$i]['children'][$j]['leaf'] = true;
                    
                    $j++;
                }
            } else {
                $data[$i]['leaf']=true;
                $data[$i]['iconCls']='icon-folder';
            }
            
            $i++;
        }
        
        if(count($data) > 0) {
            $this->result = $data;
        } else {
            $this->result = array('success' => true);
        }
    }
    
	public function end()
	{	
		$this->result=json_encode($this->result);
		return $this->result;
	}
    
    public function setCommand($sCommand)
    {
        $this->cmd = $sCommand;
    }
    
    public function getCommand()
    {
        return $this->cmd;
    }
    
}
?>
