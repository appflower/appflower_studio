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
        if (!$this->getRequest()->isXmlHttpRequest()) {
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
        
        // Retrieve user via username
        $user = afStudioUser::getInstance()->retrieve($sUsername);
        
        if ($user) {
            
            $aUserCheck = afStudioUser::getInstance()->retrieveByEmail($aUser['email']);
            if (!$aUserCheck || ($aUserCheck['username'] == $aUser['username'])) {
            
                $aUpdate = array(
                    afStudioUser::FIRST_NAME => $aUser['first_name'],
                    afStudioUser::LAST_NAME => $aUser['last_name'],
                    afStudioUser::EMAIL => $aUser['email'],
                    afStudioUser::ROLE => $aUser['role'],
                );
                
                if (!empty($aUser['password'])) {
                    $aUpdate[afStudioUser::PASSWORD] = $aUser['password'];
                }
                
                // Validate user data 
                $validate = afStudioUser::validate($aUpdate);
                
                if (is_bool($validate) && $validate === true) {
                    // if password has been setted encoding using rule
                    if (!empty($aUser['password'])) {
                        $aUpdate[afStudioUser::PASSWORD] = afStudioUser::passwordRule($aUser['password']);
                    }
                    
                    // Update processing
                    afStudioUser::update($sUsername, $aUpdate);
                    
                    $aResult = $this->fetchSuccess('User has been successfully updated');
                } else {
                    $aResult = $this->fetchError($validate);
                }
            } else {
                $aResult = $this->fetchError("User with this `email` already exists");
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
        // Catching if current user not admin 
        if (!afStudioUser::getInstance()->isAdmin()) {
            $this->forward404("You have no rights to execute this action");
        }
        
        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        $user = afStudioUser::getInstance()->retrieve($sUsername);
        
        if (!$user) {
            if (!afStudioUser::getInstance()->retrieveByEmail($aUser['email'])) {
                
                // Prepare data for validating and creating
                $aCreate = array(
                    afStudioUser::USERNAME => $sUsername,
                    afStudioUser::FIRST_NAME => $aUser['first_name'],
                    afStudioUser::LAST_NAME => $aUser['last_name'],
                    afStudioUser::EMAIL => $aUser['email'],
                    afStudioUser::PASSWORD => $aUser['password'],
                    afStudioUser::ROLE => $aUser['role']
                );
                
                // Validating user data
                $validate = afStudioUser::validate($aCreate);
                
                if (is_bool($validate) && $validate === true) {
                    // unset username - no need to creating meta-field username
                    unset($aCreate[afStudioUser::USERNAME]);
                    
                    // Create new user
                    afStudioUser::create($sUsername, $aCreate);
    
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
                        ->setBody($this->getPartial('create', $aParameters))
                        ->setContentType('text/html')
                    ;
                    
                    // Sending mail 
                    if ($this->getMailer()->send($message) > 0) {
                        $aResult = $this->fetchSuccess('User has been successfully created');
                    } else {
                        $aResult = $this->fetchError("User has been successfully created. Can't send mail.");
                    }
                } else {
                    $aResult = $this->fetchError($validate);
                }
            } else {
                $aResult = $this->fetchError("User with this `email` already exists");
            }
            
        } else {
            $aResult = $this->fetchError('User with this `username` already exists');
        }
        
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
     * Getting Info about current user
     */
    public function executeCurrent(sfWebRequest $request)
    {
        $user = afStudioUser::getInstance();
        $result = array(
            'username' => $user->getUsername(),
            'name' => $user->getName(),
        );
        
        return $this->renderJson($result);
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
    
}
