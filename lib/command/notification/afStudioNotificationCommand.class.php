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
     * Default message type notification
     */
    const DEFAULT_MESSAGE_TYPE = 'notification';
    
    /**
     * Process setting notification
     *
     * @return array
     * @author Sergey Startsev
     */
    protected function processSet()
    {
        $message = $this->getParameter('message');
        $messageType = ($messageType = $this->getParameter('messageType') && $messageType != 'false') ? $messageType : self::DEFAULT_MESSAGE_TYPE;
        
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
                $data[] = afStudioNotificationCommandHelper::render($notification);
                $offset++;
            }
        }
        
        /*
            TODO wrap to afResponse
        */
		$this->result = array('success' => true, 'notifications' => implode('', $data), 'offset' => $offset);
    }
    
}
