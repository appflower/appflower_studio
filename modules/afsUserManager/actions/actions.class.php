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
        
        $aUser = afStudioUser::getInstance()->retrieve($sUsername);
        
        return $this->renderJson($aUser);
    }
    
    /**
     * Getting users list
     */
    public function executeGetList(sfWebRequest $request)
    {
        $aUsers = afStudioUser::getCollection();
        return $this->renderJson($aUsers);
    }
    
    /**
     * Updating user
     */
    public function executeUpdate(sfWebRequest $request)
    {
        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        // Retrieve user via username
        $user = afStudioUser::getInstance()->retrieve($sUsername);
        
        if ($user) {
            $aUpdate = array(
                afStudioUser::FIRST_NAME => $aUser['first_name'],
                afStudioUser::LAST_NAME => $aUser['last_name'],
                afStudioUser::EMAIL => $aUser['email'],
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
            $aResult = $this->fetchError("This user doesn't exists");
        }
        
        return $this->renderJson($aResult);
    }
    
    /**
     * Creating new user controller
     */
    public function executeCreate(sfWebRequest $request)
    {
        $sUsername = $request->getParameter('username');
        $aUser = json_decode($request->getParameter('user'), true);
        
        $user = afStudioUser::getInstance()->retrieve($sUsername);
        
        if (!$user) {
            
            // Prepare data for validating and creating
            $aCreate = array(
                afStudioUser::USERNAME => $sUsername,
                afStudioUser::FIRST_NAME => $aUser['first_name'],
                afStudioUser::LAST_NAME => $aUser['last_name'],
                afStudioUser::EMAIL => $aUser['email'],
                afStudioUser::PASSWORD => $aUser['password']
            );
            
            // Validating user data
            $validate = afStudioUser::validate($aCreate);
            
            if (is_bool($validate) && $validate === true) {
                // unset username - no need to creating meta-field username
                unset($aCreate[afStudioUser::USERNAME]);
                
                // Create new user
                afStudioUser::create($sUsername, $aCreate);
                
                $aResult = $this->fetchSuccess('User has been successfully created');
            } else {
                $aResult = $this->fetchError($validate);
            }
            
        } else {
            $aResult = $this->fetchError('User with this `username` already exists');
        }
        
        return $this->renderJson($aResult);
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
