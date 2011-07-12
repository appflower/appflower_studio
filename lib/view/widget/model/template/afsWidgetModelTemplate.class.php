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
     * Getting action definition via delegated call
     *
     * @param string $name 
     * @param string $type 
     * @return string
     * @author Sergey Startsev
     */
    static public function action($name, $type = 'list')
    {
        $template_name = 'action' . ucfirst(strtolower($type));
        
        if (method_exists(__CLASS__, $template_name)) {
            $definition = call_user_func(array(__CLASS__, $template_name), $name);
        } else {
            throw new afStudioWidgetCommandException("Template: '{$template_name}' not defined");
        }
        
        return $definition;
    }
    
    /**
     * Getting list action definition
     *
     * @param string $name 
     * @return string
     * @author Lukasz Wojciechowski
     * @author Sergey Startsev
     */
    static public function actionList($name)
    {
        $definition =
            '<'.'?'.'php'."\n".
            "class {$name}Action extends sfAction" . "\n" .
            "{" . "\n" .
            '    function execute($request)' . "\n" .
            "    {" . "\n" .
            "    }" . "\n" .
            "}";
        
        return $definition;
    }
    
    /**
     * Getting edit action definition
     *
     * @param string $name 
     * @return string
     * @author Lukasz Wojciechowski
     * @author Sergey Startsev
     */
    static public function actionEdit($name)
    {
        $definition =
            '<'.'?'.'php'."\n".
            "class {$name}Action extends simpleWidgetEditAction" . "\n" .
            "{" . "\n" .
            "}";
        
        return $definition;
    }
    
}
