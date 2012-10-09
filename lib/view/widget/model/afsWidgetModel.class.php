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
     * Propel Model
     */
    private $model;
    
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
     * Getting model
     *
     * @return string
     * @author Radu Topala
     */
    public function getModel()
    {
        return $this->model;
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
     * Setting model
     *
     * @param string $model 
     * @author Radu Topala
     */
    public function setModel($model)
    {
        $this->model = $model;
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
        $path = $this->getPlaceConfigPath() . DIRECTORY_SEPARATOR . "{$this->getAction()}.xml";
        
        if (is_readable($path)) {
            $definition = afsXmlDefinition::create()->init(file_get_contents($path))->unpack()->get();
            $this->setDefinition($definition);
            $this->setNew(false);
            $this->setType(
                (array_key_exists('attributes', $definition) && (array_key_exists('type', $definition['attributes']))) 
                    ? $definition['attributes']['type']
                    : null
            );
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
        $definition_array = $this->getDefinition();
        $definition_array = afsWidgetModelOrderHelper::fixing($definition_array, $this->getType());
        
        $definition = afsXmlDefinition::create()->init($definition_array);
        if ($this->isNew()) $definition->rootAttributes($this->getType());
        
        $definition->pack();
        
        // prepare folder for definition saving 
        if (!file_exists($this->getPlaceConfigPath())) afsFileSystem::create()->mkdirs($this->getPlaceConfigPath(), 0774);
        
        if ($definition->validate()) {
            
            $model_validator = afsWidgetModelValidator::create($this)->execute();
            if (!$model_validator->isValid()) return afResponseHelper::create()->success(false)->message($model_validator->getMessages(true));
            
            afStudioUtil::writeFile($this->getPlaceConfigPath() . DIRECTORY_SEPARATOR . "{$this->getAction()}.xml", $definition->get());
            
            $this->ensureSecurityExists();
            
            // check exists action or not
            return afResponseHelper::create()->success($this->ensureActionExists());
        }
        
        return afResponseHelper::create()->success(false)->message('Widget XML is not valid.');
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
        $response = afResponseHelper::create();
        if ($this->isNew()) return $response->success(false)->message("Widget doesn't exists, create widget first");
        
        $old_name = $this->getAction();
        $module = $this->getModule();
        $place = $this->getPlace();
        $type = $this->getPlaceType();
        
        $oldPath = $this->getPlaceConfigPath() . DIRECTORY_SEPARATOR . "{$old_name}.xml";
        $newPath = $this->getPlaceConfigPath() . DIRECTORY_SEPARATOR . "{$new_name}.xml";
        
        if (file_exists($newPath)) return $response->success(false)->message("View {$new_name} already exists");
        
        $renamed = afsViewModelHelper::renameAction($old_name, $new_name, $module, $place, $type);
        
        afsFileSystem::create()->rename($oldPath, $newPath);
        
        if (!file_exists($oldPath) && file_exists($newPath)) {
            return $response->success(true)->message("Renamed page from <b>{$old_name}</b> to <b>{$new_name}</b>!");
        }
        
        return $response->success(false)->message("Can't rename page from <b>{$old_name}</b> to <b>{$new_name}</b>!");
    }
    
    /**
     * Delete widget functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function delete()
    {
        $response = afResponseHelper::create();
        if ($this->isNew()) return $response->success(false)->message("Page <b>{$action_name}</b> doesn't exists");
        
        // getting current action name
        $action_name = $this->getAction();
        
        // init paths
        $xml_dir = $this->getPlaceConfigPath() . DIRECTORY_SEPARATOR . "{$action_name}.xml";
        $action_dir = $this->getPlaceActionsPath() . DIRECTORY_SEPARATOR . "{$action_name}Action.class.php";
        
        $filesystem = afsFileSystem::create();
        
        if (file_exists($xml_dir)) $filesystem->remove($xml_dir);
        if (file_exists($action_dir)) $filesystem->remove($action_dir);
        
        // init response object
        $response = afResponseHelper::create();
        
        if (!file_exists($xml_dir)) return $response->success(true)->message("Deleted page <b>{$action_name}</b>");
        
        return $response->success(false)->message("Can't delete page <b>{$action_name}</b>!");
    }
    
    /**
     * Generate place path to config path of current module
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlaceConfigPath()
    {
        return $this->getPlaceModulePath() . DIRECTORY_SEPARATOR . "config";
    }
    
    /**
     * Getting actions place path
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlaceActionsPath()
    {
        return $this->getPlaceModulePath() . DIRECTORY_SEPARATOR . "actions";
    }
    
    /**
     * Getting place modules path
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getPlaceModulePath()
    {
        return $this->getPlacePath() . DIRECTORY_SEPARATOR . "modules" . DIRECTORY_SEPARATOR . $this->getModule();
    }
    
    /**
     * Generate place path 
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getPlacePath()
    {
        return afStudioUtil::getRootDir() . DIRECTORY_SEPARATOR . "{$this->place_type}s" . DIRECTORY_SEPARATOR . $this->place;
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
     * @author Sergey Startsev
     * @author Radu Topala
     */
    private function ensureActionExists()
    {
        if (!$this->ensureFolderExists($this->getPlaceActionsPath())) return false;
        
        $action_file_name = "{$this->getAction()}Action.class.php";              
        
        $action_file_path = $this->getPlaceActionsPath() . DIRECTORY_SEPARATOR . $action_file_name;
        if (!file_exists($action_file_path)) {
            afStudioUtil::writeFile(
                $action_file_path, 
                afsWidgetModelTemplate::create()->action($this->getAction(), $this->getType(), $this->getModel())
            );
        }
        
        //if list action is generated, then also generate delete action
        if($this->getType() == 'list')
        {
            $modelProcessed = lcfirst(sfInflector::camelize($this->getModel()));
            
            $delete_action_file_name = "{$modelProcessed}DeleteAction.class.php";
            $delete_action_file_path = $this->getPlaceActionsPath() . DIRECTORY_SEPARATOR . $delete_action_file_name;
            
            if (!file_exists($delete_action_file_path)) {
                afStudioUtil::writeFile(
                    $delete_action_file_path, 
                    afsWidgetModelTemplate::create()->action($modelProcessed.'Delete', 'delete', $this->getModel())
                );
            }
        }
        
        return file_exists($action_file_path);
    }
    
    /**
     * Ensure that security file exists 
     *
     * @return boolean
     * @author Sergey Startsev
     */
    private function ensureSecurityExists()
    {
        $security_path = $this->getPlaceConfigPath() . DIRECTORY_SEPARATOR . 'security.yml';
        
        if (!$this->ensureFolderExists($this->getPlaceConfigPath())) return false;
        
        if (!file_exists($security_path)) afsFileSystem::create()->touch($security_path);
        
        return file_exists($security_path);
    }
    
    /**
     * Ensure that folder exists 
     *
     * @param string $folder 
     * @param int $mode - octal
     * @return boolean
     * @author Sergey Startsev
     */
    private function ensureFolderExists($folder, $mode = 0775)
    {
        if (!file_exists($folder)) afsFileSystem::create()->mkdirs($folder, $mode);
        
        return file_exists($folder);
    }
     
}
