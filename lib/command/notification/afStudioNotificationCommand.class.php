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
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processSet()
    {
        $message = $this->getParameter('message');
        $messageType = $this->getParameter('messageType');
        
        $messageType = ($messageType != 'false') ? $messageType : self::DEFAULT_MESSAGE_TYPE;
        
        afsNotificationPeer::log($message, $messageType);
        
        return afResponseHelper::create()->success(true)->message('Saved notification!');
    }
    
    /**
     * Process getting notifications
     *
     * @return afResponse
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
        
		return afResponseHelper::create()->success(true)->data(array(), array('notifications' => implode('', $data), 'offset' => $offset), 0);
    }
    
}
