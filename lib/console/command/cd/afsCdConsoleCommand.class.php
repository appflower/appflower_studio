<?php
/**
 * cd console command class
 *
 * @package appFlowerStudio
 * @author Michal Piotrowski
 */
class afsCdConsoleCommand extends afsBaseConsoleCommand
{
    /**
     * Command name
     */
    protected $name = 'cd';

    /**
     * Command prefix
     */
    protected $prefix = '';

    /**
     * Prepare command method
     *
     * @return string
     * @author Michal Piotrowski
     */
    protected function prepare()
    {
        $command = $this->getCommand();
        $dir = substr($this->getCommand(), 3);
        $afConsole = afStudioConsole::getInstance();
        $pwd = $afConsole->getPwd();
        if ($dir == '/') {
            $afConsole->setPwd('/');
        } elseif ($dir == '..') {
            $tmp_dir = explode('/', $pwd);
            $cut_dir = array_pop($tmp_dir);
            $tmp_dir = implode('/', $tmp_dir);
            $afConsole->setPwd($tmp_dir);
        } else {
            $tmp_dir = $dir;
            if (is_dir($tmp_dir)) {
                $afConsole->setPwd($tmp_dir);
            } else {
                $tmp_dir = $pwd.'/'.$dir;
                if (is_dir($tmp_dir)) {
                    $afConsole->setPwd($tmp_dir);
                }
            }
        }
        return $this->getCommand();
    }
}
