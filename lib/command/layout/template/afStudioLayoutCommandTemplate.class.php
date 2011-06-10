<?php
/**
 * Studio layout command template class
 *
 * @package appflower studio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioLayoutCommandTemplate
{
    /**
     * Get action definition
     *
     * @param string $name - action name
     * @return string
     * @author Sergey Startsev
     */
    static public function action($name)
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
    
}
