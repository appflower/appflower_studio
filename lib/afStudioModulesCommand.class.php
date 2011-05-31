<?php
/**
 * afStudioModules tree panel Command
 *
 */
class afStudioModulesCommand
{
	public $request=null,$result=null,$realRoot=null,$app,$moduleName;
        
        /**
         * @var afStudioConsole
         */
        private $afConsole;
							
	public function __construct()
	{		
		$this->request=sfContext::getInstance()->getRequest();		
		
		$this->realRoot=afStudioUtil::getRootDir();
		
		$this->afConsole=afStudioConsole::getInstance();
		
		$this->filesystem = new sfFileSystem();

		$this->app = $this->request->hasParameter('app')?$this->request->getParameter('app'):false;
		$this->moduleName = $this->request->hasParameter('moduleName')?$this->request->getParameter('moduleName'):false;
		
		$this->start();
	}
	
	public function start()
	{
		$cmd = $this->request->getParameterHolder()->has('cmd')?$this->request->getParameterHolder()->get('cmd'):null;
			
		if($cmd!=null)
		{	
			switch ($cmd)
			{
				case "get":
					$data = array();
					$apps = afStudioUtil::getDirectories($this->realRoot."/apps/",true);
										
					$i=0;
					
					foreach($apps as $app)
					{
						$data[$i]['text']=$app;
						$data[$i]['type']='app';
																		
						$modules = afStudioUtil::getDirectories($this->realRoot."/apps/".$app."/modules/",true);
						
						$j=0;
						
						foreach($modules as $module)
						{
							$data[$i]['children'][$j]['text']=$module;
							
							$xmlNames = afStudioUtil::getFiles($this->realRoot."/apps/".$app."/modules/".$module."/config/", true, "xml");
                            $xmlPaths = afStudioUtil::getFiles($this->realRoot."/apps/".$app."/modules/".$module."/config/", false, "xml");
                                                        
                            $securityPath = $this->realRoot."/apps/".$app."/modules/".$module."/config/security.yml";
                            $actionPath = $this->realRoot."/apps/".$app."/modules/".$module."/actions/actions.class.php";
                            
                            $k=0;
							
							$data[$i]['children'][$j]['type']='module';
							$data[$i]['children'][$j]['app']=$app;

							if (count($xmlNames) > 0) 
							{	
								$data[$i]['children'][$j]['leaf']=false;
								
								foreach ($xmlNames as $xk=>$xmlName)
								{
									$data[$i]['children'][$j]['children'][$k]['app']=$app;
									$data[$i]['children'][$j]['children'][$k]['module']=$module;
									$data[$i]['children'][$j]['children'][$k]['widgetUri']=$module.'/'.str_replace('.xml', '', $xmlName);
									$data[$i]['children'][$j]['children'][$k]['type']='xml';
									$data[$i]['children'][$j]['children'][$k]['text']=$xmlName;
                                    $data[$i]['children'][$j]['children'][$k]['securityPath']=$securityPath;
									$data[$i]['children'][$j]['children'][$k]['xmlPath']=$xmlPaths[$xk];
                                    $data[$i]['children'][$j]['children'][$k]['actionPath']=$actionPath;
									$data[$i]['children'][$j]['children'][$k]['leaf']=true;
									
									$k++;
								}
							}
							else {
								$data[$i]['children'][$j]['leaf']=true;
								$data[$i]['children'][$j]['iconCls']='icon-folder';
							}
							
							$j++;
						}
						
						$i++;
					}
					if(count($data)>0)
					{
						$this->result = $data;
					}
					else
					$this->result = array('success' => true);
					break;
				case "addModule":					
					if($this->app && $this->moduleName)
					{
						$consoleResult=$this->afConsole->execute('sf generate:module '.$this->app.' '.$this->moduleName);		
                                                $commandOk = $this->afConsole->wasLastCommandSuccessfull();
                                                if ($commandOk) {
                                                    $consoleResult .= $this->afConsole->execute('sf cc');		
                                                    $message = 'Created module <b>'.$this->moduleName.'</b> inside <b>'.$this->app.'</b> application!';
                                                } else {
                                                    $message = 'Could not create module <b>'.$this->moduleName.'</b> inside <b>'.$this->app.'</b> application!';
                                                }
						
						$this->result = array(
                                                    'success' => $commandOk,
                                                    'message'=> $message,
                                                    'console'=>$consoleResult
                                                );
					}
					else {
						$this->result = array('success' => false,'message'=>'Can\'t create new module <b>'.$this->moduleName.'</b> inside <b>'.$this->app.'</b> application!');
					}
					break;
				case "deleteModule":
					$moduleDir = sfConfig::get('sf_root_dir').'/apps/'.$this->app.'/modules/'.$this->moduleName.'/';
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
										
					$consoleResult.=$this->afConsole->execute('rm -rf '.$moduleDir);
					
					if(!file_exists($moduleDir)){	
						$consoleResult.=$this->afConsole->execute(array('sf cc'));		
						
						$this->result = array('success' => true,'message'=>'Deleted module <b>'.$this->moduleName.'</b> inside <b>'.$this->app.'</b> application!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t delete module <b>'.$this->moduleName.'</b> inside <b>'.$this->app.'</b> application!');
					break;
				case "renameModule":
					$renamedModuleName = $this->request->getParameter('renamedModule');
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
					
					$oldModuleDir = sfConfig::get('sf_root_dir').'/apps/'.$this->app.'/modules/'.$this->moduleName.'/';
					$newModuleDir = sfConfig::get('sf_root_dir').'/apps/'.$this->app.'/modules/'.$renamedModuleName.'/';
					
					$this->filesystem->rename($oldModuleDir,$newModuleDir);
					
					if(!file_exists($oldModuleDir)&&file_exists($newModuleDir))
					{			
						$consoleResult.=$this->afConsole->execute('sf cc');
						
						$this->result = array('success' => true,'message'=>'Renamed module from <b>'.$this->moduleName.'</b> to <b>'.$renamedModuleName.'</b> inside <b>'.$this->app.'</b> application!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t rename module from <b>' + $this->moduleName + '</b> to <b>' + $renamedModuleName + '</b> inside <b>'.$this->app.'</b> application!');
					break;
				case "getGrouped":
					$data = array();
					$apps = afStudioUtil::getDirectories($this->realRoot."/apps/",true);
										
					foreach($apps as $app)
					{
						$modules = afStudioUtil::getDirectories($this->realRoot."/apps/".$app."/modules/",true);
						
						foreach($modules as $module)
						{
							$data[] = array('value'=>$module,'text'=>$module,'group'=>$app);
						}
					}
					if(count($data)>0)
					{
						$this->result = $data;
					}
					else
					$this->result = array('success' => true);
					break;
				default:
					$this->result = array('success' => true);
					break;
			}
		}
	}
	
	public function end()
	{	
		$this->result=json_encode($this->result);
		return $this->result;
	}
}
?>
