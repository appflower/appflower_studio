<?php
$toolbar = new afExtjsToolbar();

$dashboard = new afExtjsToolbarButton($toolbar,array('label'=>'<img src="/images/famfamfam/house_go.png" border="0">','url'=>'/pages/dashboard','tooltip'=>array('text'=>'Your overview', 'title'=>'Project Dashboard')));$dashboard->end();

/**
 * Fill
 */
new afExtjsToolbarFill($toolbar);

$logout_button = new afExtjsToolbarButton($toolbar,array('label'=>'<img src="/images/famfamfam/user_go.png" border="0">','url'=>'/logout','tooltip'=>array('text'=>'Click to log out', 'title'=>sfContext::getInstance()->getUser()->getUsername())));$logout_button->end();

$toolbar->end();
?>
