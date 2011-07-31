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
     * Test model name - for processed model
     */
    const TEST_MODEL_NAME = 'TestModelName';
    
    /**
     * Default parameters
     */
    private $parameters = array(
        'model' => self::TEST_MODEL_NAME
    );
    
    /**
     * Testing adding model
     *
     * @author Sergey Startsev
     */
    public function testAddModel() 
    {
        $response = afStudioCommand::process('model', 'has', $this->getParameters());
        
        if (isset($response[afResponseSuccessDecorator::IDENTIFICATOR]) && !$response[afResponseSuccessDecorator::IDENTIFICATOR]) {
            $response = afStudioCommand::process('model', 'add', $this->getParameters());
            $this->assertArrayHasKey('success', $response, "response from command get should contains 'success'");
            $this->assertTrue($response['success'], "response should be true - model should be created");

            $response = afStudioCommand::process('model', 'add', $this->getParameters());
            $this->assertFalse($response['success'], "response should be false - please check model checking existed model");
        }
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
        $response = afStudioCommand::process('model', 'get', $this->getParameters());
        $this->assertTrue(is_array($response), 'response from get command should be array');
    }
    
    /**
     * Testing read model data
     *
     * @depends testAddModel
     * 
     * @author Sergey Startsev
     */
    public function testReadModel()
    {
        $model_expected_json = file_get_contents($this->fixture()->getFileOwn('ModelEmpty.json'));
        
        $response = afStudioCommand::process('model', 'read', $this->getParameters());
        $response_json = json_encode($response);
        
        $this->assertEquals($model_expected_json, $response_json, "actual and expected json model doesn't match");
    }
    
    /**
     * Testing add field to model
     *
     * @depends testReadModel
     * 
     * @author Sergey Startsev
     */
    public function testAddingFieldsToModel()
    {
        $parameters = array(
            'fields' => file_get_contents($this->fixture()->getFileOwn('ModelAddingFieldsRequest.json')),
            'model'  => self::TEST_MODEL_NAME
        );
        
        $response = afStudioCommand::process('model', 'alterModel', $parameters);
        
        $this->assertTrue(is_array($response), 'response from alterModel command should be array');
        $this->assertArrayHasKey('success', $response, "in response should be 'success'");
        $this->assertTrue($response['success'], "fields should be successfully created, given response not success");
        
        // reading model params
        $response = afStudioCommand::process('model', 'read', $this->getParameters());
        $response_json = json_encode($response);
        
        $this->assertStringEqualsFile($this->fixture()->getFileOwn('ModelAddingFieldsResponse.json'), $response_json, "actual and expected json model doesn't match");
    }
    
    /**
     * Testing add field to model
     *
     * @depends testAddingFieldsToModel
     * 
     * @author Sergey Startsev
     */
    public function testRemovingFieldsFromModel()
    {
        $parameters = array(
            'fields' => file_get_contents($this->fixture()->getFileOwn('ModelRemovingFieldsRequest.json')),
            'model'  => self::TEST_MODEL_NAME
        );
        
        $response = afStudioCommand::process('model', 'alterModel', $parameters);
        
        $this->assertTrue(is_array($response), 'response from alterModel command should be array');
        $this->assertArrayHasKey('success', $response, "in response should be 'success'");
        $this->assertTrue($response['success'], "fields should be successfully created, given response not success");
        
        // reading params
        $response = afStudioCommand::process('model', 'read', $this->getParameters());
        $response_json = json_encode($response);
        
        $this->assertStringEqualsFile($this->fixture()->getFileOwn('ModelRemovingFieldsResponse.json'), $response_json, "actual and expected json model doesn't match");
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
        $response = afStudioCommand::process('model', 'delete', $this->getParameters());
        $this->assertArrayHasKey('success', $response, "response from command delete should contains 'success'");
        $this->assertTrue($response['success'], "response should be true - model should be deleted");
        
        $response = afStudioCommand::process('model', 'delete', $this->getParameters());
        $this->assertFalse($response['success'], "response should be false - model should be already deleted");
    }
    
    /**
     * Getting parameters
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function getParameters()
    {
        return $this->parameters;
    }
    
}
