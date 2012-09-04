<?php

namespace AppFlower\Studio\Session;

/**
 * Session class
 *
 * @package appFlowerStudio
 * @author Michal Piotrowski
 */
class Session implements SessionInterface
{
    public function get($name, $default = null)
    {
        if (\sfContext::getInstance()->getUser()->getAttribute($name)) {
            return \sfContext::getInstance()->getUser()->getAttribute($name);
        } else {
            return $default;
        }
    }

    public function set($name, $value)
    {
        \sfContext::getInstance()->getUser()->setAttribute($name, $value);
    }
}
