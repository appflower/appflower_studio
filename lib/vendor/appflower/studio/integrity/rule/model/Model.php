<?php

namespace AppFlower\Studio\Integrity\Rule\Model;

use AppFlower\Studio\Integrity\Rule\Base as Base;

/**
 * Model rule functionality
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class Model extends Base
{
    
    protected function executeFieldsExisting()
    {
        $this->addMessage($this->getMethodName(__METHOD__, true) . ': asd');
    }
    
}
