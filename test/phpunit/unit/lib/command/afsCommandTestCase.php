<?php
/**
 * Studio command test case class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsCommandTest extends sfBasePhpunitTestCase implements sfPhpunitFixtureFileAggregator
{
    /**
     * Pre-execute method - Initialize test classes
     *
     * @author Sergey Startsev
     */
    public function _start()
    {
        require_once($this->fixture()->getFileOwn('afStudioExampleForTestCommand.class.php'));
    }
    
    /**
     * Test response type from command 
     *
     * @author Sergey Startsev
     */
    public function testResponseType() 
    {
        $response = afStudioCommand::process('exampleForTest', 'testResponse');
        
        // for now it's array, in future will be changed to afResponse object
        $this->assertTrue(is_array($response), 'response should be array');
    }
    
    /**
     * Test not existed command, catch expected exception via pseudo-annotation
     * 
     * @expectedException afStudioCommandException
     * 
     * @author Sergey Startsev
     */
    public function testNotExistedCommand() 
    {
        $response = afStudioCommand::process('notExistedCommand', 'notExistedMethod');
    }
    
}
