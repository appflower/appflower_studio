<?php
/**
 * Base Generate Widget task
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class afsBaseGenerateTask extends sfBaseTask
{
    /**
     * Current task name
     *
     * @var string
     */
    protected $task_name = null;
    
    /**
     * Getting current task name
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getTaskName()
    {
        if (is_null($this->task_name)) throw new sfCommandException("In generate task 'task_name' property should be defined");
        
        return $this->task_name;
    }
    
    /**
     * Log it functionality
     *
     * @param string $info 
     * @author Sergey Startsev
     */
    protected function log_it($info)
    {
        if (file_exists(sfConfig::get('sf_log_dir')) && is_writable(sfConfig::get('sf_log_dir'))) {
            file_put_contents(sfConfig::get('sf_log_dir') . DIRECTORY_SEPARATOR . "{$this->getTaskName()}.log", date("Y-m-d H:i:s") . " - {$info}\n", FILE_APPEND);
        }
    }
    
}
