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
        $response = afStudioCommand::process('model', 'add', $this->getParameters());
        $this->assertTrue($response instanceof afResponse, 'response should be afResponse instance');
        $this->assertTrue($response->hasParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response from command get should contains 'success'");
        
        $has_response = afStudioCommand::process('model', 'has', $this->getParameters());
        
        $response_success = $has_response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR);
        if ($response_success) {
            $this->assertTrue($response_success, "response should be true - model should be created");
        } else {
            $this->assertFalse($response_success, "response should be false - model already exists");
        }
        
        $response = afStudioCommand::process('model', 'add', $this->getParameters());
        $this->assertFalse($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response should be false - please check model checking existed model");
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
        $this->assertTrue($response instanceof afResponse, 'response from get command should be afResponse instance');
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
        
        $this->assertEquals(
            $model_expected_json, 
            afStudioCommand::process('model', 'read', $this->getParameters())->asJson(), 
            "actual and expected json model doesn't match"
        );
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
        
        $this->assertTrue($response instanceof afResponse, 'response from alterModel command should be afResponse instance');
        
        $this->assertTrue($response->hasParameter(afResponseSuccessDecorator::IDENTIFICATOR), "in response should be 'success'");
        $this->assertTrue($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR), "fields should be successfully created, given response not success");
        
        $this->assertStringEqualsFile(
            $this->fixture()->getFileOwn('ModelAddingFieldsResponse.json'), 
            afStudioCommand::process('model', 'read', $this->getParameters())->asJson(), 
            "actual and expected json model doesn't match"
        );
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
        
        $this->assertTrue($response instanceof afResponse, 'response from alterModel command should be array');
        $this->assertTrue($response->hasParameter(afResponseSuccessDecorator::IDENTIFICATOR), "in response should be 'success'");
        $this->assertTrue($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR), "fields should be successfully created, given response not success");
        
        $this->assertStringEqualsFile(
            $this->fixture()->getFileOwn('ModelRemovingFieldsResponse.json'), 
            afStudioCommand::process('model', 'read', $this->getParameters())->asJson(), 
            "actual and expected json model doesn't match"
        );
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
        $this->assertTrue($response instanceof afResponse, "response should be afResponse instance");
        $this->assertTrue($response->hasParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response from command delete should contains 'success'");
        $this->assertTrue($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response should be true - model should be deleted");
    }
    
    /**
     * Testing delete non existen model
     *
     * @depends testDeleteModel
     * 
     * @author Sergey Startsev
     */
    public function testDeleteNonExistenModel() 
    {
        $response = afStudioCommand::process('model', 'delete', $this->getParameters());
        $this->assertTrue($response instanceof afResponse, 'response should be afResponse instance');
        $this->assertTrue($response->hasParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response from command delete should contains 'success'");
        $this->assertFalse($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response should be false - model should be already deleted");
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
