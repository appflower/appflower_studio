<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
<?php include_http_metas() ?>
<?php include_metas() ?>
<?php include_title() ?>
</head>

<body style="background-image: url(/appFlowerStudioPlugin/images/bg/backgrond_3.2.2.jpg);background-position: 50% 50%;background-repeat: no-repeat;">
    <!-- Page Frame -->
    
    <script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.js"></script> 
    <script type="text/javascript" src="/appFlowerStudioPlugin/js/components/users/afStudio.UserWindow.js"></script>
    
<?php
$layout = new afExtjsSfGuardLayout();


/**
 * EXTJS SIGN IN FORM
 */

$form = new afExtjsForm(array('action' => '/afsAuthorize/signin', "columnWidth" => ".88"));

$fieldset=$form->startFieldset(array('legend' => 'Login', 'collapsible' => 'false'));
$columns = $fieldset->startColumns(array("columnWidth" => 1));
$col = $columns->startColumn(array("columnWidth" => 1));

$username = new afExtjsFieldInput($col,array('name' => 'signin[username]','label' => 'Username', 'value' => '', 'help' => "Enter the username", 'emptyText' => 'write your username', 'width' => '150'));

$password = new afExtjsFieldInput($col,array('name' => 'signin[password]', 'label' => 'Password', 'value' => '', 'help' => "Enter the password", 'emptyText' => 'write your password', 'width' => '150', 'PasswordFocus' => 'true'));

$captchaEnabled = in_array( 'sfCaptchaPlugin', sfProjectConfiguration::getActive()->getPlugins());

$remember = new afExtjsFieldCheckbox($col, array('name' => 'signin[remember]', 'label' => 'Remember', 'checked' => true));

$columns->endColumn($col);
$fieldset->endColumns($columns);
$form->endFieldset($fieldset);

new afExtjsSubmitButton($form,array('action' => '/afsAuthorize/signin'));
new afExtjsLinkButton($form,array('url' => url_for('/afsAuthorize/passwordRequest'), 'load' => 'page', 'label' => 'Forgot your password?', 'icon' => '/appFlowerStudioPlugin/images/email_go.png'));

$form->end();

$layout->addItem('center',
    array(
        "columnWidth" => ".12",
        "frame" => false,
        "height" => 167,
        "html" => "<a href='http://www.appflower.com'><img src='/appFlowerPlugin/images/vertical_logo.png'></a>"
    )
);
$layout->addItem('center', $form);

$tools = new afExtjsTools();

$layout->addCenterComponent($tools, array('title' => 'STUDIO: LOG IN'));

$layout->end();

?>
</body>
</html>
