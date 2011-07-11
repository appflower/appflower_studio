<?php
/**
 * Studio Widget Command Class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioWidgetCommand extends afBaseStudioCommand
{
    /**
     * Current module
     */
    private $module;
    
    /**
     * Current action
     */
    private $action;
    
    /**
     * Get widget functionality
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processGet()
    {
        $response = afResponseHelper::create();
        
        try {
            $this->parseUri($this->getParameter('uri'));
            
            $place_type = $this->getParameter('placeType', 'app');
            $place = $this->getParameter('place', 'frontend');
            
            $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $place_type);
            
            $data = $widget->getDefinition();
            
            $response->success(true)->data(array(), $data, 0);
        } catch( Exception $e ) {
            $response->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    /**
     * Save widget functionality
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processSave()
    {
        // create reponse object
        $response = afResponseHelper::create();
        
        try {
            $this->parseUri($this->getParameter('uri'));
            
            $data = $this->getParameter('data');
            $createNewWidget = ($this->getParameter('createNewWidget') == 'true' ? true : false);
            $place = $this->getParameter('place', 'frontend');
            $place_type = $this->getParameter('placeType', 'app');
            $type = $this->getParameter('widgetType');
            
            // retrieve widget object
            $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $place_type);
            
            $widget->setType($type);
            $widget->setIsNewMode($createNewWidget);
            
            $widget->setDefinition($data);
            
            // apply modifiers
            $widget->modify();
            
            $saveResponse = $widget->save();
            
            if ($saveResponse->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                $message = $createNewWidget ? 'Widget was succesfully created' : 'Widget was succesfully saved';
                
                $response
                    ->success(true)
                    ->message($message)
                    ->data(array(), afStudioWidgetCommandHelper::getInfo($this->action, $this->module, $place, $place_type), 0);
                
            } else {
                $response->success(false)->message($saveResponse->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
            }
        } catch( Exception $e ) {
            $response->success(false)->message($e->getMessage());
        }
        
        return $response->asArray();
    }
    
    /**
	 * Rename xml functionality
	 * 
	 * @return array
	 * @author Sergey Startsev
	 */
	protected function processRename()
	{
        // getting parameters
	    $oldValue   = $this->getParameter('oldValue');
		$newValue   = $this->getParameter('newValue');
		$place      = $this->getParameter('place');
		$module     = $this->getParameter('module');
		$type       = $this->getParameter('type', 'app');
		
		$afConsole = afStudioConsole::getInstance();
		
        // fix permissions
        // $console = $afConsole->execute('afs fix-perms');
		
		$action = pathinfo($oldValue, PATHINFO_FILENAME);
		$new_action = pathinfo($newValue, PATHINFO_FILENAME);
		
		$widget = afsWidgetModelHelper::retrieve($action, $module, $place, $type);
		
		if (!$widget->isNew()) {
		    $response = $widget->rename($new_action);
		} else {
		    $response = afResponseHelper::create()->success(false)->message("Can't retrieve widget");
		}
		
		return $response->asArray();
	}
	
	/**
	 * Delete xml functionality
	 * 
	 * @return array
	 * @author Sergey Startsev
	 */
	protected function processDelete()
	{
        // init params 
        $name   = pathinfo($this->getParameter('name'), PATHINFO_FILENAME);
        $module = $this->getParameter('module');
		$place  = $this->getParameter('place');
		$place_type   = $this->getParameter('type', 'app');
		
        // retrieve widget 
		$widget = afsWidgetModelHelper::retrieve($name, $module, $place, $place_type);
		
		if (!$widget->isNew()) {
		    $response = $widget->delete();
		} else {
		    $response = afResponseHelper::create()->success(false)->message("Widget <b>{$name}</b> doesn't exists");
		}
		
		return $response->asArray();
	}
    
    /**
     * Parse input uri
     *
     * @param string $uri 
     * @author Sergey Startsev
     */
    private function parseUri($uri)
    {
        $uriParts = explode('/', $uri);
        
        if (count($uriParts) != 2) {
            throw new afStudioWidgetCommandException("Given widget URI: '{$uri}' looks wrong");
        }

        $this->module = $uriParts[0];
        $this->action = $uriParts[1];
    }
    
}
