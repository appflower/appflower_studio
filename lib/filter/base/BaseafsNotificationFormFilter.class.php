<?php

/**
 * afsNotification filter form base class.
 *
 * @package    ##PROJECT_NAME##
 * @subpackage filter
 * @author     ##AUTHOR_NAME##
 */
abstract class BaseafsNotificationFormFilter extends BaseFormFilterPropel
{
  public function setup()
  {
    $this->setWidgets(array(
      'message'      => new sfWidgetFormFilterInput(array('with_empty' => false)),
      'message_type' => new sfWidgetFormFilterInput(array('with_empty' => false)),
      'user'         => new sfWidgetFormFilterInput(array('with_empty' => false)),
      'ip'           => new sfWidgetFormFilterInput(array('with_empty' => false)),
      'created_at'   => new sfWidgetFormFilterDate(array('from_date' => new sfWidgetFormDate(), 'to_date' => new sfWidgetFormDate())),
    ));

    $this->setValidators(array(
      'message'      => new sfValidatorPass(array('required' => false)),
      'message_type' => new sfValidatorPass(array('required' => false)),
      'user'         => new sfValidatorPass(array('required' => false)),
      'ip'           => new sfValidatorPass(array('required' => false)),
      'created_at'   => new sfValidatorDateRange(array('required' => false, 'from_date' => new sfValidatorDate(array('required' => false)), 'to_date' => new sfValidatorDate(array('required' => false)))),
    ));

    $this->widgetSchema->setNameFormat('afs_notification_filters[%s]');

    $this->errorSchema = new sfValidatorErrorSchema($this->validatorSchema);

    parent::setup();
  }

  public function getModelName()
  {
    return 'afsNotification';
  }

  public function getFields()
  {
    return array(
      'message'      => 'Text',
      'message_type' => 'Text',
      'user'         => 'Text',
      'ip'           => 'Text',
      'created_at'   => 'Date',
      'id'           => 'Number',
    );
  }
}
