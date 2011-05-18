<?php
class afStudioUserHelper
{
	
	public static function createNewUser(sfWebRequest $request)
    {
    	afStudioUser::getInstance()->authorize();

        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        $user = afStudioUser::getInstance()->retrieve($sUsername);
        
        $aErrors = array();

        if ($user) {
            $aErrors['username'] = 'User with this `username` already exists';
        }
        
        if (afStudioUser::getInstance()->retrieveByEmail($aUser['email'])) {
            $aErrors['email'] = "User with this `email` already exists";
        }
        
        if (!afStudioUser::getInstance()->isAdmin()) {
            if ($aUser['captcha'] != sfContext::getInstance()->getUser()->getFlash(afsCaptcha::SESSION_IDENTIFICATOR)) {
                $aErrors['captcha'] = "Invalid verification code";
            }
        }
        
        // Prepare data for validating and creating
        $aCreate = array(
            afStudioUser::USERNAME => $sUsername,
            afStudioUser::FIRST_NAME => $aUser['first_name'],
            afStudioUser::LAST_NAME => $aUser['last_name'],
            afStudioUser::EMAIL => $aUser['email'],
            afStudioUser::PASSWORD => $aUser['password'],
            afStudioUser::ROLE => (afStudioUser::getInstance()->isAdmin()) ? $aUser['role'] : 'user'
        );
        
        // Validating user data
        $validate = afStudioUser::validate($aCreate);
        
        if (is_bool($validate) && $validate === true && empty($aErrors)) {
            // unset username - no need to creating meta-field username
            unset($aCreate[afStudioUser::USERNAME]);
            
            // Create new user
            afStudioUser::create($sUsername, $aCreate);
            
            afsNotificationPeer::log('User has been successfully created', 'user_manager');

            // Sending email part
            
            // getting current domain
            $domain = '';
            if (sfConfig::get('app_domain')) {
                $domain = sfConfig::get('app_domain');
            } else {
                $domain = sfContext::getInstance()->getRequest()->getHost();
            }
            
            $aParameters = array(
                'user' => $aUser,
                'password' => $aUser['password'],
            );
            
            sfProjectConfiguration::getActive()->loadHelpers(array("Url", "Tag"));
            
            $message = Swift_Message::newInstance()
                ->setFrom("no-reply@{$domain}", 'Studio')
                ->setTo($aUser['email'])
                ->setSubject('Studio Account')
                ->setBody(sfContext::getInstance()->getController()->getAction('afsUserManager', 'create')->getPartial('afsUserManager/create', $aParameters))
                ->setContentType('text/html')
            ;
            
            // Sending mail 
            if (!sfContext::getInstance()->getController()->getAction('afsUserManager', 'create')->getMailer()->send($message)) {
                $aErrors = afUserManagerHelper::mergeErrors($aErrors, array('sent' => "User has been successfully created. Can't send mail."));
            }
        } else {
            if (is_array($validate)) {
                $aErrors = afUserManagerHelper::mergeErrors($aErrors, $validate);
            }
        }
        
        $aErrors = afUserManagerHelper::prepareErrors($aErrors);
        
        if (!empty($aErrors)) {
            $aResult = array('success' => false, 'message' => $aErrors);
        } else {
            $aResult = array('success' => true, 'message' => 'User has been successfully created');
        }
        
        return $aResult;
    }
    
}