<?php

require_once dirname(__DIR__) . '/../vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'AppFlower\Studio' => dirname(__DIR__) . '/vendor',
));
$loader->register();

use AppFlower\Studio\Filesystem\Permissions;

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
            $model = $this->getParameter('model');
            
            $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $place_type, $model);
            
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
            $model = $this->getParameter('model');

            $permissions = new Permissions();

            if ($place_type == 'app') {
                $dir = 'apps';
            } elseif ($place_type == 'plugin') {
                $dir = 'plugins';
            }

            $are_writable = $permissions->areWritable(array(
                sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/',
                sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/'.$this->module,
                sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/'.$this->module.'/actions/',
                sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/'.$this->module.'/templates/',
            ), true);

            if ($are_writable !== true) {
                return $are_writable;
            }

            if (!is_array($data)) return $response->success(false)->message("Wrong data defined. Please check request.");
            
            if (!preg_match('/^[a-zA-Z_]+$/si', $this->module)) return $response->success(false)->message("Invalid module name.");
            if (!preg_match('/^[a-zA-Z_]+$/si', $this->action)) return $response->success(false)->message("Invalid widget name.");
            
            // retrieve widget object
            $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $place_type, $model);
            
            $widget->setType($type);
            $widget->setIsNewMode($createNewWidget);
            
            $widget->setDefinition($data);
            
            // apply modifiers
            $widget->modify();
            
            $widgetSaveResponse = $widget->save();
            
            if ($widgetSaveResponse->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
                return $response
                            ->success(true)
                            ->message($createNewWidget ? 'Widget was succesfully created' : 'Widget was succesfully saved')
                            ->data(array(), afsWidgetModelHelper::getInfo($widget), 0);
            }
            
            return $response->success(false)->message($widgetSaveResponse->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
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
        $model      = $this->getParameter('model');
        
        $action = pathinfo($oldValue, PATHINFO_FILENAME);
        $new_action = pathinfo($newValue, PATHINFO_FILENAME);
        
        if (!preg_match('/^[a-zA-Z_]+$/si', $new_action)) return afResponseHelper::create()->success(false)->message("Invalid widget name.");
        
        $widget = afsWidgetModelHelper::retrieve($action, $module, $place, $type, $model);
        
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
        $model = $this->getParameter('model');
        $place  = $this->getParameter('place');
        $place_type   = $this->getParameter('type', 'app');

        if ($place_type == 'app') {
            $dir = 'apps';
        } elseif ($place_type == 'plugin') {
            $dir = 'plugins';
        }

        $permissions = new Permissions();

        $are_writable = $permissions->areWritable(array(
            sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/',
            sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/'.$module,
            sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/'.$module.'/actions/',
            sfConfig::get('sf_root_dir').'/'.$dir.'/'.$place.'/modules/'.$module.'/templates/',
        ));

        if ($are_writable !== true) {
            return $are_writable;
        }

        // retrieve widget 
        $widget = afsWidgetModelHelper::retrieve($name, $module, $place, $place_type, $model);
        
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
     * Getting info about widget
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGetInfo()
    {
        $this->parseUri($this->getParameter('uri'));
        
        $place  = $this->getParameter('place', 'frontend');
        $type   = $this->getParameter('type', 'app');
        $model  = $this->getParameter('model');
        
        $widget = afsWidgetModelHelper::retrieve($this->action, $this->module, $place, $type, $model);
        
        if ($widget->isNew()) return afResponseHelper::create()->success(false)->message("This widget doesn't exists");
        return afResponseHelper::create()->success(true)->data(array(), afsWidgetModelHelper::getInfo($widget), 0);
    }
    
    /**
     * Generate widget functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGenerate()
    {
        $model      = $this->getParameter('model');
        $module     = $this->getParameter('module_name', lcfirst(sfInflector::camelize($model)));
        $type       = $this->getParameter('type', 'list,edit,show');
        $fields     = $this->getParameter('fields', '');
        $place_type = $this->getParameter('place_type', 'app');
        $place      = $this->getParameter('place', 'frontend');
        $refresh    = $this->getParameter('refresh', 'false');
        
        $data = array();
        $not_refreshed = array();
        if ($refresh == 'false') {
            foreach (explode(',', $type) as $type_generate) {
                $action = lcfirst(sfInflector::camelize($model)) . ucfirst(strtolower($type_generate));
                $widget = afsWidgetModelHelper::retrieve($action, $module, $place, $place_type, $model);
                if (!$widget->isNew()) $not_refreshed[] = $action;
            }
        }
        
        $console = afStudioConsole::getInstance();
        $console_output = $console->execute(
            "sf afs:generate-widget ".
            "--model={$model} --module={$module} --type={$type} --fields={$fields} --place-type={$place_type} --place={$place} --refresh={$refresh}"
        );
        
        $created = array();
        $not_created = array();
        foreach (explode(',', $type) as $type_generate) {
            $action = lcfirst(sfInflector::camelize($model)) . ucfirst(strtolower($type_generate));
            $widget = afsWidgetModelHelper::retrieve($action, $module, $place, $place_type, $model);
            (!$widget->isNew() && !in_array($action, $not_refreshed)) ? ($created[] = $action) : ($not_created[] = $action);
        }
        
        $data = array(
            'place' => $place,
            'place_type' => $place_type,
            'module' => $module,
            'widgets' => $created,
        );
        
        $message = '';
        if (!empty($created)) $message .= 'Created: <b>' . implode(', ', $created) . '</b>. <br/>';
        if (!empty($not_created) && $not_created != $not_created) $message .= 'Not Created: <b>' . implode(', ', $not_created) . '</b>. <br/>';
        if (!empty($not_refreshed)) $message .= 'Already Exists: <b>' . implode(', ', $not_refreshed) . '</b>.';
        
        return afResponseHelper::create()->success($console->wasLastCommandSuccessfull())->message($message)->data(array(), $data, 0)->console($console_output);
    }
    
    /**
     * Generate all widgets for all models
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGenerateAll()
    {
        $type = $this->getParameter('type', 'list,edit,show');
        $refresh = $this->getParameter('refresh', 'false');
        
        $console_output = afStudioConsole::getInstance()->execute("sf afs:generate-widget-all --type={$type} --refresh={$refresh}");
        
        return afResponseHelper::create()->success(true)->console($console_output);
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
