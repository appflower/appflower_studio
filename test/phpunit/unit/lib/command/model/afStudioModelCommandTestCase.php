<?php
/**
 * Studio model test class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModelCommandTest extends sfBasePhpunitTestCase implements sfPhpunitFixtureFileAggregator 
{
    /**
     * Testing adding model
     *
     * @author Sergey Startsev
     */
    public function testAddModel() 
    {
        $parameters = array(
            'model' => 'TestModelName'
        );
        
        $response = afStudioCommand::process('model', 'add', $parameters);
        $this->assertArrayHasKey('success', $response, "response from command get should contains 'success'");
        $this->assertTrue($response['success'], "response should be true - model should be created");
        
        $response = afStudioCommand::process('model', 'add', $parameters);
        $this->assertFalse($response['success'], "response should be false - please check model checking existed model");
    }
    
    /**
     * Testing get model
     *
     * @depends testAddModel
     * 
     * @author Sergey Startsev
     */
    public function testGetModel() 
    {
        $parameters = array(
            'model' => 'TestModelName'
        );
        
        $response = afStudioCommand::process('model', 'get', $parameters);
        $this->assertTrue(is_array($response), 'response from get command should be array');
    }
    
    /**
     * Testing delete model
     *
     * @depends testAddModel
     * 
     * @author Sergey Startsev
     */
    public function testDeleteModel() 
    {
        $parameters = array(
            'model' => 'TestModelName'
        );
        
        $response = afStudioCommand::process('model', 'delete', $parameters);
        $this->assertArrayHasKey('success', $response, "response from command delete should contains 'success'");
        $this->assertTrue($response['success'], "response should be true - model should be deleted");
        
        $response = afStudioCommand::process('model', 'delete', $parameters);
        $this->assertFalse($response['success'], "response should be false - model should be already deleted");
    }
    
}
