<?php
/**
 * afStudioPlugins tree panel Command
 *
 */
class afStudioPluginsCommand
{
	public $request=null,$result=null,$realRoot=null,$dbSchema=null;
							
	public function __construct()
	{		
		$this->request=sfContext::getInstance()->getRequest();		
		$this->realRoot=afStudioUtil::getRootDir();
		$this->afConsole=new afStudioConsole();
		$this->filesystem = new sfFileSystem();
		
		$this->pluginName = $this->request->hasParameter('pluginName')?$this->request->getParameter('pluginName'):false;
		$this->moduleName = $this->request->hasParameter('moduleName')?$this->request->getParameter('moduleName'):false;
						
		$this->start();
	}
	
	public function start()
	{
		$cmd = $this->request->getParameterHolder()->has('cmd')?$this->request->getParameterHolder()->get('cmd'):"null";
		$xaction = $this->request->getParameterHolder()->has('xaction')?$this->request->getParameterHolder()->get('xaction'):null;

		if($cmd!=null)
		{
			switch ($cmd)
			{
				case "get":
					$datas = array();
					$pluginFolders = $this->getSubFolders($this->realRoot.'/plugins', 'plugin');

					foreach($pluginFolders as $pluginFolder)
					{
						$plugin = $pluginFolder["text"];
						
						$moduleFolders = $this->getSubFolders($this->realRoot."/plugins/".$plugin."/modules/");
 
						$mod_datas=array();
						foreach($moduleFolders as $moduleFolder)
						{
							$modulename = $moduleFolder["text"];
							$configfiles = $this->getFiles($plugin, $modulename, ".xml");
							if (count($configfiles) > 0) {
								$moduleFolder["children"] = $configfiles;
								array_push($mod_datas,$moduleFolder);
							}
						}

						if (count($mod_datas) > 0) {
							$pluginFolder["children"] = $mod_datas;
							array_push($datas,$pluginFolder);
						}

					}
					if(count($datas)>0)
					{
						$this->result = $datas;
					}
					else
					$this->result = array('success' => true);
					break;
				
				case "renamePlugin":
					$oldValue = $this->request->getParameter('oldValue');
					$newValue = $this->request->getParameter('newValue');
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
					
					$oldModuleDir = sfConfig::get('sf_root_dir').'/plugins/'.$oldValue.'/';
					$newModuleDir = sfConfig::get('sf_root_dir').'/plugins/'.$newValue.'/';
					
					$this->filesystem->rename($oldModuleDir,$newModuleDir);
					
					if(!file_exists($oldModuleDir)&&file_exists($newModuleDir))
					{			
						$consoleResult.=$this->afConsole->execute('sf cc');
						
						$this->result = array('success' => true,'message'=>'Renamed plugin from <b>'.$oldValue.'</b> to <b>'.$newValue.'</b>!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t rename plugin from <b>' + $oldValue + '</b> to <b>' + $newValue + '</b>!');
					break;

				case "deletePlugin":
					$pluginDir = sfConfig::get('sf_root_dir').'/plugins/'.$this->pluginName.'/';
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
										
					$consoleResult.=$this->afConsole->execute('rm -rf '.$pluginDir);
					
					if(!file_exists($pluginDir)){	
						$consoleResult.=$this->afConsole->execute(array('sf cc'));		
						
						$this->result = array('success' => true,'message'=>'Deleted plugin <b>'.$this->pluginName.'</b> ','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t delete plugin <b>'.$this->pluginName.'</b>!');
					break;
				
				case "renameModule":
					$oldValue = $this->request->getParameter('oldValue');
					$newValue = $this->request->getParameter('newValue');
					$pluginName = $this->request->getParameter('pluginName');
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
					
					$oldModuleDir = sfConfig::get('sf_root_dir').'/plugins/'.$pluginName.'/modules/'.$oldValue.'/';
					$newModuleDir = sfConfig::get('sf_root_dir').'/plugins/'.$pluginName.'/modules/'.$newValue.'/';
					
					$this->filesystem->rename($oldModuleDir,$newModuleDir);
					
					if(!file_exists($oldModuleDir)&&file_exists($newModuleDir))
					{			
						$consoleResult.=$this->afConsole->execute('sf cc');
						
						$this->result = array('success' => true,'message'=>'Renamed module from <b>'.$oldValue.'</b> to <b>'.$newValue.'</b>!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t rename module from <b>' + $oldValue + '</b> to <b>' + $newValue + '</b>!');
					break;
				
				case "deleteModule":
					$moduleName = $this->request->getParameter('moduleName');
					$pluginName = $this->request->getParameter('pluginName');
					$moduleDir = sfConfig::get('sf_root_dir').'/plugins/'.$pluginName.'/modules/'.$moduleName.'/';
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
										
					$consoleResult.=$this->afConsole->execute('rm -rf '.$moduleDir);
					
					if(!file_exists($moduleDir)){	
						$consoleResult.=$this->afConsole->execute(array('sf cc'));		
						
						$this->result = array('success' => true,'message'=>'Deleted module <b>'.$moduleName.'</b> ','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t delete module <b>'.$moduleName.'</b>!');
					break;
					
				case "renameXml":
					$oldValue = $this->request->getParameter('oldValue');
					$newValue = $this->request->getParameter('newValue');
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
					
					$oldName = sfConfig::get('sf_root_dir').'/plugins/'.$this->pluginName.'/modules/'.$this->moduleName.'/config/'.$oldValue;
					$newName = sfConfig::get('sf_root_dir').'/plugins/'.$this->pluginName.'/modules/'.$this->moduleName.'/config/'.$newValue;
					
					$this->filesystem->rename($oldName,$newName);
					
					if(!file_exists($oldName)&&file_exists($newName))
					{			
						$consoleResult.=$this->afConsole->execute('sf cc');
						
						$this->result = array('success' => true,'message'=>'Renamed page from <b>'.$oldValue.'</b> to <b>'.$newValue.'</b>!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t rename page from <b>' + $oldValue + '</b> to <b>' + $newValue + '</b>!');				
					break;	
					
				case "deleteXml":
					$moduleName = $this->request->getParameter('moduleName');
					$pluginName = $this->request->getParameter('pluginName');
					$xmlName = $this->request->getParameter('xmlName');
					$xmlDir = sfConfig::get('sf_root_dir').'/plugins/'.$pluginName.'/modules/'.$moduleName.'/config/'.$xmlName;
					
					$consoleResult=$this->afConsole->execute('afs fix-perms');
										
					$consoleResult.=$this->afConsole->execute('rm -rf '.$xmlDir);
					
					if(!file_exists($xmlDir)){	
						$consoleResult.=$this->afConsole->execute(array('sf cc'));		
						
						$this->result = array('success' => true,'message'=>'Deleted page <b>'.$xmlName.'</b> ','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t delete page <b>'.$xmlName.'</b>!');
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
	
	private function getSubFolders ($dir, $type='module')
	{
		$folders = array();

		if(is_dir($dir))
		{
			$handler = opendir($dir);
			$i=0;
			while(($f = readdir($handler))!==false)
			{
				if($f !="." && $f !=".." && $f!=".svn" && is_dir($dir.'/'.$f))
				{
					$folders[$i]["text"] = $f;
					
					$folders[$i]["type"] = $type;
					$i++;
				}
			}
		}
		return $folders;
	}

	private function getFiles($plugin, $modulename, $pro_name)
	{
		
		$dir = $this->realRoot."/plugins/".$plugin."/modules/".$modulename."/config/";
		
		$securityPath = $this->realRoot."/apps/".$plugin."/modules/".$modulename."/config/security.yml";
		$actionPath = $this->realRoot."/apps/".$plugin."/modules/".$modulename."/actions/actions.class.php";
		
		$files = array();
		if (is_dir($dir)) {
			$handler = opendir($dir);
			$i=0;
			while(($f = readdir($handler))!==false)
			{
				if(!is_dir($dir.$f) && strpos($f,$pro_name)>0)
				{
					$files[$i]["text"] = $f;
					$files[$i]["type"] = 'xml';
					
					$files[$i]["widgetUri"]=$modulename.'/'.str_replace('.xml', '', $f);
					
					$files[$i]["securityPath"] = $securityPath;
					$files[$i]["actionPath"] = $actionPath;
					
					$files[$i]["leaf"] = true;
					$i++;
				}
			}
		}
		return $files;
	}
}
?>
