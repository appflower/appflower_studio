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
    
    
    private $name;
    
    private $application;
    
    private $title;
    
    
    public function setTitle($title)
    {
        $this->title = $title;
    }
    
    public function setName($name)
    {
        $this->name = $name;
    }
    
    public function setApplication($application)
    {
        $this->application = $application;
    }
    
    
    public function getTitle()
    {
        return $this->title;
    }
    
    public function getName()
    {
        return $this->name;
    }
    
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
        // getting page file path
        $path = $this->getPagesPath() . "/{$this->getName()}.xml";
        
        if (is_readable($path)) {
            $definition = file_get_contents($path);
            $definition = afsXmlDefinition::create()->init($definition)->unpack()->get();
            
            $this->setDefinition($definition);
            
            $this->setNew(false);
        }
        
        return $this;
    }
    
    
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
        
        
        $path = "{$this->getPagesPath()}/{$this->getName()}.xml";
        $response = afResponseHelper::create();
        
        $status = $definition->validate();
        
        if (is_bool($status) && $status) {
            afStudioUtil::writeFile($path, $definition->get());
            $response->success(true);
        } else {
            $response->success(false)->message($status);
        }
        
        return $response;
    }
    
    private function getPagesPath()
    {
        return afStudioUtil::getRootDir() . "/apps/{$this->getApplication()}/config/pages";
    }
    
    private function getPagesModulePath($module = self::MODULE)
    {
        return afStudioUtil::getRootDir() . "/apps/{$this->getApplication()}/modules/{$module}";
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
        $name = $this->getName();
        $application = $this->getApplication();
        
        $module_dir = $this->getPagesModulePath();
        $action_dir = "{$module_dir}/actions";
        
        $response = afResponseHelper::create();
        
        if (file_exists($action_dir)) {
            $path = "{$action_dir}/{$name}Action.class.php";
            $definition = afStudioLayoutCommandTemplate::action($name);
            
            if (!file_exists($path)) {
                if (afStudioUtil::writeFile($path, $definition)) {
                    $response->success(true)->message("Action has been successfully created");
                } else {
                    $response->success(false)->message("Can't create action in '{$module}' module");
                }
            } else {
                $response->success(true)->message("Action for '{$name}' already exists");
            }
        } else {
            $response->success(false)->message("Directory for action doesn't exists in '{$application}/{$module}'");
        }
        
        return $response;
    }
    
}
