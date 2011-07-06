<?php
/**
 * This exception is thrown by NotificationPeer class that accesses notifications
 * We want to display nice error message when exception of this type occurs
 *
 * @author Lukasz Wojciechowski <luwo@appflower.com>
 */
class afStudioNotificationsException extends Exception {
    public function __construct($message, $code, $previous) {
        if (!$message) {
            $message = 'Studio Storage error occured.<br />'
                        .'Audit log will not be available.<br />'
                        .'Please check your configuration';
        }
        parent::__construct($message, $code, $previous);
    }
}

?>