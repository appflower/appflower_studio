<?php
/**
 * Page view model class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsPageModel extends afsBaseModel
{
    /**
     * Default pages module
     */
	const MODULE = 'pages';
	
    /**
     * Model name 
     */
    protected $model_name = 'page';
    
    /**
     * Page name
     */
    private $name;
    
    /**
     * Page application
     */
    private $application;
    
    /**
     * Page title
     */
    private $title;
    
    /**
     * Setting page title
     *
     * @param string $title 
     * @author Sergey Startsev
     */
    public function setTitle($title)
    {
        $this->title = $title;
    }
    
    /**
     * Setting page name
     *
     * @param string $name 
     * @author Sergey Startsev
     */
    public function setName($name)
    {
        $this->name = $name;
    }
    
    /**
     * Setting page application
     *
     * @param string $application 
     * @author Sergey Startsev
     */
    public function setApplication($application)
    {
        $this->application = $application;
    }
    
    /**
     * Getting title
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getTitle()
    {
        return $this->title;
    }
    
    /**
     * Getting page name
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getName()
    {
        return $this->name;
    }
    
    /**
     * Getting application
     *
     * @return void
     * @author Sergey Startsev
     */
    public function getApplication()
    {
        return $this->application;
    }
    
    /**
     * Load object
     *
     * @return afsPageModel
     * @author Sergey Startsev
     */
    public function load()
    {
        if (is_readable($this->getPagePath())) {
            $this->setDefinition(afsXmlDefinition::create()->init(file_get_contents($this->getPagePath()))->unpack()->get());
            $this->setNew(false);
        }
        
        return $this;
    }
    
    /**
     * Save page functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function save()
    {
        $definition = afsXmlDefinition::create();
        if ($this->isNew()) {
            $this->addAreaTopElement()->addTitleTopElement($this->getTitle());
            
            $definition->init($this->getDefinition());
            $definition->rootAttributes('layout');
        } else {
            $definition->init($this->getDefinition());
        }
        $definition->pack();
        
        $status = $definition->validate();
        
        if (is_bool($status) && $status) {
            $model_validator = afsPageModelValidator::create($this)->execute();
            if (!$model_validator->isValid()) return afResponseHelper::create()->success(false)->message($model_validator->getMessages(true));
            
            afStudioUtil::writeFile($this->getPagePath(), $definition->get());
            $this->setNew(false);
            
            $this->createAction();
            
            return afResponseHelper::create()->success(true);
        }
        
        return afResponseHelper::create()->success(false)->message($status);
    }
    
    /**
     * Rename current page
     *
     * @param string $new_name 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function rename($new_name)
    {
        $response = afResponseHelper::create();
        
        if ($this->isNew()) return $response->success(false)->message("Page doesn't exists, create widget first");
        
        $old_name = $this->getName();
        
		$oldPath = $this->getPagePath();
		$newPath = $this->getPagePath($new_name);
        
		if (file_exists($newPath)) return $response->success(false)->message("Page <b>{$new_name}</b> already exists");
		
		$renamed = afsViewModelHelper::renameAction($old_name, $new_name, self::MODULE, $this->getApplication(), 'app');
        afsFileSystem::create()->rename($oldPath, $newPath);
        
		if (!file_exists($oldPath) && file_exists($newPath)) {
			return $response->success(true)->message("Renamed page from <b>{$old_name}</b> to <b>{$new_name}</b>!");
		}
        
        return $response->success(false)->message("Can't rename page from <b>{$old_name}</b> to <b>{$new_name}</b>!");
    }
    
    /**
     * Delete page functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function delete()
    {
        $response = afResponseHelper::create();
        if ($this->isNew()) return $response->success(false)->message("Page <b>{$this->getName()}</b> doesn't exists");
        
        $page_path = $this->getPagePath();
		$page_action_path = $this->getPageActionPath();
		
        $filesystem = afsFileSystem::create();
        
        if (file_exists($page_path)) $filesystem->remove($page_path);
        if (file_exists($page_action_path)) $filesystem->remove($page_action_path);
        
		if (!file_exists($page_path)) {
			return $response->success(true)->message("Page <b>{$this->getName()}</b> has been successfully deleted");
		}
		
		return $response->success(false)->message("Can't delete page <b>{$this->getName()}</b>!");
    }
    
    /**
     * Getting current page path
     *
     * @return string
     * @author Sergey Startsev
     */
    private function getPagePath($name = null)
    {
        if (is_null($name)) {
            $name = $this->getName();
        }
        
        return $this->getPagesPath() . DIRECTORY_SEPARATOR . "{$name}.xml";
    }
    
    /**
     * Getting current page action path
     *
     * @return string
     * @author Sergey Startsev
     */
    private function getPageActionPath($name = null)
    {
        if (is_null($name)) {
            $name = $this->getName();
        }
        
        return $this->getPagesModulePath() . DIRECTORY_SEPARATOR . "actions" . DIRECTORY_SEPARATOR . "{$name}Action.class.php";
    }
    
    /**
     * Getting pages path
     *
     * @return string
     * @author Sergey Startsev
     */
    private function getPagesPath()
    {
        return $this->getPagesApplicationPath() . DIRECTORY_SEPARATOR . "config" . DIRECTORY_SEPARATOR . "pages";
    }
    
    /**
     * Getting pages module path
     *
     * @param string $module 
     * @return string
     * @author Sergey Startsev
     */
    private function getPagesModulePath($module = self::MODULE)
    {
        return $this->getPagesApplicationPath() . DIRECTORY_SEPARATOR . "modules" . DIRECTORY_SEPARATOR . $module;
    }
    
    /**
     * Getting pages application path
     *
     * @return void
     * @author Sergey Startsev
     */
    private function getPagesApplicationPath()
    {
        return afStudioUtil::getRootDir() . DIRECTORY_SEPARATOR . "apps" . DIRECTORY_SEPARATOR . $this->getApplication();
    }
    
    /**
     * Adding top element
     * Order params in array make sense
     *
     * @param string $name 
     * @param array $params 
     * @author Sergey Startsev
     */
    private function addTopElement($name, array $params = array())
    {
        $element_method = "add" . ucfirst(strtolower($name)) . "Element";
        if (method_exists($this, $element_method)) {
            call_user_func_array(array($this, $element_method), $params);
        }
        
        return $this;
    }
    
    /**
     * Add top title element 
     *
     * @param string $title 
     * @return afsPageModel
     * @author Sergey Startsev
     */
    private function addTitleTopElement($title)
    {
        $definition = array(
            'i:title' => $title
        );
        
        $this->setDefinition(array_merge($definition, $this->getDefinition()));
        
        return $this;
    }
    
    /**
     * Add top area element
     *
     * @param string $layout 
     * @param string $type 
     * @return afsPageModel
     * @author Sergey Startsev
     */
    private function addAreaTopElement($layout = 1, $type = 'content')
    {
        $definition = array(
            'i:area'  => array(
                'attributes' => array(
                    'layout' => $layout, 
                    'type'   => $type
                )
            )
        );
        
        $this->setDefinition(array_merge($definition, $this->getDefinition()));
        
        return $this;
    }
    
    /**
     * Creating new action
     *
     * @param string $module 
     * @return afResponse
     * @author Sergey Startsev
     */
    private function createAction($module = self::MODULE)
    {
        $response = afResponseHelper::create();
        
        if ($this->isNew()) return $response->success(false)->message("can't create action for new page. Please first create and save definition");
        
        $name = $this->getName();
        $path = $this->getPageActionPath();
        
        $definition = afsPageModelTemplate::create()->action($name);
        
        if (file_exists($path)) return $response->success(true)->message("Action for '{$name}' already exists");
        if (afStudioUtil::writeFile($path, $definition)) return $response->success(true)->message("Action has been successfully created");
        
        return $response->success(false)->message("Can't create action file");
    }
    
}
