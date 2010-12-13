<?php



/**
 * Skeleton subclass for performing query and update operations on the 'afs_notification' table.
 *
 * 
 *
 * You should add additional methods to this class to meet the
 * application requirements.  This class will only be generated as
 * long as it does not already exist in the output directory.
 *
 * @package    propel.generator.plugins.appFlowerStudioPlugin.lib.model
 */
class afsNotificationPeer extends BaseafsNotificationPeer {
	
	public static function log($message, $messageType = 'notification', $afGuardUser=false)
	{
		$afsNotification = new afsNotification();
		$afsNotification->setMessage($message);
		$afsNotification->setMessageType($messageType);
		$afsNotification->setUserId(($afGuardUser?$afGuardUser->getId():sfContext::getInstance()->getUser()->getGuardUser()->getId()));
		$afsNotification->setIp(myToolkit::getIP());
		$afsNotification->save();
	}
} // afsNotificationPeer
