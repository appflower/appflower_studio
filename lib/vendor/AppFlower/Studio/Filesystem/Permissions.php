<?php

namespace AppFlower\Studio\Filesystem;

/**
 * Permissions class
 *
 * @package appFlowerStudio
 * @author Michal Piotrowski
 */
class Permissions
{
    public function isDirOrIsFileOrIsLink($path)
    {
        if (is_dir($path)) {
            return "directory";
        } elseif (is_file($path)) {
            return "file";
        } elseif (is_link($path)) {
            return "link";
        }
    }

    public function isReadable($path)
    {
        $response = \afResponseHelper::create();
        $type = $this->isDirOrIsFileOrIsLink($path);
        $message = ucfirst($type)." ".$path." is not readable. Please check ".$type." permissions.";

        if (is_readable($path)) {
            return true;
        } else {
            return $response->success(false)->message($message);
        }
    }

    public function isWritable($path)
    {
        $response = \afResponseHelper::create();
        $type = $this->isDirOrIsFileOrIsLink($path);
        $message = ucfirst($type)." ".$path." is not writable. Please check ".$type." permissions.";

        if (is_writable($path)) {
            return true;
        } else {
            return $response->success(false)->message($message);
        }
    }
}
