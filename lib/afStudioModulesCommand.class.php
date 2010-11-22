<?php
/**
 * afStudioModules tree panel Command
 *
 */
class afStudioModulesCommand
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
		$cmd = $this->request->getParameterHolder()->has('cmd')?$this->request->getParameterHolder()->get('cmd'):null;
		$xaction = $this->request->getParameterHolder()->has('xaction')?$this->request->getParameterHolder()->get('xaction'):null;
			
		if($cmd!=null)
		{	
			switch ($cmd)
			{
				case "get":
					$datas = array();
					$appFolders = $this->getApplicationFolders($this->realRoot."/apps/");

					foreach($appFolders as $appFolder)
					{
						$appname = $appFolder["text"];
						$moduleFolders = $this->getApplicationFolders($this->realRoot."/apps/".$appname."/modules/");

						$k=0;
						$mod_datas=array();
						foreach($moduleFolders as $moduleFolder)
						{
							$modulename = $moduleFolder["text"];
							$configfiles = $this->getApplicationFiles($this->realRoot."/apps/".$appname."/modules/".$modulename."/config/", ".xml");
							$moduleFolder["children"] = $configfiles;
							$k++;
							array_push($mod_datas,$moduleFolder);
						}

						$appFolder["children"] = $mod_datas;

						array_push($datas,$appFolder);
					}
					if(count($datas)>0)
					{
						$this->result = $datas;
					}
					else
					$this->result = array('success' => true);
					break;
				case "delete":
					unset($this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]);
					
					if($this->saveSchema())
					{	
						$afConsole=new afStudioConsole();
						$consoleResult=$afConsole->execute(array('chmod u+x ../batch/diff_db.php','batch diff_db.php'));		
						
						$this->result = array('success' => true,'message'=>'Deleted model <b>'.$this->modelName.'</b>!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t delete model <b>'.$this->modelName.'</b>!');
					break;
				case "rename":
					$renamedModelName = $this->request->getParameterHolder()->get('renamedModel');
					
					$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName']=$renamedModelName;
					
					if($this->saveSchema())
					{			
						$afConsole=new afStudioConsole();
						$consoleResult=$afConsole->execute('sf propel:build-model');
						
						$this->result = array('success' => true,'message'=>'Renamed model\'s phpName from <b>'.$this->modelName.'</b> to <b>'.$renamedModelName.'</b>!','console'=>$consoleResult);
					}
					else
					$this->result = array('success' => false,'message'=>'Can\'t rename model\'s phpName from <b>' + $this->modelName + '</b> to <b>' + $renamedModelName + '</b>!');
					break;
				default:
					$this->result = array('success' => true);
					break;
			}
		}
		
		if($xaction!=null)
		{
			switch ($xaction)
			{
				case "read":	
					$k=0;						    
				    foreach ($this->propelModel['columns'] as $name=>$params)
				    {
				    	$this->result['rows'][$k]['id']=$k;
				    	$this->result['rows'][$k]['name']=$name;
				    	if(isset($params['type']))
				    	{
				    		$this->result['rows'][$k]['type']=$params['type'];
				    	}
				    	if(isset($params['size']))
				    	{
				    		$this->result['rows'][$k]['size']=$params['size'];
				    	}
				    	if(isset($params['required']))
				    	{
				    		$this->result['rows'][$k]['required']=$params['required'];
				    	}
				    	if(isset($params['default']))
				    	{
				    		$this->result['rows'][$k]['default_value']=$params['default'];
				    	}
				    	
				    	$k++;
				    }
				    $this->result['success']=true;
				    $this->result['totalCount']=count($this->result['rows']);
					break;
				case "update":	
					$rows = $this->request->getParameterHolder()->has('rows')?$this->request->getParameterHolder()->get('rows'):null;
					if($rows!=null)
					{
						$rows=json_decode($rows);print_r($rows);die();
						//$rows=afStudioUtil::objectToArray($rows);
						//$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName][$rows->name]=$this->reconstructTableField($rows);
						
						if($this->saveSchema())
						{			
							$afConsole=new afStudioConsole();
							$consoleResult=$afConsole->execute(array('chmod u+x ../batch/diff_db.php','batch diff_db.php'));
							
							$this->result = array('success' => true,'message'=>'Updated model <b>'.$this->modelName.'</b> !','console'=>$consoleResult);
						}
						else
						$this->result = array('success' => false,'message'=>'Can\'t update model <b>' + $this->modelName + '</b>!');
					}
				    $this->result['success']=true;
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
	
	private function getApplicationFolders ($dir)
	{
		$folders = array();
		
		if(is_dir($dir))
		{
			$handler = opendir($dir);
			$i=0;
			while(($f = readdir($handler))!==false)
			{
				if($f !="." && $f !=".." && $f!=".svn" && is_dir($dir.$f))
				{
					$folders[$i]["text"] = $f;
					$i++;
				}
			}
		}
		return $folders;
	}
	
	private function getApplicationFiles($dir, $pro_name)
	{
		$files = array();
		$handler = opendir($dir);
		$i=0;
		while(($f = readdir($handler))!==false)
		{
			if(!is_dir($dir.$f) && strpos($f,$pro_name)>0)
			{
				$files[$i]["text"] = $f;
				$files[$i]["leaf"] = true;
				$i++;
			}
		}
		return $files;
	}
}
?>