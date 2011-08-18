<?php
/**
 * Database query test case class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsDatabaseQueryTest extends sfBasePhpunitTestCase 
{
    /**
     * Testing on existing and visibility db query class
     *
     * @author Sergey Startsev
     */
    public function testDatabaseQueryClassExisting() 
    {
        $this->assertTrue(class_exists('afsDatabaseQuery'), "'afsDatabaseQuery' class doesn't exists, or not autoloaded");
    }
    
    /**
     * Testing query on fail
     * 
     * @depends testDatabaseQueryClassExisting
     *
     * @author Sergey Startsev
     */
    public function testQueryFail() 
    {
        $response = afsDatabaseQuery::processQuery('SELECT * FROM `non_existen_table_name`', 'propel', 'sql', 0, 10);
        
        $this->assertTrue($response->hasParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response should contain 'success' wrap");
        $this->assertFalse($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR), "response should be false, unless defined `non_existen_table_name`");
    }
    
    /**
     * Testing non-existed adapter
     *
     * @depends testDatabaseQueryClassExisting
     * @expectedException afsDatabaseQueryException
     * 
     * @author Sergey Startsev
     */
    public function testNonExistenAdaptee()
    {
        $response = afsDatabaseQuery::processQuery('TEST QUERY', 'propel', 'non_existed_adapter', 0, 10);
    }
    
    /**
     * Testing is available created adapters
     * 
     * @depends testDatabaseQueryClassExisting
     *
     * @author Sergey Startsev
     */
    public function testIsAvailableAdapters() 
    {
        $this->assertTrue(class_exists(afsDatabaseQuery::getAdapterName('sql')), "adapter query for 'sql' doesn't exists");
        $this->assertTrue(class_exists(afsDatabaseQuery::getAdapterName('propel')), "adapter query for 'propel' doesn't exists");
    }
    
    /**
     * Test on table query response
     *
     * @depends testIsAvailableAdapters
     * 
     * @author Sergey Startsev
     */
    public function testTableQueryResponse() 
    {
        $tables = afsDatabaseQuery::getTables('propel');
        if (!empty($tables)) {
            $table = $tables[0]['tableName'];
            $model = $tables[0]['modelName'];
            
            // check sql query
            $response = afsDatabaseQuery::processQuery("SELECT * FROM {$table}", 'propel', 'sql');
            $this->assertTrue($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR), 'response should contains success => true');
            $this->assertTrue($response->hasParameter(afResponseDatasetDecorator::IDENTIFICATOR), 'response should contains dataset => array');
            
            $dataset = $response->getParameter(afResponseDatasetDecorator::IDENTIFICATOR);
            
            $this->assertTrue($dataset[0][afResponseSuccessDecorator::IDENTIFICATOR], "query should be successfully executed");
            $this->assertTrue(is_array($dataset[0][afResponseDataDecorator::IDENTIFICATOR_DATA]), "data in response should be array");
            
            
            // check query class
            $query_class = "{$model}Query";
            $this->assertTrue(class_exists($query_class), "Class query '{$query_class}' doesn't exists");
            
            // check propel query - need to solve proble with propel entire ob_end_flush fatal
        }
    }
    
}
