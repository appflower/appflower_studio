<?php
/**
 * Console command helper test case class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsConsoleCommandHelperTest extends sfBasePhpunitTestCase 
{
    /**
     * Console command helper class definition
     */
    const CONSOLE_COMMAND_HELPER_CLASS = 'afsConsoleCommandHelper';
    
    /**
     * Testing exists needed class or not
     * 
     * @author Sergey Startsev
     */
    public function testClassExisting() 
    {
        $this->assertTrue(class_exists(self::CONSOLE_COMMAND_HELPER_CLASS), self::CONSOLE_COMMAND_HELPER_CLASS . " class doesn't exists");
    }
    
    /**
     * Testing on non existed helper method
     * 
     * @depends testClassExisting
     * @expectedException afsConsoleCommandHelperException
     * 
     * @author Sergey Startsev
     */
    public function testNotExistedConsoleCommandHelperMethod() 
    {
        afsConsoleCommandHelper::create()->testNonExistedMethod();
    }
    
}
