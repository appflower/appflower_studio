<?php
/**
 * Console helper class
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsConsoleHelper
{
    /**
     * Mac Os X os type
     */
    const OS_MAC = 'mac os x';
    
    /**
     * Linux os type
     */
    const OS_LINUX = 'linux';
    
    /**
     * Windows os type
     */
    const OS_WINDOWS = 'windows';
    
    /**
     * Getting operating system type
     *
     * @return string
     * @author Sergey Startsev
     */
    static public function getOsType()
    {
        if (strtolower(substr(PHP_OS, 0, 3)) == 'win') return self::OS_WINDOWS;
        if (strtolower(PHP_OS) == 'darwin') return self::OS_MAC;
        
        return self::OS_LINUX;
    }
    
    /**
     * Checking is Windows - current operating system
     *
     * @return boolean
     * @author Sergey Startsev
     */
    static public function isWinOs()
    {
        return self::getOsType() == self::OS_WINDOWS;
    }
    
    /**
     * Checking is Linux - current OS
     *
     * @return boolean
     * @author Sergey Startsev
     */
    static public function isLinuxOs()
    {
        return self::getOsType() == self::OS_LINUX;
    }
    
    /**
     * Checking is Mac - current OS
     *
     * @return boolean
     * @author Sergey Startsev
     */
    static public function isMasOs()
    {
        return self::getOsType() == self::OS_MAC;
    }
    
    /**
     * Checking is current OS unix like
     *
     * @return boolean
     * @author Sergey Startsev
     */
    static public function isUnixLikeOs()
    {
        return in_array(self::getOsType(), array(self::OS_LINUX, self::OS_MAC));
    }
    
}
