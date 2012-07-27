<?php
/**
 * Widget model template class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsWidgetModelTemplate extends afsBaseModelTemplate
{
    /**
     * Create self instance
     *
     * @return afsWidgetModelTemplate
     * @author Sergey Startsev
     */
    static public function create()
    {
        return new self;
    }
    
    /**
     * Process template rendering
     *
     * @param string $name 
     * @param string $type 
     * @return string
     * @author Sergey Startsev
     */
    public function action($name, $type = 'list', $model)
    {
        $template_name = 'afsAction' . ucfirst(strtolower($type));
        $template_path = $this->getTemplatePath($template_name);
        
        if (file_exists($template_path)) {
            return $this->add('name', $name)->add('model', $model)->render($template_path)->wrap('php')->get();
        } else {
            throw new afsWidgetModelTemplateException("Template '{$template_name}' doesn't exists. Path: '{$template_path}'");
        }
    }
    
}
