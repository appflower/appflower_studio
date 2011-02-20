<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<?php include_http_metas() ?>
<?php include_metas() ?>
<?php include_title() ?>
</head>

<body style="background-image: url(/appFlowerStudioPlugin/images/bg/backgrond_3.2.2.jpg);background-position: 50% 50%;background-repeat: no-repeat;">
    <!-- Page Frame -->
<?php
$layout=new ImmExtjsSfGuardLayout();

/**
 * EXTJS REQUEST PASSWORD FORM
 */

$form=new ImmExtjsForm(array('action' => url_for('/afsAuthorize/passwordRequest')/*,'fileUpload'=>true*/));

$fieldset=$form->startFieldset(array('legend' => 'Receive your login details by email'));
$columns = $fieldset->startColumns(array("columnWidth" => 1));
$col = $columns->startColumn(array("columnWidth" => 1));

$username=new ImmExtjsFieldInput($col,array('name' => 'email', 'label' => 'Email', 'value' => $sf_params->get('email'), 'help' => "Enter your email", 'comment' => 'write your email', 'width' => '150'));

$columns->endColumn($col);
$fieldset->endColumns($columns);
$form->endFieldset($fieldset);

new ImmExtjsSubmitButton($form,array('action'=>url_for('/afsAuthorize/passwordRequest')));
new ImmExtjsLinkButton($form,array('url'=>url_for('/afsAuthorize/index'), 'label' => 'Go to Login', 'load' => 'page'));

$form->end();

$layout->addItem('center',$form);

$tools=new ImmExtjsTools();
//$tools->addItem(array('id'=>'gear','handler'=>array('source'=>"Ext.Msg.alert('Message', 'The Settings tool was clicked.');")));
//$tools->addItem(array('id'=>'close','handler'=>array('parameters'=>'e,target,panel','source'=>"panel.ownerCt.remove(panel, true);")));

$layout->addCenterComponent($tools,array('title' => 'Request Password'));

$layout->end();

?>
</body>
</html>
