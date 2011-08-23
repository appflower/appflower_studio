<?php
/**
 * Notification command class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioNotificationCommand extends afBaseStudioCommand
{
    /**
     * Process setting notification
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processSet()
    {
        $message = $this->getParameter('message');
        $messageType = ($messageType = $this->getParameter('messageType') && $messageType != 'false') ? $messageType : 'notification';
        
        afsNotificationPeer::log($message, $messageType);
        
        return afResponseHelper::create()->success(true)->message('Saved notification!')->asArray();
    }
    
    /**
     * Process getting notifications
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processGet()
    {
        $offset = $this->getParameter('offset');
        $notifications = afsNotificationPeer::getAll($offset);
        $data = array();
        
        if ($notifications) {
            foreach ($notifications as $notification) {
                switch ($notification->getUser()) {
                    case 0:
                        $user = 'Guest';
                        break;
                        
                    default:
                        $user = afGuardUserPeer::retrieveByPK($notification->getUser());
                        $user = $user->getUsername();
                        break;
                }
                $data[] = '<li>'.$notification->getCreatedAt('d/m/Y H:i').' '.$user.' ['.$notification->getMessageType().'] {'.$notification->getIp().'} '.$notification->getMessage().'</li>';
                
                $offset++;
            }
        }
        
		$this->result = array('success' => true, 'notifications' => implode('', $data), 'offset' => $offset);
    }
    
}
