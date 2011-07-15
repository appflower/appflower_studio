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
            // $this->addTopElement('area')->addTopElement('title', array('title' => $this->getTitle()));
            $this->addAreaTopElement()->addTitleTopElement($this->getTitle());
            
            $definition->init($this->getDefinition());
            $definition->rootAttributes('layout');
        } else {
            $definition->init($this->getDefinition());
        }
        $definition->pack();
        
    }
    
    private function getPagesPath()
    {
        return afStudioUtil::getRootDir() . "/apps/{$this->getApplication()}/config/pages";
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
    
}
