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
     * @return afResponse
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
            
            if (!$widget->isNew()) return $response->success(true)->data(array(), $widget->getDefinition(), 0);
            
            return $response->success(false)->message("Widget '{$this->module}/{$this->action}' doesn't exists");
        } catch( Exception $e ) {
            return $response->success(false)->message($e->getMessage());
        }
    }
    
    /**
     * Save widget functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processSave()
    {
        // create response object
        $response = afResponseHelper::create();
        
        try {
            $this->parseUri($this->getParameter('uri'));
            
            $data = $this->getParameter('data');
            $createNewWidget = ($this->getParameter('createNewWidget') == 'true' ? true : false);
            $place = $this->getParameter('place', 'frontend');
            $place_type = $this->getParameter('placeType', 'app');
            $type = $this->getParameter('widgetType');
            
            if (!is_array($data)) return $response->success(false)->message("Wrong data defined. Please check request.")->asArray();
            
            // retrieve widget object
            $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $place_type);
            
            $widget->setType($type);
            $widget->setIsNewMode($createNewWidget);
            
            $widget->setDefinition($data);
            
            // apply modifiers
            $widget->modify();
            
            if ($widget->save()->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                // deploy libs to main project 
                afStudioWidgetCommandHelper::deployLibs();
                
                return $response
                            ->success(true)
                            ->message($createNewWidget ? 'Widget was succesfully created' : 'Widget was succesfully saved')
                            ->data(array(), afsWidgetModelHelper::getInfo($widget), 0);
            }
            
            return $response->success(false)->message($saveResponse->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
        } catch( Exception $e ) {
            return $response->success(false)->message($e->getMessage());
        }
    }
    
    /**
	 * Rename xml functionality
	 * 
	 * @return afResponse
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
		
		$action = pathinfo($oldValue, PATHINFO_FILENAME);
		$new_action = pathinfo($newValue, PATHINFO_FILENAME);
		
		$widget = afsWidgetModelHelper::retrieve($action, $module, $place, $type);
		
		if (!$widget->isNew()) {
		    $response = $widget->rename($new_action);
		    if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
		        $response->console(afStudioConsole::getInstance()->execute('sf cc'));
		    }
		    
		    return $response;
		}
		
        return afResponseHelper::create()->success(false)->message("Can't retrieve widget");
	}
	
	/**
	 * Delete xml functionality
	 * 
	 * @return afResponse
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
		    if ($response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
		        $response->console(afStudioConsole::getInstance()->execute('sf cc'));
		    }
		    
		    return $response;
		}
		
		return afResponseHelper::create()->success(false)->message("Widget <b>{$name}</b> doesn't exists");
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
