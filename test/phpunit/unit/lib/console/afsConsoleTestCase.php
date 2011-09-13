<?php
/**
 * Console test case class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsConsoleTest extends sfBasePhpunitTestCase implements sfPhpunitFixtureFileAggregator 
{
    /**
     * Initialization test
     *
     * @author Sergey Startsev
     */
    public function testInitialization() 
    {
        $console = afStudioConsole::getInstance();
        $console->execute('sf cc');
        
        $this->assertTrue($console->wasLastCommandSuccessfull(), "clear cache wasn't successfully executed");
    }
    
    /**
     * Getting commands list test
     * 
     * @depends testInitialization
     * 
     * @author Sergey Startsev
     */
    public function testGettingCommands() 
    {
        $commands = afStudioConsole::getInstance()->getCommands();
        $this->assertTrue(is_array($commands), 'getCommands should return array');
    }
    
}
