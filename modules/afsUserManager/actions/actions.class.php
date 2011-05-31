<?php
/**
 * afsUserManager action
 * 
 * @package     appFlowerStudio
 * @subpackage  plugin
 * @author      startsev.sergey@gmail.com
 */
class afsUserManagerActions extends sfActions
{
    /**
     * Catching executing ajax queries from direct call
     */
    public function preExecute()
    {
        if (!$this->getRequest()->isXmlHttpRequest() && $this->getActionName() != 'captcha') {
            $this->forward404("This action should be used only for ajax requests");
        }
    }
    
    /**
     * Rendering json
     */
    protected function renderJson($result)
    {
        $this->getResponse()->setHttpHeader("Content-Type", 'application/json');
        return $this->renderText(json_encode($result));
    }
    
    /**
     * Getting user information
     */
    public function executeGet(sfWebRequest $request)
    {
        $sUsername = $request->getParameter('username', afStudioUser::getInstance()->getUsername());
        
        // Catching if current user not admin
        if (!afStudioUser::getInstance()->isAdmin() && afStudioUser::getInstance()->getUsername() != $sUsername) {
            $this->forward404("You have no rights to execute this action");
        }
        
        $aUser = afStudioUser::getInstance()->retrieve($sUsername);
        
        $aUser['username'] = $sUsername;
        
        return $this->renderJson($aUser);
    }
    
    /**
     * Getting users list
     */
    public function executeGetList(sfWebRequest $request)
    {
        // Catching if current user not admin 
        if (!afStudioUser::getInstance()->isAdmin()) {
            $this->forward404("You have no rights to execute this action");
        }
        
        $aUsers = afStudioUser::getCollection();
        
        // Preparing users for output
        $users = array();
        
        $i = 1;
        foreach ($aUsers as $username => $user) {
            $users[] = array(
                'id' => $i,
                'username' => $username,
                'email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'role' => $user['role']
            );
            $i++;
        }
        
        return $this->renderJson(array('data' => $users));
    }
    
    /**
     * Updating user
     */
    public function executeUpdate(sfWebRequest $request)
    {
        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        // Will be passed if user - admin or he trying update his own profile
        if (!afStudioUser::getInstance()->isAdmin() && afStudioUser::getInstance()->getUsername() != $sUsername) {
            $this->forward404("You have no rights to execute this action");
        }
        
        $aErrors = array();
        
        // Retrieve user via username
        $user = afStudioUser::getInstance()->retrieve($sUsername);
        
        if ($user) {
            
            $aUserCheck = afStudioUser::getInstance()->retrieveByEmail($aUser['email']);
            
            if ($aUserCheck && $aUserCheck['username'] != $aUser['username']) {
                $aErrors['email'] = "User with this `email` already exists";
            }
            
            
            $aUpdate = array(
                afStudioUser::FIRST_NAME => $aUser['first_name'],
                afStudioUser::LAST_NAME => $aUser['last_name'],
                afStudioUser::EMAIL => $aUser['email'],
            );
            
            if (isset($aUser['role'])) {
                $aUpdate[afStudioUser::ROLE] = $aUser['role'];
            }
            
            if (!empty($aUser['password'])) {
                $aUpdate[afStudioUser::PASSWORD] = $aUser['password'];
            }
            
            // Validate user data 
            $validate = afStudioUser::validate($aUpdate);
            
            if (is_bool($validate) && $validate === true && empty($aErrors)) {
                // if password has been setted encoding using rule
                if (!empty($aUser['password'])) {
                    $aUpdate[afStudioUser::PASSWORD] = afStudioUser::passwordRule($aUser['password']);
                }
                
                // Update processing
                afStudioUser::update($sUsername, $aUpdate);
                
                $aResult = $this->fetchSuccess('User has been successfully updated');
                
                afsNotificationPeer::log('User has been successfully updated', 'afStudioUser');
            } else {
                if (is_array($validate)) {
                    $aErrors = afUserManagerHelper::mergeErrors($aErrors, $validate);
                }
                
                $aErrors = afUserManagerHelper::prepareErrors($aErrors);
                
                $aResult = $this->fetchError($aErrors);
            }
            
        } else {
            $aResult = $this->fetchError("This user doesn't exists");
        }
        
        return $this->renderJson($aResult);
    }
    
    /**
     * Creating new user controller
     */
    public function executeCreate(sfWebRequest $request)
    {
        $aResult = afStudioUserHelper::createNewUser($request);
        
        return $this->renderJson($aResult);
    }
    
    /**
     * Delete User functionality
     */
    public function executeDelete(sfWebRequest $request)
    {
        if (!afStudioUser::getInstance()->isAdmin()) {
            $this->forward404("You have no rights to execute this action");
        }
        
        $sUsername = $request->getParameter('username');
        
        if (afStudioUser::getInstance()->getUsername() == $sUsername) {
            $aResult = $this->fetchError("You can't delete youself");
        } else {
            if (afStudioUser::getInstance()->retrieve($sUsername)) {
                if (afStudioUser::delete($sUsername)) {
                    $aResult = $this->fetchSuccess("User has been deleted");
                    
                    afsNotificationPeer::log('User has been deleted', 'afStudioUser');
                    
                } else {
                    $aResult = $this->fetchError("Can't delete user");
                }
            } else {
                $aResult = $this->fetchError("This doesn't exists");
            }
        }
        
        return $this->renderJson($aResult);
    }
    
    /**
     * Getting captcha image
     */
    public function executeCaptcha(sfWebRequest $request)
    {
        $width = $request->getParameter('width', 160);
        $height = $request->getParameter('height', 50);
        $characters = $request->getParameter('characters', 6);
        
        $captcha = new afsCaptcha($width, $height, $characters);
        $captcha->CreateImage();
        
        return sfView::NONE;
    }
    
    /**
     * Fetching success response
     */
    private function fetchSuccess($message)
    {
        return array('success' => true, 'message' => $message);
    }
    
    /**
     * Fetching error response
     */
    private function fetchError($message)
    {
        return array('success' => false, 'message' => $message);
    }
    
    public function executeCheckUserExist($request)
    {
    	afStudioUser::getInstance()->authorize();

        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        $user = afStudioUser::getInstance()->retrieve($sUsername);
        
        $aErrors = array();

        if ($user) {
        	return array('success' => false, 'message' => 'User with this `username` already exists', 'field'=>'username');
        }
        
        if (afStudioUser::getInstance()->retrieveByEmail($aUser['email'])) {
        	return array('success' => false, 'message' => 'User with this `email` already exists', 'field'=>'email');
        }
        
        return array('success' => true, 'message' => 'User ok');
    }
}
