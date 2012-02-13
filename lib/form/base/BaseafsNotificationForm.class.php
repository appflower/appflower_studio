<?php

/**
 * afsNotification form base class.
 *
 * @method afsNotification getObject() Returns the current form's model object
 *
 * @package    ##PROJECT_NAME##
 * @subpackage form
 * @author     ##AUTHOR_NAME##
 */
abstract class BaseafsNotificationForm extends BaseFormPropel
{
  public function setup()
  {
    $this->setWidgets(array(
      'message'      => new sfWidgetFormInputText(),
      'message_type' => new sfWidgetFormInputText(),
      'user'         => new sfWidgetFormInputText(),
      'ip'           => new sfWidgetFormInputText(),
      'created_at'   => new sfWidgetFormDateTime(),
      'id'           => new sfWidgetFormInputHidden(),
    ));

    $this->setValidators(array(
      'message'      => new sfValidatorString(array('max_length' => 255)),
      'message_type' => new sfValidatorString(array('max_length' => 255)),
      'user'         => new sfValidatorString(array('max_length' => 128)),
      'ip'           => new sfValidatorString(array('max_length' => 255)),
      'created_at'   => new sfValidatorDateTime(array('required' => false)),
      'id'           => new sfValidatorChoice(array('choices' => array($this->getObject()->getId()), 'empty_value' => $this->getObject()->getId(), 'required' => false)),
    ));

    $this->widgetSchema->setNameFormat('afs_notification[%s]');

    $this->errorSchema = new sfValidatorErrorSchema($this->validatorSchema);

    parent::setup();
  }

  public function getModelName()
  {
    return 'afsNotification';
  }


}
