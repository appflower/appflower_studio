<?php

require_once dirname(__DIR__) . '/../../vendor/autoload/UniversalClassLoader.class.php';
$loader = new UniversalClassLoader();
$loader->registerNamespaces(array(
    'AppFlower\Studio' => dirname(__DIR__) . '/vendor',
));
$loader->register();

use AppFlower\Studio\Filesystem\Permissions;

/**
 * Studio model command modificator class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioModelCommandModificator
{
    /**
     * Table name
     */
    private $tableName = null;
    
    /**
     * Model name
     */
    private $modelName = null;
    
    /**
     * Schema file path
     */
    private $schemaFile = null;
    
    /**
     * Propel model array
     */
    private $propelModel = null;
    
    /**
     * Propel schema
     */
    private $propelSchemaArray = null;
    
    /**
     * Original schema
     */
    private $originalSchemaArray = null;
    
    /**
     * Deprecated table names
     *
     * @var array
     */
    private $deprecated_table_names = array(
        'array',
    );
    
    /**
     * Deprecated field names 
     *
     * @var array
     */
    private $deprecated_field_names = array(
        'table_name',
        'database_name',
        'om_class',
        'class_default',
        'num_columns',
    );
    
    /**
     * Deprecated indexes names
     *
     * @var array
     */
    private $deprecated_indexes_names = array(
        'type',
    );
    
    /**
     * Fabric method creator
     *
     * @return afStudioModelCommandModificator
     * @author Sergey Startsev
     */
    static public function create()
    {
        return new self;
    }
    
    /**
     * Private constructor - initializer
     *
     * @author Sergey Startsev
     */
    private function __construct()
    {
        $this->loadSchemas();
    }
    
    /**
     * Getting table name
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getTableName()
    {
        if (is_null($this->tableName)) {
            $model = $this->getModelName();
            if (!$model) throw new afStudioModelCommandModificatorException("Model not defined. Please set model name.");
            
            $schema = $this->getSchemaFile();
            
            $propel = $this->getPropelSchema();
            if (isset($propel[$this->getSchemaFile()]['classes'][$this->getModelName()])) {
                $this->tableName = $propel[$this->getSchemaFile()]['classes'][$this->getModelName()]['tableName'];
            } else {
                $this->tableName = sfInflector::tableize($model);
            }
        }
        
        return $this->tableName;
    }
    
    /**
     * Getting propel model
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getPropelModel()
    {
        if (is_null($this->propelModel)) {
            $model = $this->getModelName();
            
            $propel = $this->getPropelSchema();
            
            foreach ($propel as $schema => $array)
            {
                if(isset($array['classes']))
                {
                    foreach ($array['classes'] as $m => $parameters)
                    {
                        if($m == $model)
                        {
                            $this->propelModel = $parameters;
                            continue;        
                        }
                    }
                }
            }
        }
        
        return $this->propelModel;
    }
    
    /**
     * Getting model name
     *
     * @return void
     * @author Sergey Startsev
     */
    public function getModelName()
    {
        if (is_null($this->modelName)) {
            throw new afStudioModelCommandModificatorException("Model not defined. Please set model name.");
        }
        
        return $this->modelName;
    }
    
    /**
     * Getting schema file
     *
     * @return string
     * @author Sergey Startsev
     */
    public function getSchemaFile()
    {
        if (is_null($this->schemaFile)) {
            $this->schemaFile = afStudioUtil::getRootDir() . DIRECTORY_SEPARATOR .'config' . DIRECTORY_SEPARATOR . 'schema.yml';
        }
        
        return $this->schemaFile;
    }
    
    /**
     * Setting model name
     *
     * @param string $name 
     * @return afStudioModelCommandModificator
     * @author Sergey Startsev
     */
    public function setModelName($name)
    {
        $this->modelName = $name;
        
        return $this;
    }
    
    /**
     * Setting schema file
     *
     * @param string $file 
     * @return afStudioModelCommandModificator
     * @author Sergey Startsev
     */
    public function setSchemaFile($file)
    {
        $this->schemaFile = $file;
        
        return $this;
    }
    
    /**
     * Getting propel schema array
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getPropelSchema()
    {
        if (is_null($this->propelSchemaArray)) {
            $this->loadSchemas();
        }
        
        return $this->propelSchemaArray;
    }
    
    /**
     * Getting original schema array
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getOriginalSchema()
    {
        if (is_null($this->originalSchemaArray)) {
            $this->loadSchemas();
        }
        
        return $this->originalSchemaArray;
    }
    
    /**
     * Update current schema files
     *
     * @param array $schema 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function updateOriginalSchema(array $schemas)
    {
        $this->originalSchemaArray = $schemas;
        
        foreach ($schemas as $path => $schema) {
            $this->saveSchema($path);
        }
        afStudioModelCommandHelper::deploy();
        
        return  afResponseHelper::create()->success(true)->message('Schemas was successfully updated');
    }
    
    /**
     * Rename model functionality
     *
     * @param string $name 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function renameModel($name)
    {
        $response = afResponseHelper::create();

        $are_writable = $this->isModelWritable();
        if ($are_writable !== true) {
            return $are_writable;
        }

        if (!afStudioModelCommandHelper::isValidName($name)) {
            return $response->success(false)->message('Model name can only consist from alphabetical characters and begins from letter or "_"');
        }
        
        $this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()]['_attributes']['phpName'] = $name;
        
        $newTableName = sfInflector::tableize($name);
        
        $this->originalSchemaArray[$this->getSchemaFile()]['propel'][$newTableName] = $this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()];
        unset($this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()]);
        
        if ($this->saveSchema()) {
            afStudioConsole::getInstance()->execute('sf afs:fix-perms');
            list($status, $message) = afStudioModelCommandHelper::renameModel($this->getModelName(), $name);
            afStudioModelCommandHelper::removeModelFiles($this->getModelName());
            
            return $response
                        ->success(true)
                        ->message("Renamed model's phpName from <b>{$this->getModelName()}</b> to <b>{$name}</b><br><b style=\"color:red;\">Please make sure you'll update all the widgets that are using the old model name with the renamed model name, else you'll be facing some errors when trying to load those widgets!</b>!" .
                            ((!empty($message)) ? "<br/>" . nl2br($message) : '')
                        )
                        ->console(afStudioModelCommandHelper::deploy());
        }
        
        return $response->success(false)->message("Can't rename model's phpName from <b>{$this->getModelName()}</b> to <b>{$name}</b>!");
    }

    /**
     * Checking if model is readable
     *
     * @return true or afResponseHelper
     * @author Michal Piotrowski
     */
    public function isModelReadable()
    {
        $permissions = new Permissions();

        $are_readable = $permissions->areReadable(array(
            sfConfig::get('sf_config_dir').'/schema.yml',
            sfConfig::get('sf_lib_dir').'/filter',
            sfConfig::get('sf_lib_dir').'/filter/base',
            sfConfig::get('sf_lib_dir').'/form',
            sfConfig::get('sf_lib_dir').'/form/base',
            sfConfig::get('sf_lib_dir').'/model',
            sfConfig::get('sf_lib_dir').'/model/map',
            sfConfig::get('sf_lib_dir').'/model/migration',
            sfConfig::get('sf_lib_dir').'/model/om',
        ), true);

        return $are_readable;
    }

    /**
     * Checking if model is writable
     *
     * @return true or afResponseHelper
     * @author Michal Piotrowski
     */
    public function isModelWritable()
    {
        $permissions = new Permissions();

        $are_writable = $permissions->areWritable(array(
            sfConfig::get('sf_config_dir').'/schema.yml',
            sfConfig::get('sf_lib_dir').'/filter',
            sfConfig::get('sf_lib_dir').'/filter/base',
            sfConfig::get('sf_lib_dir').'/form',
            sfConfig::get('sf_lib_dir').'/form/base',
            sfConfig::get('sf_lib_dir').'/model',
            sfConfig::get('sf_lib_dir').'/model/map',
            sfConfig::get('sf_lib_dir').'/model/migration',
            sfConfig::get('sf_lib_dir').'/model/om',
        ), true);

        return $are_writable;
    }

    /**
     * Adding model
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function addModel($with_primary = false)
    {
        $response = afResponseHelper::create();

        $are_writable = $this->isModelWritable();
        if ($are_writable !== true) {
            return $are_writable;
        }

        if (!afStudioModelCommandHelper::isValidName($this->getModelName())) {
            return $response->success(false)->message('Model name can only consist from alphabetical characters and begins from letter or "_"');
        }
        
        if (!is_null($this->getSchemaByModel($this->getModelName()))) {
            return $response->success(false)->message("Model <b>{$this->getModelName()}</b> already exists");
        }
        
        $this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()]['_attributes']['phpName'] = $this->getModelName();
        
        if ($with_primary) $this->alterModel(array($this->getPrimaryDefinition()));
        
        if ($this->saveSchema()) {
            $console = afStudioConsole::getInstance();
            $consoleResult = afStudioModelCommandHelper::deploy();
            
            if ($console->wasLastCommandSuccessfull()) $consoleResult .= $console->execute('sf propel:build-forms');
            $last_command_status = $console->wasLastCommandSuccessfull();
            
            if ($last_command_status) {
                $message = "Added model <b>{$this->getModelName()}</b>!";
                afStudioConsole::getInstance()->execute('sf afs:fix-perms');
            } else {
                $message = 'Model was propery defined but build-model and/or build-form tasks returned some errors.';
            }
            
            return $response->success($last_command_status)->message($message)->console($consoleResult);
        }
        
        return $response->success(false)->message("Can't add model <b>{$this->getModelName()}</b>! Please check schema file permissions.");
    }
    
    /**
     * Delete model
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function deleteModel()
    {
        $response = afResponseHelper::create();

        $are_writable = $this->isModelWritable();
        if ($are_writable !== true) {
            return $are_writable;
        }

        if (!isset($this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()])) {
            return $response->success(false)->message("Model '{$this->getModelName()}' already deleted");
        }
        
        unset($this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()]);
        
        if ($this->saveSchema()) {
            afStudioModelCommandHelper::removeModelFiles($this->getModelName());
            
            return $response->success(true)->message('Deleted model <b>'.$this->getModelName().'</b>!')->console(afStudioModelCommandHelper::deploy());
        } 
        
        return $response->success(false)->message("Can't delete model <b>{$this->getModelName()}</b>!");
    }
    
    /**
     * Getting models list
     *
     * @return array
     * @author Sergey Startsev
     */
    public function getList()
    {
        if (count($this->propelSchemaArray) == 0) return $response->success(true);
        
        $models = array();
        foreach ($this->propelSchemaArray as $schemaFile => $array) {
            if (empty($array)) continue;
            foreach ($array['classes'] as $phpName => $attributes) {
                $models[] = array(
                    'text' => $phpName,
                    'leaf' => true,
                    'schema' => $schemaFile, 
                    'iconCls' => 'icon-model'
                );
            }
        }
        
        return $models;
    }
    
    /**
     * Read Models fields(columns)
     * 
     * @param array $propelModel the model definition
     * @return array - of model's fields 
     */
    public function readModelFields() 
    {
        $response = afResponseHelper::create();

        $are_readable = $this->isModelReadable();
        if ($are_readable !== true) {
            echo $are_readable;
            die;
        }

        $propelModel = $this->getPropelModel();
        
        $fields = array();

        if ((is_array($propelModel)) and (array_key_exists('columns', $propelModel))) {
            $columns = (array) $propelModel['columns'];
            $has_primary = $this->hasPrimary($columns);

            $k = 0;

            $peer_method = constant($this->getModelName() . '::PEER');
            $field_names = call_user_func("{$peer_method}::getFieldNames", BasePeer::TYPE_FIELDNAME);
            
            foreach ($field_names as $field) {
                if (array_key_exists($field, $columns)) {
                    $column = $columns[$field];
                    $fields[$k]['id'] = $k;
                    $fields[$k]['name'] = $field;

                    if (is_array($column)) {
                        foreach ($column as $property => $value) {
                            switch ($property) {
                                case 'type':
                                    $value = strtolower($value);
                                    break;

                                case 'foreignTable':
                                    $fields[$k]['foreignModel'] = $this->getModelByTableName($value);
                                    break;
                            }
                            $fields[$k][$property] = $value;
                        }
                    } else if (isset($column)) {
                        $fields[$k]['type'] = $column;
                    }
                } elseif ($field == 'id') {
                    $fields[$k] = array(
                        'id'        => $k,
                        'name'      => 'id',
                        'type'      => 'integer',
                        'required'  => true,
                        'key'       => 'primary',
                        'size'      => 11,
                        'autoIncrement' => true,
                    );
                }

                $k++;
            }
        }

        return $fields;
    }
    
    /**
     * Validates Field uniqueness inside the Model
     * 
     * @param string $name
     * @return boolean
     */
    public function isFieldNameUnique($name) 
    {
        return !array_key_exists($name, $this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()]);
    }
    
    /**
     * Verifies field name
     * 
     * @param string $fieldName
     * @return afResponse
     */
    public function modelFieldVerification($field) 
    {
        $fieldName = $field->name;
        $response = afResponseHelper::create();
        
        if (!afStudioModelCommandHelper::isValidName($fieldName)) {
            return $response
                        ->success(false)
                        ->message("Field name '{$fieldName}' is not valid. Field name must contains only characters, digits or '_' and starts from '_' or character");
        }
        
        if (!$this->isFieldNameUnique($fieldName)) return $response->success(false)->message("Field name '{$fieldName}' is duplicated");
        
        if (!empty($field->relation) || (!empty($field->foreignTable))) {
            $foreign_table = (!empty($field->relation)) ? current(explode('.', $field->relation)) : $field->foreignTable;
            $foreign_model = $this->getTableNameByModel($foreign_table);
            
            if (strtolower($field->name) == strtolower($foreign_model)) {
                return $response->success(false)->message("Field name shouldn't be same with model from foreign table. Please choose another name.");
            }
        }
        
        return $response->success(true);
    }
    
    /**
     * Returns Model name by its table name
     * 
     * @param string $table
     * @return string - model name if table was found otherwise null 
     */
    public function getModelByTableName($table) 
    {
        foreach ($this->propelSchemaArray as $schema) {
            if (isset($schema['classes'])) {
                foreach ($schema['classes'] as $modelName => $model) {
                    if ($model['tableName'] == $table) return $modelName;
                }	
            }
        }
        
        return null;
    }
    
    /**
     * Creates Relation modelName.modelField value
     * based on "query" parameter
     * 
     * @return array - the relation
     */
    public function buildRelationComboModels($query)
    {
        $models = array();
        
        if (count($this->propelSchemaArray) > 0) {
            $relation = explode('.', trim($query));
            
            if (count($relation) > 1) {
                $modelName  = $relation[0];
                $modelField = $relation[1];
                
                if (!empty($modelName)) {
                    $schema = $this->getSchemaByModel($modelName);
                    if (!empty($schema)) {
                        $propelModel = $this->propelSchemaArray[$schema]['classes'][$modelName];
                        
                        foreach ($propelModel['columns'] as $name => $params) {
                            if (empty($modelField) || stripos($name, $modelField) === 0) {
                                $models[] = array('id' => "{$modelName}.{$name}", 'value' => "{$modelName}.{$name}");
                            }
                        }
                    }
                } else {
                    $m = $this->getModelsByMask($modelName);
                    for ($i = 0, $len = count($m); $i < $len; $i++) {
                        $models[] = array('id' => $m[$i], 'value' => $m[$i]);
                    }
                }
            } else {
                $modelName = $relation[0];
                $m = $this->getModelsByMask($modelName);
                for ($i = 0, $len = count($m); $i < $len; $i++) {
                    $models[] = array('id' => $m[$i], 'value' => $m[$i]);
                }
            }
        }
        
        return $models;
    }
    
    /**
     * Creates field definition from json decoded object
     * 
     * @param stdClass $f json decoded field definition
     * @return array field's definition 
     */
    public function buildFieldDefinition($f) 
    {
        $definition = array();
        
        if (!empty($f->type)) $definition['type'] = $f->type;
        if (!empty($f->default)) $definition['default'] = $f->default;
        if (!empty($f->autoIncrement)) $definition['autoIncrement'] = $f->autoIncrement;
        
        if (!empty($f->key)) {
            switch ($f->key) {
                case 'primary':
                    $definition['primaryKey'] = true;
                    break;
                    
                case 'unique':
                    $definition['index'] = 'unique';
                    break;
                    
                case 'index':
                    $definition['index'] = true;
                    break;
            }
        }
        
        if (!empty($f->required)) $definition['required'] = $f->required;
        
        if (!empty($f->relation)) {
            $ref = explode('.', $f->relation);
            $definition['foreignTable'] = $this->getTableNameByModel($ref[0]);
            $definition['foreignReference'] = $ref[1];
        } elseif (!empty($f->foreignTable) && !empty($f->foreignReference)) {
            $definition['foreignTable'] = $f->foreignTable;
            $definition['foreignReference'] = $f->foreignReference;
        }
        
        if (!empty($f->size)) $definition['size'] = intval($f->size);
        if (!empty($f->onDelete)) $definition['onDelete'] = $f->onDelete;
        
        if (!empty($f->primaryString)) $definition['primaryString'] = $f->primaryString;
        
        return $definition;
    }
    
    /**
     * Alters Model structure 
     * 
     * @param array $fields - the new models fields
     * @return afResponse
     */
    public function alterModel(Array $fields)
    {
        $response = afResponseHelper::create();
        
        //remove previous table structure 
        foreach ($this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()] as $k => $v) {
            if ($k != '_attributes') unset($this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()][$k]);
        }
        
        //build new structure
        foreach ($fields as $f) {
            $response = $this->modelFieldVerification($f);
            if (!$response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) return $response;
            
            $definition = $this->buildFieldDefinition($f);
            $this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()][$f->name] = $definition;
        }
        
        $this->saveSchema();
        afStudioModelCommandHelper::deploy();
        
        
        afStudioConsole::getInstance()->execute(array(
            'sf propel:build-forms',
            'sf afs:fix-perms',
        ));
        
        return $response->success(true);
    }
    
    /**
     * Change model field
     *
     * @param stdClass $fieldData 
     * @param string $field 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function changeModelField($fieldData, $field = null)
    {
        $response = afResponseHelper::create();
        
        $fieldDefinition = $this->buildFieldDefinition($fieldData);
        
        if (!is_null($field)) {
            if ($field != $fieldData->name) {
                $response = $this->modelFieldVerification($fieldData);
                if (!$response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) return $response;
            }
            
            $this->arraySetKeyValue($this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()], $field, $fieldData->name, $fieldDefinition);
        } else {
            $response = $this->modelFieldVerification($fieldData);
            if (!$response->getParameter(afResponseSuccessDecorator::IDENTIFICATOR)) return $response;
            
            $this->originalSchemaArray[$this->getSchemaFile()]['propel'][$this->getTableName()][$fieldData->name] = $fieldDefinition;
        }
        
        $this->saveSchema();
        afStudioModelCommandHelper::deploy();
        
        return $response->success(true);
    }
    
    /**
     * Utility function.
     * Sets specified array key's value and changes its name if $newKey was specified.
     * 
     * @param array $array the array to set key
     * @param string $key to set up
     * @param string $newKey the new key name 
     * @param mixed $value the key's value to be set
     */
    public function arraySetKeyValue(Array &$array, $key, $newKey, $value) 
    {
        $initial = array();
        foreach ($array as $k => $v) {
            if ($k != $key && ($initial[$k] = $v)) continue;
            
            empty($newKey) ? $initial[$key] = $value : $initial[$newKey] = $value;
        }
        
        $array = $initial;
    }
    
    /**
     * Returns table name by the model
     * 
     * @param string $model
     * @return string - table name if model was found otherwise null
     */
    public function getTableNameByModel($model) 
    {
        foreach ($this->propelSchemaArray as $schema) {
            foreach ($schema['classes'] as $modelName => $m) {
                if ($modelName == $model) return $m['tableName'];
            }
        }
        
        return null;
    }
    
    /**
     * Returns array of models narrowed by mask.
     * Example: there are models "Users", "Units", "Group" and mask "u" returns two models 
     * "Users" and "Units". Case insensitive.
     * If mask is an empty string all Models are returned. 
     * 
     * @param string $mask
     * @return array of models
     */
    public function getModelsByMask($mask) 
    {
        $models = array();
        foreach ($this->propelSchemaArray as $schemaFile => $array) {
            foreach ($array['classes'] as $model => $attributes) {
                if (empty($mask) || stripos($model, $mask) === 0) $models[] = $model;
            }
        }
        
        return $models;
    }
    
    /**
     * Returns path to schema of specified model
     * 
     * @param string $model
     * @return string - schema path if exists
     */
    public function getSchemaByModel($model) 
    {
        foreach ($this->propelSchemaArray as $schemaFile => $array) {
            if (empty($array)) continue;
            foreach ($array['classes'] as $phpName => $attributes) {
                if ($model == $phpName) return $schemaFile;
            }
        }
        
        return null;
    }
    
    /**
     * Getting model definition 
     *
     * @param string $model 
     * @param string $connection 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function getModelDefinition($model, $connection = 'propel')
    {
        $schema_file = $this->getSchemaByModel($model);
        $table_name = $this->getTableNameByModel($model);
        
        if (!$schema_file) return afResponseHelper::create()->success(false)->message("Model not found");
        if (!$table_name) return afResponseHelper::create()->success(false)->message("Table name not found by model");
        
        
        $definition = $this->originalSchemaArray[$schema_file][$connection][$table_name];
        
        return afResponseHelper::create()->success(true)->data(array(), sfYaml::dump($definition), 0);
    }
    
    /**
     * Setting model definition 
     *
     * @param array $definition 
     * @param string $connection 
     * @return afResponse
     * @author Sergey Startsev
     */
    public function setModelDefinition($model_name, $definition, $connection = 'propel')
    {
        $response = afResponseHelper::create();
        
        if (!is_array($definition)) return $response->success(false)->message('Definition contains wrong structure');
        
        $schema_file = $this->getSchemaFile();
        $table_name = $this->getTableNameByModel($model_name);
        
        $definition_model_name = (array_key_exists('_attributes', $definition) && array_key_exists('phpName', $definition['_attributes']))
            ? $definition['_attributes']['phpName']
            : $model_name;
        
        if (!array_key_exists($model_name, $this->propelSchemaArray[$schema_file]['classes'])) {
            return $response->success(false)->message("Model '{$model_name}' doesn't exists");
        }
        if (!array_key_exists($table_name, $this->originalSchemaArray[$schema_file][$connection])) {
            return $response->success(false)->message("Table '{$table_name}' doesn't exists");
        }
        if (($test_table_name = $this->getTableNameByModel($definition_model_name)) && $test_table_name != $table_name) {
            return $response->success(false)->message("Model '{$definition_model_name}' from definition already exists in schema and not belongs current table");
        }
        
        $this->originalSchemaArray[$schema_file][$connection][$table_name] = $definition;
        
        $this->saveSchema();
        afStudioModelCommandHelper::deploy();
        
        afStudioConsole::getInstance()->execute('sf afs:fix-perms');
        
        return $response->success(true);
    }
    
    /**
     * Validate current schema
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    public function validateSchema()
    {
        $errors = array();
        foreach ($this->originalSchemaArray as $schema_file => $connections) {
            foreach ($connections as $connection_name => $tables) {
                foreach ($tables as $table_name => $fields) {
                    $table_error_prefix = "in schema file {$schema_file}, in connection '{$connection_name}', ";
                    
                    // check table/model name
                    if (array_key_exists('_attributes', $fields) && array_key_exists('phpName', $fields['_attributes'])) {
                        if (in_array(strtolower($fields['_attributes']['phpName']), $this->deprecated_table_names)) {
                            $errors[] = $table_error_prefix . "model name '{$fields['_attributes']['phpName']}' deprecated";
                        }
                    } elseif (in_array(strtolower($table_name), $this->deprecated_table_names)) {
                        $errors[] = $table_error_prefix . "table name '{$table_name}' deprecated";
                    }
                    
                    // check table indexes
                    if (array_key_exists('_indexes', $fields)) {
                        foreach ($fields['_indexes'] as $key_name => $keys) {
                            if (in_array($key_name, $this->deprecated_indexes_names)) {
                                $errors[] = $table_error_prefix . "in table name '{$table_name}', index name '{$key_name}' deprecated";
                            }
                        }
                    }
                    
                    // check deprecated fields
                    foreach ($fields as $field_name => $field_definition) {
                        if (in_array($field_name, $this->deprecated_field_names)) {
                            $errors[] = $table_error_prefix . "in table '{$table_name}', field '{$field_name}' deprecated";
                        }
                    }
                }
            }
        }
        
        if (!empty($errors)) return afResponseHelper::create()->success(false)->message($errors);
        
        return afResponseHelper::create()->success(true);
    }
    
    /**
     * Load schemas 
     *
     * @return void
     * @author Sergey Startsev
     */
    private function loadSchemas()
    {
        $this->dbSchema = new sfPropelDatabaseSchema();
        $this->configuration = new ProjectConfiguration(null, new sfEventDispatcher());
        
        $dirs = array_merge(array(sfConfig::get('sf_config_dir')), $this->configuration->getPluginSubPaths('/config'));
        
        $deprecated_plugins = afStudioPluginCommandHelper::getDeprecatedList();
        foreach ($dirs as $k => $dir) {
            if (in_array(pathinfo(dirname($dir), PATHINFO_FILENAME), $deprecated_plugins)) unset($dirs[$k]);
        }
        
        $dirs = array_values($dirs);
        
        $schemas = sfFinder::type('file')->name('*schema.yml')->prune('doctrine')->maxdepth(1)->in($dirs);
        
        foreach ($schemas as $schema_path) {
            $schema = (DIRECTORY_SEPARATOR != '/') ? str_replace('/', DIRECTORY_SEPARATOR, $schema_path) : $schema_path;
            $this->originalSchemaArray[$schema] = sfYaml::load($schema);
            
            if (!is_array($this->originalSchemaArray[$schema])) continue;
            
            if (!isset($this->originalSchemaArray[$schema]['classes'])) {
                // Old schema syntax: we convert it
                $this->propelSchemaArray[$schema] = $this->dbSchema->convertOldToNewYaml($this->originalSchemaArray[$schema]);
            }
            
            $customSchemaFilename = str_replace(array(
                str_replace(DIRECTORY_SEPARATOR, '/', sfConfig::get('sf_root_dir')).'/',
                'plugins/',
                'config/',
                '/',
                'schema.yml'
            ), array('', '', '', '_', 'schema.custom.yml'), $schema);
            $customSchemas = sfFinder::type('file')->name($customSchemaFilename)->in($dirs);
            
            foreach ($customSchemas as $customSchema) {
                $this->originalSchemaArray[$customSchema] = sfYaml::load($customSchema);
                if (!isset($this->originalSchemaArray[$customSchema]['classes'])) {
                    // Old schema syntax: we convert it
                    $this->propelSchemaArray[$customSchema] = $this->dbSchema->convertOldToNewYaml($this->originalSchemaArray[$customSchema]);
                }
            }
        }
    }
    
    /**
     * Saving schema
     * 
     * @param string $schema 
     * @return boolean
     */
    private function saveSchema($schema = '')
    {
        if (empty($schema)) $schema = $this->getSchemaFile();
        if (!array_key_exists($schema, $this->originalSchemaArray)) return false;
        
        return afStudioUtil::writeFile($schema, sfYaml::dump($this->originalSchemaArray[$schema], 3));
    }
    
    /**
     * Define default primary key field
     *
     * @return stdClass
     * @author Sergey Startsev
     */
    private function getPrimaryDefinition()
    {
        $field = new stdClass;
        $field->name = 'id';
        $field->type = 'integer';
        $field->required = true;
        $field->key = 'primary';
        $field->size = 11;
        $field->autoIncrement = true;
        $field->primaryString = true;
        
        return $field;
    }
    
    /**
     * Check has primary or not
     *
     * @param Array $columns 
     * @return boolean
     * @author Sergey Startsev
     */
    private function hasPrimary(Array $columns)
    {
        foreach ($columns as $name => $column) {
            if (is_array($column)) {
                foreach ($column as $property => $value) {
                    if ($property == 'primaryKey' && $value) return true;
                }
            }
        }
        
        if (array_key_exists('id', $columns)) return true;
        
        return false;
    }
    
}
