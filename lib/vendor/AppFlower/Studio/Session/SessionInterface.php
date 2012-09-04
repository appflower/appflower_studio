<?php

namespace AppFlower\Studio\Session;

/**
 * Session interface
 *
 * @package appFlowerStudio
 * @author Michal Piotrowski
 */
interface SessionInterface
{
    public function get($name, $default = null);
    public function set($name, $value);
}
