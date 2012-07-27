<?php
/**
 * Generate Widget task
 *
 * @package     appFlowerStudio
 * @subpackage  task
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsGenerateWidgetTask extends afsBaseGenerateTask
{
    /**
     * Current task name
     *
     * @var string
     */
    protected $task_name = 'afsGenerateWidgetTask';
    
    /**
     * Widget types
     *
     * @var array
     */
    private $types = array(
        'list',
        'edit',
        'show',
    );
    
    /**
     * Places types
     *
     * @var array
     */
    private $place_types = array(
        'app',
        'plugin',
    );
    
    /**
     * @see sfTask
     */
    protected function configure()
    {
        $this->addOptions(array(
            new sfCommandOption('model', 'm', sfCommandOption::PARAMETER_REQUIRED, 'Model that should be processed'),
            new sfCommandOption('module', 'l', sfCommandOption::PARAMETER_OPTIONAL, 'Module where widgets should be placed', ''),
            new sfCommandOption('type', 'k', sfCommandOption::PARAMETER_OPTIONAL, 'Type of widget', 'list,edit,show'),
            new sfCommandOption('fields', 'f', sfCommandOption::PARAMETER_OPTIONAL, 'Fields that should be processed from model(comma separated) - if empty all fields will be processed', ''),
            new sfCommandOption('place-type', 'a', sfCommandOption::PARAMETER_OPTIONAL, 'Place type where should be saved widget', 'app'),
            new sfCommandOption('place', 'p', sfCommandOption::PARAMETER_OPTIONAL, 'Place where should be saved widget', 'frontend'),
            new sfCommandOption('refresh', 'r', sfCommandOption::PARAMETER_OPTIONAL, 'Should be widget refreshed/rewritten if already exists', false),
        ));
        
        $this->namespace = 'afs';
        $this->name = 'generate-widget';
        $this->briefDescription = 'Creates new widget';
        
        $this->detailedDescription = <<<EOF
The [afs:generate-widget|INFO] task generate widget:

  [./symfony afs:generate-widget|INFO]
EOF;
    }
    
    /**
     * @see sfTask
     */
    protected function execute($arguments = array(), $options = array())
    {
        // XmlParser uses sfContext that not defined by default - so we create instance here
        sfContext::createInstance(ProjectConfiguration::getApplicationConfiguration($this->getFirstApplication(), 'dev', true));
        
        // pushed params 
        $model = $options['model'];
        $module = (!empty($options['module'])) ? $options['module'] : lcfirst(sfInflector::camelize($model));
        $types = $options['type'];
        $fields = $options['fields'];
        $placeType = $options['place-type'];
        $place = $options['place'];
        $refresh = ($options['refresh'] == 'true' || $options['refresh'] === true) ? true : false;
        
        // required params
        if (empty($model)) throw new sfCommandException("Option 'model' should be defined");
        
        // place params validation
        if (!in_array($placeType, $this->place_types)) throw new sfCommandException("Place type '{$placeType}' doesn't allowed");
        if (!in_array($place, $this->getPlaces($placeType))) throw new sfCommandException("Place '{$place}' wasn't found in {$placeType}s area");
        
        if (!afStudioCommand::process('model', 'has', array('model' => $model))->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) {
            throw new sfCommandException("Model '{$model}' doesn't exists");
        }
        
        $response = afStudioCommand::process('model', 'read', array('model' => $model));
        
        $widget_fields = $model_fields = $response->getParameter(afResponseDataDecorator::IDENTIFICATOR_DATA);
        
        if (!empty($fields)) {
            $widget_model_fields = array();
            foreach ($model_fields as $field) $widget_model_fields[$field['name']] = $field;
            
            $widget_fields = array();
            $requested_fields = explode(',', $fields);
            
            // validate fields - if commented next 3 lines - will be used optimistic checking
            // foreach ($requested_fields as $field) {
                // if (!array_key_exists($field, $widget_model_fields)) throw new sfCommandException("Field '{$field}' wasn't found in model fields");
            // }
            
            foreach ($model_fields as $field) {
                if (in_array($field['name'], $requested_fields)) $widget_fields[] = $field;
            }
            
            if (empty($widget_fields)) $widget_fields = $model_fields;
        }
        
        foreach (explode(',', $types) as $type) {
            if (!in_array($type, $this->types)) throw new sfCommandException("Type '{$type}' doesn't exists or not allowed");
            
            $widget_name = lcfirst(sfInflector::camelize($model)) . ucfirst(strtolower($type));
            $widget_path = "{$placeType}s/{$place}/modules/{$module}/config/{$widget_name}.xml";
            
            if (file_exists(sfConfig::get('sf_root_dir') . "/{$widget_path}")) {
                if (!$refresh) {
                    $this->logSection('exists', $widget_path, null, 'ERROR');
                    continue;
                } else {
                    afStudioCommand::process('widget', 'delete', array('type' => $placeType, 'place' => $place, 'module' => $module, 'name' => $widget_name));
                }
            }
            
            $create_response = afStudioCommand::process(
                'widget', 
                'save', 
                array(
                    'uri'               =>  "{$module}/{$widget_name}",
                    'data'              =>  $this->getDefinition($type, array(
                                                'title' => ucfirst(strtolower($type)) . ' ' . sfInflector::humanize($model),
                                                'fields' => $widget_fields,
                                                'model' => $model,
                                                'module' => $module,
                                                'widget_name' => $widget_name,
                                                'types' => $types
                                            )),
                    'widgetType'        =>  $type,
                    'createNewWidget'   =>  'true',
                    'placeType'         =>  $placeType,
                    'place'             =>  $place,
                    'model'             =>  $model
                )
            );
            
            $is_created = $create_response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR);
            if (!$is_created) {
                $this->log_it($create_response->getParameter(afResponseMessageDecorator::IDENTIFICATOR));
            }
            $this->logSection(($is_created) ? 'created' : 'not created', $widget_path, null, ($is_created) ? 'INFO' : 'ERROR');
            $this->log_it((($is_created) ? 'created' : 'not created') . ' - ' . $widget_path);
        }
        
        // execute fix permissions task, ran in background
        $task = new afsPermissionsTask(sfContext::getInstance()->getEventDispatcher(), new sfFormatter);
        $task->run();
    }
    
    /**
     * Getting definition
     *
     * @param string $type 
     * @param Array $params 
     * @return array
     * @author Sergey Startsev
     */
    private function getDefinition($type, Array $params)
    {
        return array_merge(
            $this->getHeadAttributes($type), 
            call_user_func(array($this, 'getDefinition' . ucfirst(strtolower($type))), $params)
        );
    }
    
    /**
     * Getting definition list
     *
     * @param Array $params 
     * @return array
     * @author Sergey Startsev
     */
    private function getDefinitionList(Array $params)
    {
        $definition = array(
            'i:title' => $params['title'],
            'i:datasource' => array(
                'attributes' => array(
                    'modelName' => $params['model'],
                    'type' => 'orm',
                ),
                'i:class' => 'ModelCriteriaFetcher',
                'i:method' => array(
                    'attributes' => array(
                        'name' => 'getDataForList',
                    ),
                    'i:param' => array(
                        'attributes' => array(
                            'name' => 'modelName',
                        ),
                        '_content' => $params['model'],
                    ),
                ),
            ),
        );
        
        if (isset($params['fields']) && !empty($params['fields'])) {
            foreach ($params['fields'] as $field) {
                $definition['i:fields']['i:column'][] = array(
                    'attributes' => array(
                        'name' => $field['name'],
                        'label' => sfInflector::humanize($field['name']),
                    )
                );
            }
        }
        
        if(isset($params['types']['edit']))
        {
            $definition['i:rowactions']['i:action'][] = array(
                'attributes' => array(
                                'iconCls' => 'icon-edit', 
                                'name' => 'edit',
                                'tooltip' => 'Edit',
                                'url' => $params['module'].'/'.lcfirst(sfInflector::camelize($params['model'])).'Edit'
                                )
            );
        }
        
        $definition['i:rowactions']['i:action'][] = array(
            'attributes' => array(
                            'iconCls' => 'icon-minus', 
                            'name' => 'delete',
                            'tooltip' => 'Delete',
                            'post' => 'true',
                            'url' => $params['module'].'/'.lcfirst(sfInflector::camelize($params['model'])).'Delete'
                            )
        );
        
        return $definition;
    }
    
    /**
     * Getting edit definition 
     *
     * @param Array $params 
     * @return array
     * @author Sergey Startsev
     */
    private function getDefinitionEdit(Array $params)
    {
        $primary_key = $this->getPrimaryKeyName($params['model']);
        
        $definition = array(
            'i:title' => $params['title'],
            'i:datasource' => array(
                'attributes' => array(
                    'type' => 'orm',
                ),
                'i:class' => $params['model']::PEER,
                'i:method' => array(
                    'attributes' => array(
                        'name' => 'retrieveByPk',
                    ),
                    'i:param' => array(
                        'attributes' => array(
                            'name' => $primary_key,
                        ),
                        '_content' => '{' . $primary_key . '}',
                    ),
                ),
            ),
        );
        
        if (isset($params['fields']) && !empty($params['fields'])) {
            foreach ($params['fields'] as $field) {
                if ($field['name'] == $primary_key) continue;
                $definition['i:fields']['i:field'][] = array(
                    'attributes' => array(
                        'name' => $field['name'],
                        'label' => sfInflector::humanize($field['name']),
                        'value' => '{' . $field['name'] . '}',
                    )
                );
            }
        }
        
        return $definition;
    }
    
    /**
     * Getting show definition
     *
     * @param Array $params 
     * @return array
     * @author Sergey Startsev
     */
    private function getDefinitionShow(Array $params)
    {
        // while it equals to edit - just delegates to 'edit'
        return $this->getDefinitionEdit($params);
    }
    
    /**
     * Get head attributes
     *
     * @param string $type 
     * @return array
     * @author Sergey Startsev
     */
    private function getHeadAttributes($type)
    {
        return  array(
            'attributes' => array(
                'type' => $type,
                'xmlns:xsi' => "http://www.w3.org/2001/XMLSchema-instance",
                'xsi:schemaLocation' => "http://www.appflower.com/schema/appflower.xsd",
                'xmlns:i' => "http://www.appflower.com/schema/",
            )
        );
    }
    
    /**
     * Getting places by place type
     *
     * @param string $type 
     * @return array
     * @author Sergey Startsev
     */
    private function getPlaces($type = 'app')
    {
        $places = array();
        $paths = sfFinder::type('dir')->name('*')->maxdepth(0)->ignore_version_control()->in(sfConfig::get("sf_{$type}s_dir"));
        
        foreach ($paths as $path) $places[] = pathinfo($path, PATHINFO_BASENAME);
        
        return $places;
    }
    
    /**
     * Getting primary key field name
     *
     * @param string $model 
     * @return string
     * @author Sergey Startsev
     */
    private function getPrimaryKeyName($model)
    {
        $peer = $model::PEER;
        
        $table_map = call_user_func(array($peer, 'getTableMap'));
        $pk = key($table_map->getPrimaryKeys());
        
        $pk = call_user_func(array($peer, 'translateFieldName'), $pk, BasePeer::TYPE_RAW_COLNAME, BasePeer::TYPE_FIELDNAME);
        
        return $pk;
    }
    
}
