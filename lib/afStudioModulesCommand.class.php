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
									$data[$i]['children'][$j]['children'][$k]['type']='xml';
									$data[$i]['children'][$j]['children'][$k]['text']=$xmlName;
									$data[$i]['children'][$j]['children'][$k]['path']=$xmlPaths[$xk];
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
}
?>