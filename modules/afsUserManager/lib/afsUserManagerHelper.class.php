<?php
/**
 * User manager helper class
 *
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsUserManagerHelper
{
    /**
     * Merge errors delimiter
     */
    const MERGE_DELIMITER = '<br/>';
    
    /**
     * Merge 2 error arrays 
     *
     * @param array $errors_first
     * @param arrya $errors_second
     * @return array
     * @author Sergey Startsev
     */
    static public function mergeErrors(Array $errors_first, Array $errors_second)
    {
        foreach ($errors_second as $key => $error) {
            if (isset($errors_first[$key]) && !empty($errors_first[$key])) {
                $errors_first[$key] .= self::MERGE_DELIMITER . $error;
            } else {
                $errors_first[$key] = $error;
            }
        }
        
        return $errors_first;
    }
    
    /**
     * Prepare errors for output
     *
     * @param array $errors
     * @return array
     * @author Sergey Startsev
     */
    static public function prepareErrors(Array $errors)
    {
        $aErrors = array();
        foreach ($errors as $fieldname => $error) {
            $aErrors[] = array(
                'fieldname' => $fieldname,
                'message' => $error
            );
        }
        
        return $aErrors;
    }
    
    /**
     * Create new user 
     *
     * @param sfWebRequest $request 
     * @return array
     * @author Sergey Startsev
     */
    static public function createNewUser(sfWebRequest $request)
    {
        $response = afResponseHelper::create();
        afStudioUser::getInstance()->authorize();
        
        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        $user = afStudioUser::retrieve($sUsername);
        
        $aErrors = array();
        
        if ($user) $aErrors['username'] = 'User with this `username` already exists';
        if (afStudioUser::retrieveByEmail($aUser['email'])) $aErrors['email'] = "User with this `email` already exists";
        
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
            
            afsNotificationPeer::log('User has been successfully created', 'afStudioUser');
            
            // getting current domain
            $domain = (sfConfig::get('app_domain')) ? sfConfig::get('app_domain') : sfContext::getInstance()->getRequest()->getHost();
            
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
            
            try {
                @sfContext::getInstance()->getController()->getAction('afsUserManager', 'create')->getMailer()->send($message);
            } catch (Swift_TransportException $e) {
                $response->console("Local server can't sent email for now. Please check mail server settings.");
            }
        } else {
            if (is_array($validate)) $aErrors = self::mergeErrors($aErrors, $validate);
        }
        
        $aErrors = self::prepareErrors($aErrors);
        
        if (!empty($aErrors)) return $response->success(false)->message($aErrors)->asArray();
        
        return $response->success(true)->message('User has been successfully created')->asArray();
    }
    
}
