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
	
	/**
	 * Log the notification messages in db
	 *
	 * @param string $message
	 * @param string $messageType
	 * @param $user: 0=Guest || 1-n=afGuardUser with id 1-n || instanceof afGuardUser class, 0 is default
	 * @author radu
	 */
	public static function log($message, $messageType = 'notification', $user=0)
	{
	    if (afStudioUser::getInstance()->isAuthenticated()) {
            $user = afStudioUser::getInstance()->getUsername();
		} else {
		    // Seems like method called not from studio, or user not authenticated
		    $user = 'not-authenticated';
		}
		
		$afsNotification = new afsNotification();
		$afsNotification->setMessage($message);
		$afsNotification->setMessageType($messageType);
		$afsNotification->setUser($user);
		$afsNotification->setIp(afsToolkit::getIP());
		$afsNotification->save();
	}
	
	public static function getAll($offset=0)
	{
		$c=new Criteria();
		$c->addAscendingOrderByColumn(self::CREATED_AT);
		$c->setOffset($offset);
		$objs = self::doSelect($c);
		if(count($objs)>0)
		{
			return $objs;
		}
		else {
			return false;
		}
	}
} // afsNotificationPeer
