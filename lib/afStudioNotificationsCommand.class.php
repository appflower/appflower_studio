<?php
/**
 * afStudioNotifications south panel Command
 *
 */
class afStudioNotificationsCommand
{
	public $request=null,$result=null,$realRoot=null;
							
	public function __construct()
	{		
		$this->request=sfContext::getInstance()->getRequest();		
		
		$this->realRoot=afStudioUtil::getRootDir();
		
		$this->afConsole=new afStudioConsole();
		
		$this->filesystem = new sfFileSystem();
		
		$this->start();
	}
	
	public function start()
	{
		$cmd = $this->request->getParameterHolder()->has('cmd')?$this->request->getParameterHolder()->get('cmd'):null;
			
		switch ($cmd)
		{
			case "set":
				$message = $this->request->getParameter('message');
				$messageType = $this->request->getParameter('messageType');
				$messageType = $messageType!='false'?$messageType:'notification';
				afsNotificationPeer::log($message, $messageType);
				$this->result = array('success' => true,'message' => 'Saved notification!');
				break;
			case "get":
			case null:
			default:
				$notifications = afsNotificationPeer::getAll();
				$data = array();
				if($notifications)
				{
					foreach ($notifications as $notification)
					{
						switch ($notification->getUser())
						{
							case 0:
								$user = 'Guest';
								break;
							default:
								$user = afGuardUserPeer::retrieveByPK($notification->getUser());
								$user = $user->getUsername();
								break;
						}
						$data[] = array('message'=>$notification->getMessage(),'messageType'=>$notification->getMessageType(),$user);
					}
				}
				$this->result = array('success' => true,'totalCount' => count($data),'rows' => $data);					
				break;
		}
	}
	
	public function end()
	{	
		$this->result=json_encode($this->result);
		return $this->result;
	}
}
?>