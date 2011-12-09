<?php
/**
 * afsUserManager action
 * 
 * @package     appFlowerStudio
 * @subpackage  plugin
 * @author      Sergey Startsev <startsev.sergey@gmail.com>
 */
class afsUserManagerActions extends afsActions
{
    /**
     * Catching executing ajax queries from direct call
     * 
     * @return void
     * @author Sergey Startsev
     */
    public function preExecute()
    {
        if (!$this->getRequest()->isXmlHttpRequest() && $this->getActionName() != 'captcha') {
            $this->forward404("This action should be used only for ajax requests");
        }
    }
    
    /**
     * Getting user information
     * 
     * @param sfWebRequest $request
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeGet(sfWebRequest $request)
    {
        $username = $request->getParameter('username', afStudioUser::getInstance()->getUsername());
        
        // Catching if current user not admin
        if (!afStudioUser::getInstance()->isAdmin() && afStudioUser::getInstance()->getUsername() != $username) {
            $this->forward404("You have no rights to execute this action");
        }
        
        $user = afStudioUser::getInstance()->retrieve($username);
        $user['username'] = $username;
        
        return $this->renderJson(afResponseHelper::create()->success(true)->data(array(), $user, 0)->asArray());
    }
    
    /**
     * Getting users list
     * 
     * @param sfWebRequest $request
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeGetList(sfWebRequest $request)
    {
        // Catching if current user not admin 
        if (!afStudioUser::getInstance()->isAdmin()) {
            $this->forward404("You have no rights to execute this action");
        }
        
        $users = afStudioUser::getCollection();
        $aUsers = array();
        
        $i = 1;
        foreach ($users as $username => $user) {
            $aUsers[] = array(
                'id' => $i++,
                'username' => $username,
                'email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'role' => $user['role']
            );
        }
        
        return $this->renderJson(afResponseHelper::create()->success(true)->data(array(), $aUsers, 0)->asArray());
    }
    
    /**
     * Updating user
     * 
     * @param sfWebRequest $request
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeUpdate(sfWebRequest $request)
    {
        $response = afResponseHelper::create();
        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        // Will be passed if user - admin or he trying update his own profile
        if (!afStudioUser::getInstance()->isAdmin() && afStudioUser::getInstance()->getUsername() != $sUsername) {
            $this->forward404("You have no rights to execute this action");
        }
        
        // Retrieve user via username
        $user = afStudioUser::retrieve($sUsername);
        $errors = array();
        
        if (!$user) return $this->renderJson($response->success(false)->message("This user doesn't exists")->asArray());
        
        $aUserCheck = afStudioUser::retrieveByEmail($aUser['email']);
        if ($aUserCheck && $aUserCheck['username'] != $aUser['username']) $aErrors['email'] = "User with this `email` already exists";
        
        $aUpdate = array(
            afStudioUser::FIRST_NAME => $aUser['first_name'],
            afStudioUser::LAST_NAME => $aUser['last_name'],
            afStudioUser::EMAIL => $aUser['email'],
        );
        
        if (isset($aUser['role'])) $aUpdate[afStudioUser::ROLE] = $aUser['role'];
        if (!empty($aUser['password'])) $aUpdate[afStudioUser::PASSWORD] = $aUser['password'];
        
        // Validate user data 
        $validate = afStudioUser::validate($aUpdate);
        
        if (is_bool($validate) && $validate === true && empty($aErrors)) {
            // if password has been setted encoding using rule
            if (!empty($aUser['password'])) $aUpdate[afStudioUser::PASSWORD] = afStudioUser::passwordRule($aUser['password']);
            
            // Update processing
            afStudioUser::update($sUsername, $aUpdate);
            
            afsNotificationPeer::log('User has been successfully updated', 'afStudioUser');
            
            // if changes applied for current user
            if (afStudioUser::getInstance()->getUsername() == $sUsername) {
                if (!empty($aUser['password'])) afStudioUser::set($sUsername, $aUser['password'], false);
                
                // update role of current user - with redirect processing 
                if (afStudioUser::getInstance()->getRole() != $aUser['role']) {
                    return $this->renderJson($response->redirect('afsAuthorize/signout')->asArray());
                }
            }
            
            $response->success(true)->message('User has been successfully updated');
        } else {
            if (is_array($validate)) $aErrors = afsUserManagerHelper::mergeErrors($aErrors, $validate);
            $aErrors = afsUserManagerHelper::prepareErrors($aErrors);
            
            $response->success(false)->message($aErrors);
        }
        
        return $this->renderJson($response->asArray());
    }
    
    /**
     * Creating new user controller
     * 
     * @param sfWebRequest $request
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeCreate(sfWebRequest $request)
    {
        return $this->renderJson(
            afsUserManagerHelper::createNewUser($request)
        );
    }
    
    /**
     * Delete User functionality
     * 
     * @param sfWebRequest $request
     * @return string - json
     * @author Sergey Startsev
     */
    public function executeDelete(sfWebRequest $request)
    {
        if (!afStudioUser::getInstance()->isAdmin()) $this->forward404("You have no rights to execute this action");
        
        $response = afResponseHelper::create();
        $username = $request->getParameter('username');
        
        if (afStudioUser::getInstance()->getUsername() == $username) {
            return $this->renderJson($response->success(false)->message("You can't delete youself")->asArray());
        }
        
        if (!afStudioUser::getInstance()->retrieve($username)) {
            return $this->renderJson($response->success(false)->message("This user doesn't exists")->asArray());
        }
        
        if (!afStudioUser::delete($username)) return $this->renderJson($response->success(false)->message("Can't delete user")->asArray());
        
        afsNotificationPeer::log('User has been deleted', 'afStudioUser');
        
        return $this->renderJson($response->success(true)->message("User has been deleted")->asArray());
    }
    
    /**
     * Getting captcha image
     * 
     * @param sfWebRequest $request
     * @return void
     * @author Sergey Startsev
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
     * Check is user exists
     *
     * todo remove if not used
     * 
     * @param sfWebRequest $request 
     * @return array
     * @author Milos Silni
     */
    public function executeCheckUserExist(sfWebRequest $request)
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
