<?php
/**
 * Page model helper
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsPageModelHelper extends afsBaseModelHelper
{
    /**
     * Default application 
     */
    const DEFAULT_APPLICATION = 'frontend';
    
    /**
     * Retrieve existed page 
     *
     * @param string $name 
     * @param string $app 
     * @return afsPageModel
     * @author Sergey Startsev
     */
    static public function retrieve($name, $app = self::DEFAULT_APPLICATION)
    {
        $page = new afsPageModel;
        
        $page->setName($name);
        $page->setApplication($app);
        
        return $page->load();
    }
    
    
}
