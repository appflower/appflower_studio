<?php
/**
 * Studio widget command template class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioWidgetCommandTemplate
{
    /**
     * Getting action definition
     *
     * @param string $name 
     * @param string $type 
     * @return string
     * @author Lukasz Wojciechowski
     * @author Sergey Startsev
     */
    static public function action($name, $type = 'list')
    {
        if ($type == 'list') {
            $definition =
                '<'.'?'.'php'."\n".
                "class {$name}Action extends sfAction" . "\n" .
                "{" . "\n" .
                '    function execute($request)' . "\n" .
                "    {" . "\n" .
                "    }" . "\n" .
                "}";
        } else {
            $definition =
                '<'.'?'.'php'."\n".
                "class {$name}Action extends simpleWidgetEditAction" . "\n" .
                "{" . "\n" .
                "}";
        }
        
        return $definition;
    }
    
}
