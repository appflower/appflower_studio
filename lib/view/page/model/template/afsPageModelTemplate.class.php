<?php
/**
 * Page model template class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsPageModelTemplate extends afsBaseModelTemplate
{
    /**
     * Action template name
     */
    const ACTION_TEMPLATE_NAME = 'afsPageAction';
    
    /**
     * Create self instance
     *
     * @return afsPageModelTemplate
     * @author Sergey Startsev
     */
    static public function create()
    {
        return new self;
    }
    
    /**
     * Process action template rendering
     *
     * @param string $name 
     * @return string
     * @author Sergey Startsev
     */
    public function action($name, $template_name = self::ACTION_TEMPLATE_NAME)
    {
        $template_path = $this->getTemplatePath($template_name);
        
        if (file_exists($template_path)) {
            return $this->add('name', $name)->render($template_path)->wrap('php')->get();
        } else {
            throw new afsPageModelTemplateException("Template '{$template_name}' doesn't exists. Path: '{$template_path}'");
        }
    }
    
}
