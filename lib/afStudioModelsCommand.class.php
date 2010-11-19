<?php
/**
 * afStudioModels tree panel Command
 *
 */
class afStudioModelsCommand
{
	public $request=null,$result=null,$realRoot=null,$dbSchema=null,$propelSchemaArray=null,$originalSchemaArray=null,$tableName=null,$modelName=null,$configuration=null,$schemaFile=null,$propelModel=null;

	public $cmd;	
	public $xaction;
	
	protected $defaultSchema;
	
	public function __construct()
	{		
		$this->request = sfContext::getInstance()->getRequest();		
		
		$this->realRoot = afStudioUtil::getRootDir();
		
		$this->dbSchema = new sfPropelDatabaseSchema();
	    
		$this->defaultSchema = $this->realRoot . '/config/schema.yml';
		
		$this->loadSchemas();		
		
		$this->cmd = $this->request->getParameterHolder()->has('cmd') ? $this->request->getParameterHolder()->get('cmd') : null;
		$this->xaction = $this->request->getParameterHolder()->has('xaction') ? $this->request->getParameterHolder()->get('xaction') : null;		
		
	    if ($this->request->getParameterHolder()->has('model'))
	    {
	    	$this->modelName = $this->request->getParameterHolder()->get('model');
	    	$this->schemaFile = $this->request->getParameterHolder()->get('schema') ? $this->request->getParameterHolder()->get('schema') : $this->defaultSchema;
	    	
	    	if ($this->cmd == 'add') {
		    	$this->tableName = strtolower($this->modelName);
		    	$this->propelModel = $this->modelName;
	    	} else {
				if (!isset($this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName]) 
				|| !isset($this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName])) {
			    	$this->result = array('success'=>false, 'message'=>'Table doesn\'t exists');	
			    	return false;	    			
				}
	    		
		    	$this->tableName = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName]['tableName'];
		    	$this->propelModel = $this->propelSchemaArray[$this->schemaFile]['classes'][$this->modelName];	    		
	    	}
	    }
		
		$this->start();
	}
	
	public function loadSchemas()
	{
		$this->configuration = new ProjectConfiguration(null, new sfEventDispatcher());
		$finder = sfFinder::type('file')->name('*schema.yml')->prune('doctrine');
    	$dirs = array_merge(array(sfConfig::get('sf_config_dir')), $this->configuration->getPluginSubPaths('/config'));
    	foreach ($dirs as $k=>$dir)
    	{
    		if(substr_count($dir,'appFlower')>0||substr_count($dir,'sfPropelPlugin')>0||substr_count($dir,'sfProtoculousPlugin')>0)
    		{
    			unset($dirs[$k]);
    		}
    	}
    	$dirs=array_values($dirs);
    	
    	$schemas = $finder->in($dirs);
    	
    	foreach ($schemas as $schema)
	    {
	      $this->originalSchemaArray[$schema] = sfYaml::load($schema);
	
	      if (!is_array($this->originalSchemaArray[$schema]))
	      {
	      	$this->originalSchemaArray[$schema];
	        continue; // No defined schema here, skipping
	      }
	
	      if (!isset($this->originalSchemaArray[$schema]['classes']))
	      {
	        // Old schema syntax: we convert it
	        $this->propelSchemaArray[$schema] = $this->dbSchema->convertOldToNewYaml($this->originalSchemaArray[$schema]);
	      }
	
	      $customSchemaFilename = str_replace(array(
	        str_replace(DIRECTORY_SEPARATOR, '/', sfConfig::get('sf_root_dir')).'/',
	        'plugins/',
	        'config/',
	        '/',
	        'schema.yml'
	      ), array('', '', '', '_', 'schema.custom.yml'), $schema);
	      $customSchemas = sfFinder::type('file')->name($customSchemaFilename)->in($dirs);
	
	      foreach ($customSchemas as $customSchema)
	      {
	      	$this->originalSchemaArray[$customSchema] = sfYaml::load($customSchema);
	        if (!isset($this->originalSchemaArray[$customSchema]['classes']))
	        {
	          // Old schema syntax: we convert it
	          $this->propelSchemaArray[$customSchema] = $this->dbSchema->convertOldToNewYaml($this->originalSchemaArray[$customSchema]);
	        }
	      }
	    }
	}
	
	public function saveSchema()
	{
		$dump=sfYaml::dump($this->originalSchemaArray[$this->schemaFile], 3);
		
		if(file_put_contents($this->schemaFile,$dump)>0){
			return true;
		}
		else {
			return false;
		}
	}
	
	public function start()
	{		
		if( $this->cmd != null)
		{	
			switch ($this->cmd)
			{
				case "get":			
					if(count($this->propelSchemaArray)>0)
					{
						foreach ($this->propelSchemaArray as $schemaFile=>$array)
						{
							foreach ($array['classes'] as $phpName=>$attributes)
							{
								$this->result[]=array('text'=>$phpName,'leaf'=>true,'schema'=>$schemaFile, 'iconCls'=>'icon-model');
							}
						}
					}
					else
					$this->result = array('success' => true);
				break;
				
				case "add":
					$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $this->modelName;				
					
					if ($this->saveSchema()) {			
						$afConsole = new afStudioConsole();
						$consoleResult = $afConsole->execute('sf propel:build-model');
						
						$this->result = array('success' => true, 'message'=>'Added model <b>'.$this->modelName.'</b>!', 'console'=>$consoleResult);						
					} else {						
						$this->result = array('success' => false, 'message'=>'Can\'t add model <b>' + $this->modelName + '</b>!');
					}
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
					
					$this->originalSchemaArray[$this->schemaFile]['propel'][$this->tableName]['_attributes']['phpName'] = $renamedModelName;
					
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
		
		if($this->xaction != null)
		{
			switch ($this->xaction)
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

				    if (empty($this->result['rows'])) 
				    {
				   		 $this->result['rows'] = array(); 	
				    }				     
				    $this->result['success'] = true;
				    $this->result['totalCount'] = count($this->result['rows']);
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
	
	public function reconstructTableField($params)
	{
		$retparams=array();
		
		if(isset($params['type'])&&$params['type']!='')
		{
			$retparams['type']=$params['type'];
		}
		if(isset($params['size'])&&$params['size']!='')
		{
			$retparams['size']=$params['size'];
		}
		if(isset($params['required']))
    	{
    		$retparams['required']=$params['required'];
    	}
    	if(isset($params['default_value']))
    	{
    		$retparams['default']=$params['default_value'];
    	}
		return $retparams;
	}
	
	public function end()
	{	
		$this->result = json_encode($this->result);
		return $this->result;
	}
	
	
	 
}
?>