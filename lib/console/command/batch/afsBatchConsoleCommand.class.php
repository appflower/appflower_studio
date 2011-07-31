<?php
/**
 * Batch console command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsBatchConsoleCommand extends afsBaseConsoleCommand
{
    /**
     * Command name 
     */
    protected $name = 'batch';
    
    /**
     * Command prefix
     */
    protected $prefix = '../batch/';
    
    /**
     * Prepare command method
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function prepare()
    {
        $command = substr($this->getCommand(), 6);
        
        $exec = '';
        if (!empty($command)) {
            $exec = sprintf('%s%s', afStudioUtil::getRootDir() . '/batch/', $command);
        }
        
        return $exec;
    }
    
    /**
     * Getting description when command empty
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getDescription()
    {
        $files = sfFinder::type('file')->name('*.*')->in(afStudioUtil::getRootDir() . '/batch/');
        
        foreach ($files as $file) $baseFiles[] = basename($file);
        
        $result = 
            $this->render('../batch/<file>') . 
            afsRenderConsoleCommand::render(
                '<b>Usage:</b> batch "file"<br><b>Found batches:</b> ' . implode('; ',$baseFiles),
                array('class' => 'afStudio_result_command')
            );
        
        return $result;
    }
    
}
