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
					$pluginFolders = $this->getSubFolders($this->realRoot.'/plugins');

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
	
	private function getSubFolders ($dir)
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
					$folders[$i]["type"] = 'module';
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
