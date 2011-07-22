<?php
/**
 * Studio xml definition test case class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsXmlDefinitionTest extends sfBasePhpunitTestCase implements sfPhpunitFixtureFileAggregator
{
    /**
     * Test packing xml definition
     *
     * @author Sergey Startsev
     */
    public function testPack()
    {
        $path = $this->fixture()->getFileOwn('Page.json');
        
        $definition_json = file_get_contents($path);
        $definition_array = json_decode($definition_json, true);
        
        $this->assertTrue(is_array($definition_array), 'please check fixture in test file - should be array in json format, given code not array');
        
        $definition = afsXmlDefinition::create()->init($definition_array)->pack();
        
        $this->assertInstanceOf('afsXmlDefinition', $definition, 'check returned value from pack method');
        
        $definition_packed = $definition->get();
        
        $this->assertXmlStringEqualsXmlFile($this->fixture()->getFileOwn('Page.xml'), $definition_packed, "existed xml definition doesn't match packed xml");
    }
    
}
