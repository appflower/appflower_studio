<?php
/**
 * This abstract class is used by AF Studio when new edit widget is created
 *
 * It guesses propel model object name and its coresponding form class from peer class
 * defined in widget xml datasource element
 *
 * It also dynamically reconfigures given model form object to use only fields
 * defined in widget xml config file
 * Validators are also replaced by sfValidatorPass
 * Basically I'm using form classes just to ease up filling propel objects with values from user
 *
 * @author Łukasz Wojciechowski <luwo@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
abstract class simpleWidgetEditAction extends sfAction
{
    /**
     * @var BaseObject
     */
    protected $object;
    
    /**
     * Widget uri
     *
     * @var string
     */
    protected $widgetUri;
    
    /**
     * @var BaseFormPropel
     */
    protected $form;
    
    /**
     * DOMDocument instance
     *
     * @var DOMDocument
     */
    protected $dom_xml;
    
    /**
     * DOMXPath instance 
     *
     * @var DOMXPath
     */
    protected $dom_xml_xpath;
    
    /**
     * Pre-execute action - before every action
     *
     * @author Sergey Startsev
     */
    public function preExecute()
    {
        $module_path = $this->getContext()->getModuleDirectory();
        $module_name = $this->getModuleName();
        $action_name = $this->getActionName();
        
        // init widget uri
        $this->widgetUri = "{$module_name}/{$action_name}";
        
        // getting xml file path
        $xmlCU = new afConfigUtils($module_name);
        $xml_path = $xmlCU->getConfigFilePath($action_name.'.xml', true);
        
        // initialize dom document
        $this->dom_xml = new DOMDocument();
        $this->dom_xml->preserveWhiteSpace = false;
        $this->dom_xml->formatOutput = true;
        $this->dom_xml->load($xml_path);
        
        $this->dom_xml_xpath = new DOMXPath($this->dom_xml);
        
        // getting datasource class
        $peerClassName = $this->getDatasource();
        
        if (!empty($peerClassName) && class_exists($peerClassName)) {
            $modelClassName = constant("$peerClassName::OM_CLASS");
            $formClassName = "{$modelClassName}Form";
            
            $this->tryToLoadObjectFromRequest($peerClassName);
            
            if (!$this->object) {
                $this->createNewObject($modelClassName);
            }
            
            $this->createAndConfigureForm($formClassName);
        }
    }
    
    /**
     * Execute method reload
     *
     * @param string $request 
     * @return array
     * @author Łukasz Wojciechowski
     */
    public function execute($request)
    {
        if ($request->isMethod('post')) {
            if ($this->processPostData()) {
                $result = array(
                    'success' => true,
                    'message' => "Saved with success!",
                    'redirect' => $this->widgetUri . '?id=' . $this->object->getId()
                );
                
                return $result;
            }
        }
    }
    
    /**
     * Create and configure forn
     *
     * @param string $formClassName 
     * @author Łukasz Wojciechowski
     */
    private function createAndConfigureForm($formClassName)
    {
        $this->form = new $formClassName($this->object);
        $vs = $this->form->getValidatorSchema();
        foreach ($vs->getFields() as $fieldName => $validator) {
            $this->form->setValidator($fieldName, new sfValidatorPass());
        }
        
        if (isset($this->form['id'])) {
            unset($this->form['id']);
        }
        
        $fieldNames = $this->getFieldNames();
        $this->form->useFields($fieldNames);
        
        // making form field default values available for widget XML config file placeholders
        foreach ($fieldNames as $fieldName) {
            $this->$fieldName = $this->object->getByName($fieldName, BasePeer::TYPE_FIELDNAME);
        }
    }
    
    /**
     * Creating new object
     *
     * @param string $modelClassName 
     * @author Łukasz Wojciechowski
     */
    private function createNewObject($modelClassName)
    {
        $this->object = new $modelClassName;
        $this->id = '';
    }
    
    /**
     * Try to load object from request
     *
     * @param string $peerClassName 
     * @author Łukasz Wojciechowski
     */
    private function tryToLoadObjectFromRequest($peerClassName)
    {
        if ($this->getRequest()->hasParameter('id')) {
            $objectId = $this->getRequest()->getParameter('id');
            if ($objectId > 0) {
                $this->object = call_user_func("$peerClassName::retrieveByPK", $objectId);
                $this->id = $this->object->getPrimaryKey();
            }
        }
    }
    
    /**
     * Process post data
     *
     * @return boolean
     * @author Łukasz Wojciechowski
     */
    private function processPostData()
    {
        $formData = $this->getRequest()->getParameter('edit');
        $formData = $formData[0];
        
        $formData = $this->changeKeysForForeignFields($formData);
        
        $this->form->bind($formData);
        return $this->form->save();
    }
    
    /**
     * Quick and dirty solution for one problem
     * Combo widgets generated by AF are posting input field named like "{$i:fieldName}_value"
     * Since we are basing functionality of this action on autogenerated forms we got extra form fields and validation process breaks
     * This method assumes that every key that ends with "_value" is a value for foreign column coming from combo field
     * Each of those keys are changes by removing "_value" suffix
     * 
     * @return array
     * @author Łukasz Wojciechowski
     */
    private function changeKeysForForeignFields($formData)
    {
        $baseKeys = array();
        foreach ($formData as $key => $value) {
            if (substr($key, -6) != '_value') {
                continue;
            }
            
            $baseKey = str_replace('_value', '', $key);
            $baseKeys[] = $baseKey;
        }
        
        foreach ($baseKeys as $baseKey) {
            $valueForBaseKey = $formData["${baseKey}_value"];
            unset($formData["${baseKey}_value"]);
            $formData[$baseKey] = $valueForBaseKey;
        }
        
        return $formData;
    }
    
    /**
     * Getting Datasource classname
     *
     * @return string
     * @author Sergey Startsev
     */
    protected function getDatasource()
    {
        $class = $this->dom_xml_xpath->query('//i:datasource/i:class')->item(0);
        if ($class) {
            return $class->nodeValue;
        }
        
        return null;
    }
    
    /**
     * Getting defined fields names
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function getFieldNames()
    {
        $fields = array();
        
        $fields_nodes = $this->dom_xml_xpath->query('//i:fields/i:field');
        foreach ($fields_nodes as $field) {
            if ($field->getAttribute('type') == 'include') continue;
            $fields[] = $field->getAttribute('name');
        }
        
        return $fields;
    }
    
}
