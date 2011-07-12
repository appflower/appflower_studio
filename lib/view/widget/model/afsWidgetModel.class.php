<?php
/**
 * Widget view model class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetModel extends afsBaseModel
{
    /**
     * Model name 
     */
    protected $model_name = 'widget';
    
    /**
     * Current module
     */
    private $module;
    
    /**
     * Current action
     */
    private $action;
    
    /**
     * Widget type
     *
     * @example list, edit
     */
    private $type;
    
    /**
     * Place name
     *
     * @example frontend, appFlowerStudioPlugin
     */
    private $place;
    
    /**
     * Place type
     *
     * @example app, plugin
     */
    private $place_type;
    
    /**
     * Is new mode parameter
     */
    private $is_new_mode = false;
    
    /**
     * Getting action
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getAction()
    {
        return $this->action;
    }
    
    /**
     * Getting module
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getModule()
    {
        return $this->module;
    }
    
    /**
     * Getting place name
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlace()
    {
        return $this->place;
    }
    
    /**
     * Getting place type
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlaceType()
    {
        return $this->place_type;
    }
    
    /**
     * Getting widget type
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getType()
    {
        return $this->type;
    }
    
    /**
     * Getting is new mode
     *
     * @return boolean
     * @author Sergey Startsev
     */
    public function getIsNewMode()
    {
        return $this->is_new_mode;
    }
    
    /**
     * Setting action
     *
     * @param string $action 
     * @author Sergey Startsev
     */
    public function setAction($action)
    {
        $this->action = $action;
    }
    
    /**
     * Setting module
     *
     * @param string $module 
     * @author Sergey Startsev
     */
    public function setModule($module)
    {
        $this->module = $module;
    }
    
    /**
     * Setting place name
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    public function setPlace($place)
    {
        $this->place = $place;
    }
    
    /**
     * Setting place type
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    public function setPlaceType($type)
    {
        if (!in_array($type, afsWidgetModelHelper::$place_types)) {
            throw new afsWidgetModelException("Place type '{$type}' can't be setted");
        }
        
        $this->place_type = $type;
    }
    
    /**
     * Setting widget type
     *
     * @param string $type 
     * @author Sergey Startsev
     */
    public function setType($type)
    {
        if (!in_array($type, afsWidgetModelHelper::$widget_types)) {
            throw new afsWidgetModelException("Type '{$type}' can't be setted");
        }
        
        $this->type = $type;
    }
    
    /**
     * Setting is new mode parameter
     *
     * @param boolean $mode 
     * @author Sergey Startsev
     */
    public function setIsNewMode($mode)
    {
        $this->is_new_mode = (boolean) $mode;
    }
    
    /**
     * Load object
     *
     * @return afsWidgetModel
     * @author Sergey Startsev
     */
    public function load()
    {
        // getting widget file path
        $path = $this->getPlaceConfigPath() . "/{$this->getAction()}.xml";
        
        if (is_readable($path)) {
            $definition = file_get_contents($path);
            $definition = afsXmlDefinition::create()->init($definition)->unpack()->get();
            
            $this->setDefinition($definition);
            
            $this->setNew(false);
        }
        
        return $this;
    }
    
    /**
     * Apply modificator
     *
     * @return afsWidgetModel
     * @author Sergey Startsev
     */
    public function modify()
    {
        $this->getModifier($this->getType())->modify($this);
    }
    
    /**
     * Save widget definition
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function save()
    {
        $definition = afsXmlDefinition::create()->init($this->getDefinition())->pack();
        
        // prepare folder for definition saving 
        $config_path = $this->getPlaceConfigPath();
        if (!file_exists($config_path)) {
            afsFileSystem::create()->mkdirs($config_path, 0774);
        }
        $path = "{$config_path}/{$this->getAction()}.xml";
        
        // validate
        $status = $definition->validate();
        
        // save
        $response = afResponseHelper::create();
        if ($status) {
            afStudioUtil::writeFile($path, $definition->get());
            afStudioWidgetCommandHelper::deployLibs();
            
            // check exists action or not
            $response->success($this->ensureActionExists());
        } else {
            $response->success(false)->message('Widget XML is not valid.');
        }
        
        return $response;
    }
    
    /**
     * Rename current widget
     *
     * @param string $new_name 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function rename($new_name)
    {
        if (!$this->isNew()) {
    		$old_name = $this->getAction();
    		$module = $this->getModule();
    		$place = $this->getPlace();
    		$type = $this->getPlaceType();
    		
    		$oldPath = $this->getPlaceConfigPath() . "/{$old_name}.xml";
    		$newPath = $this->getPlaceConfigPath() . "/{$new_name}.xml";
            
    		$response = afResponseHelper::create();
            
    		if (!file_exists($newPath)) {
        		$renamed = afsWidgetModelHelper::renameAction($old_name, $new_name, $module, $place, $type);
                
                afsFileSystem::create()->rename($oldPath, $newPath);
                
        		if (!file_exists($oldPath) && file_exists($newPath)) {
        			$response->success(true)->message("Renamed page from <b>{$old_name}</b> to <b>{$new_name}</b>!");
        		} else {
        		    $response->success(false)->message("Can't rename page from <b>{$old_name}</b> to <b>{$new_name}</b>!");
        		}
    		} else {
    		    $response->success(false)->message("View {$new_name} already exists");
    		}
        } else {
            $response->success(false)->message("Widget doesn't exists, create widget first");
        }
        
        return $response;
    }
    
    /**
     * Delete widget functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function delete()
    {
        if (!$this->isNew()) {
            // getting current action name
            $action_name = $this->getAction();
            
            // init paths
    		$module_dir = $this->getPlaceModulePath();
    		$xml_dir = "{$module_dir}/config/{$action_name}.xml";
            
    		$action_dir = "{$module_dir}/actions/{$action_name}Action.class.php";
            
            $filesystem = afsFileSystem::create();
            
            $filesystem->remove($xml_dir);
            $filesystem->remove($action_dir);
            
            // init response object
    		$response = afResponseHelper::create();
            
    		if (!file_exists($xml_dir)) {
    			$response->success(true)->message("Deleted page <b>{$action_name}</b>");
    		} else {
    		    $response->success(false)->message("Can't delete page <b>{$action_name}</b>!");
    		}
        } else {
            $response = afResponseHelper::create()->success(false)->message("Page <b>{$action_name}</b> doesn't exists");
        }
		
		return $response;
    }
    
    /**
     * Generate place path 
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlacePath()
    {
        return afStudioUtil::getRootDir() . "/{$this->place_type}s/{$this->place}";
    }
    
    /**
     * Generate place path to config path of current module
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlaceConfigPath()
    {
        return $this->getPlaceModulePath() . "/config";
    }
    
    /**
     * Getting place modules path
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlaceModulePath()
    {
        return $this->getPlacePath() . "/modules/{$this->getModule()}";
    }
    
    /**
     * Checking is plugin place type or not
     *
     * @return boolean
     * @author Sergey Startsev
     */
    protected function isPlugin()
    {
        return $this->checkPlaceType(afsWidgetModelHelper::PLACE_PLUGIN);
    }
    
    /**
     * Checking is application place type or not
     *
     * @return boolean
     * @author Sergey Startsev
     */
    protected function isApplication()
    {
        return $this->checkPlaceType(afsWidgetModelHelper::PLACE_APPLICATION);
    }
    
    /**
     * Checking place type 
     *
     * @param string $type 
     * @return boolean
     * @author Sergey Startsev
     */
    private function checkPlaceType($type)
    {
        return ($this->getPlaceType() == $type);
    }
    
    /**
     * checks if action file exists
     * if not - we are createing new action file
     * 
     * @return boolean
     * @author Lukasz Wojciechowski
     */
    private function ensureActionExists()
    {
        $afCU = new afConfigUtils($this->getModule());
        if ($afCU->isActionDefined($this->getAction())) {
            return true;
        }
        
        if ($this->isPlugin()) {
            $actionFilePath = $this->getPlaceModulePath() . "/actions/{$this->getAction()}Action.class.php";
        } else {
            $actionFilePath = $afCU->generateActionFilePath($this->getAction());
        }
        
        afStudioUtil::writeFile(
            $actionFilePath, 
            afStudioWidgetCommandTemplate::action($this->getAction(), $this->getType())
        );
        
        return true;
    }
    
}
