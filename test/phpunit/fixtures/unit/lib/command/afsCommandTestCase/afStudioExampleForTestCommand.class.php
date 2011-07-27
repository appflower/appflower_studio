<?php
/**
 * Studio command test class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioExampleForTestCommand extends afBaseStudioCommand
{
    /**
     * Test response method
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processTestResponse()
    {
        return afResponseHelper::create()->success(true)->asArray();
    }
    
}
