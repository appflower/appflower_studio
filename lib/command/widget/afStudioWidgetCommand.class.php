<?php
/**
 * Studio Widget Command Class
 *
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioWidgetCommand extends afBaseStudioCommand
{
    /**
	 * Rename xml functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processRename()
	{
	    $oldValue = $this->getParameter('oldValue');
		$newValue = $this->getParameter('newValue');
		$place = $this->getParameter('place');
		$module = $this->getParameter('module');
		$type    = $this->getParameter('type', 'app');
		
		$filesystem = new sfFileSystem();
		$root = afStudioUtil::getRootDir();
		$afConsole = afStudioConsole::getInstance();
		
		$console = $afConsole->execute('afs fix-perms');
		
		$oldName = "{$root}/{$type}s/{$place}/modules/{$module}/config/{$oldValue}";
		$newName = "{$root}/{$type}s/{$place}/modules/{$module}/config/{$newValue}";
		
		if (!file_exists($newName)) {
            // $filesystem->rename($oldName, $newName);
            $console .= $afConsole->execute("mv {$oldName} {$newName}");
            
    		if (!file_exists($oldName) && file_exists($newName)) {			
    			$console .= $afConsole->execute('sf cc');
                
    			$this->result = afResponseHelper::create()
    			                    ->success(true)
    			                    ->message("Renamed page from <b>{$oldValue}</b> to <b>{$newValue}</b>!")
    			                    ->console($console);
    		} else {
    		    $this->result = afResponseHelper::create()->success(false)->message("Can't rename page from <b>{$oldValue}</b> to <b>{$newValue}</b>!");
    		}
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("View {$newValue} already exists");
		}
		
		return $this->result->asArray();
	}
	
	/**
	 * Delete xml functionality
	 * 
	 * @author Sergey Startsev
	 */
	protected function processDelete()
	{
		$place = $this->getParameter('place');
		$module = $this->getParameter('module');
		$type = $this->getParameter('type', 'app');
		$name = $this->getParameter('name');
		
		$root = afStudioUtil::getRootDir();
		$afConsole = afStudioConsole::getInstance();
		
		$xmlDir = "{$root}/{$type}s/{$place}/modules/{$module}/config/{$name}";
		
		$console = $afConsole->execute(array(
            'afs fix-perms',
            "rm -rf {$xmlDir}"
		));
		
		if (!file_exists($xmlDir)) {	
			$console .= $afConsole->execute('sf cc');		
			
			$this->result = afResponseHelper::create()
			                    ->success(true)
			                    ->message("Deleted page <b>{$name}</b>")
			                    ->console($console);
		} else {
		    $this->result = afResponseHelper::create()->success(false)->message("Can't delete page <b>{$name}</b>!");
		}
		
		return $this->result->asArray();
	}
    
}