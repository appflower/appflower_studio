<?php
/**
 * afsAuthorize action
 * 
 * @author startsev.sergey@gmail.com
 */
class afsAuthorizeActions extends sfActions
{
    /**
     * Pre execute
     */
    public function preExecute()
    {
        afStudioUser::getInstance()->authorize();
    }
    
    /**
     * Sign out controller
     */
	public function executeSignout($request)
	{
        afStudioUser::getInstance()->signOut();
        
        $signoutUrl = $request->getReferer();

        $this->redirect('' != $signoutUrl ? $signoutUrl : '@homepage');
	}
	
    /**
     * Default controller and first point to login 
     */
    public function executeIndex()
    {
        $this->setTemplate('signin');
    }
    
    /**
     * Sign In functionality controller
     */
	public function executeSignin($request)
	{
		
		if ($request->isMethod('post')) {
			if($request->hasParameter('signin')) {
			    
                $signin = $request->getParameter('signin');

                $sUsername = $signin['username'];
                $sPassword = $signin['password'];
                
                $user = afStudioUser::getInstance()->retrieve($sUsername);

                if ($user) {
					
                    if ($user['password'] === sha1($signin['password'])) {
                        
                        afStudioUser::getInstance()->set($sUsername, $sPassword);
                        
						$signinUrl = $this->getRequest()->getReferer();
						$signinUrl = ($signinUrl!=null) ? $signinUrl : url_for('@homepage');
						
						$result = array(
                            'success' => true, 
                            'redirect'=>$signinUrl, 
                            'load'=>'page'
                        );
                        
						$result = json_encode($result);
						return $this->renderText($result);
                        
					} else {
						$result = array(
                            'success' => false,
                            'message' => 'The username and/or password is invalid. Please try again.'
                        );
                        
						$result = json_encode($result);
						return $this->renderText($result);
					}
				} else {
					$result = array(
                        'success' => false, 
                        'message' => 'The username and/or password is invalid. Please try again.',
                        'redirect' => '/afsAuthorize/index', 
                        'load' => 'page'
                    );
					$result = json_encode($result);
					return $this->renderText($result);
                }
                
            } else {

                $result = array(
                    'success' => false, 
                    'message' => 'You were logged out ! You\'ll be redirected to the login page!', 
                    'redirect' => '/afsAuthorize/index', 
                    'load' => 'page'
                );
                
				$result = json_encode($result);
                
				return $this->renderText($result);
			}
            
		} else {
			// if we have been forwarded, then the referer is the current URL
			// if not, this is the referer of the current request
			$user->setReferer($this->getContext()->getActionStack()->getSize() > 1 ? $request->getUri() : $request->getReferer());
            
			$module = sfConfig::get('sf_login_module');
			if ($this->getModuleName() != $module)
			{
				$result = array(
				    'success' => false,
				    'message' => 'You were logged out ! You\'ll be redirected to the login page!',
				    'redirect' => '/afsAuthorize/index',
				    'load' => 'page'
				);
				$result = json_encode($result);
				return $this->renderText($result);
			}
		}
        
	}
}
