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
    public function areReadable($paths, $mayNotExist = false)
    {
        foreach ($paths as $path) {
            $are_readable = $this->isReadable($path, $mayNotExist);

            if ($are_readable !== true) {
                return $are_readable;
            }
        }

        return true;
    }

    public function areWritable($paths, $mayNotExist = false)
    {
        foreach ($paths as $path) {
            $are_writable = $this->isWritable($path, $mayNotExist);

            if ($are_writable !== true) {
                return $are_writable;
            }
        }

        return true;
    }

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

    public function isReadable($path, $mayNotExist = false)
    {
        $response = \afResponseHelper::create();
        $type = $this->isDirOrIsFileOrIsLink($path);
        $message = ucfirst($type)." ".$path." is not readable. Please check ".$type." permissions.";

        if (is_readable($path)) {
            return true;
        } elseif (($mayNotExist) and (!(file_exists($path)))) {
            return true;
        } else {
            return $response->success(false)->message($message);
        }
    }

    public function isReadableAndWritable($path, $mayNotExist = false)
    {
        $is_readable = $this->isReadable($path, $mayNotExist);

        if ($is_readable !== true) {
            return $is_readable;
        }

        $is_writable = $this->isWritable($path, $mayNotExist);

        if ($is_writable !== true) {
            return $is_writable;
        }

        return true;
    }

    public function isWritable($path, $mayNotExist = false)
    {
        $response = \afResponseHelper::create();
        $type = $this->isDirOrIsFileOrIsLink($path);
        $message = ucfirst($type)." ".$path." is not writable. Please check ".$type." permissions.";

        if (is_writable($path)) {
            return true;
        } elseif (($mayNotExist) and (!(file_exists($path)))) {
            return true;
        } else {
            return $response->success(false)->message($message);
        }
    }
}
