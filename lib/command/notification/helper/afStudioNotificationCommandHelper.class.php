<?php
/**
 * Notification command helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioNotificationCommandHelper extends afBaseStudioCommandHelper 
{
    /**
     * Default render tag element
     */
    const DEFAULT_RENDER_TAG = 'li';
    
    /**
     * Render notification 
     *
     * @param afsNotification $notification 
     * @return string
     * @author Sergey Startsev
     */
    static public function render(afsNotification $notification)
    {
        $row =  "{$notification->getCreatedAt('d/m/Y H:i')} {$notification->getUser()}" . 
                " [{$notification->getMessageType()}] {{$notification->getIp()}} {$notification->getMessage()}";
        
        return self::renderAsTag($row);
    }
    
    /**
     * Render some content as tagged line
     *
     * @param string $content 
     * @param array $attributes 
     * @param string $tag 
     * @return string
     * @author Sergey Startsev
     */
    static public function renderAsTag($content, array $attributes = array(), $tag = self::DEFAULT_RENDER_TAG)
    {
        $attributes_list = '';
        if (!empty($attributes)) {
            $attributes_list = array();
            foreach ($attributes as $key => $value) $attributes_list[] = "{$key}=\"{$value}\"";
            
            $attributes_list = implode(' ', $attributes_list);
        }
        
        return "<{$tag}{$attributes_list}>{$content}</{$tag}>";
    }
    
}
