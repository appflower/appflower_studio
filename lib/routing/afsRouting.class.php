<?php
/**
 * This class will register Studio routes
 * Studio will be accessible by http://some.project.com/studio
 */
class afsRouting
{
  static public function listenToRoutingLoadConfigurationEvent(sfEvent $event)
  {
    $r = $event->getSubject();

    $r->prependRoute('studio_homepage', new sfRoute('/studio', array('module' => 'appFlowerStudio', 'action' => 'studio')));
    $r->prependRoute('studio_homepage2', new sfRoute('/studio/', array('module' => 'appFlowerStudio', 'action' => 'studio')));
  }

}
