<?php
/**
 * Afs Batch console command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsAfsbatchConsoleCommand extends afsBaseConsoleCommand
{
    /**
     * Command name
     */
    protected $name = 'afsbatch';
    
    /**
     * Command prefix 
     */
    protected $prefix = '../plugins/appFlowerStudioPlugin/batch/';
    
    /**
     * Prepare command method
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function prepare()
    {
        $command = substr($this->getCommand(), 9);
        
        $exec = '';
        if (!empty($command)) {
            $exec = sprintf('%s%s', afStudioUtil::getRootDir().'/plugins/appFlowerStudioPlugin/batch/', $command);
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
        $files = sfFinder::type('file')->name('*.*')->in(afStudioUtil::getRootDir() . '/plugins/appFlowerStudioPlugin/batch/');
        
        foreach ($files as $file) $baseFiles[] = basename($file);
        
        $result = 
            $this->render('../plugins/appFlowerStudioPlugin/batch/<file>') . 
            afsRenderConsoleCommand::render(
                '<b>Usage:</b> afsbatch "file"<br><b>Found batches:</b> ' . implode('; ', $baseFiles), 
                array('class' => 'afStudio_result_command')
            );
        
        return $result;
    }
    
}
