<?php
/**
 * afsAuthorize action
 * 
 * @package     appFlowerStudio
 * @subpackage  plugin
 * @author      startsev.sergey@gmail.com
 */
class afsAuthorizeActions extends sfActions
{
    /**
     * Pre execute
     */
    public function preExecute()
    {
        afStudioUser::getInstance()->authorize();
        
        if (afStudioUser::getInstance()->isAuthenticated() && $this->getActionName() != 'signout') {
            $this->redirect('appFlowerStudio/studio');
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
     * Sign out controller
     */
	public function executeSignout(sfWebRequest $request)
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
	public function executeSignin(sfWebRequest $request)
	{
		if ($request->isMethod('post')) {
			if($request->hasParameter('signin')) {
			    
                $signin = $request->getParameter('signin');

                $sUsername = $signin['username'];
                $sPassword = $signin['password'];
                $bRemember = isset($signin['remember']);
                
                $user = afStudioUser::getInstance()->retrieve($sUsername);

                if ($user) {
                    if ($user['password'] === sha1($signin['password'])) {
                        
                        afStudioUser::getInstance()->set($sUsername, $sPassword, $bRemember);
                        
						$signinUrl = $this->getRequest()->getReferer();
						$signinUrl = ($signinUrl != null) ? $signinUrl : url_for('@homepage');
						
						$result = array(
                            'success' => true, 
                            'redirect' => $signinUrl, 
                            'load' => 'page'
                        );
                        
                        afsNotificationPeer::log('Successful login', 'afStudioAuth');
                        
					} else {
						$result = array(
                            'success' => false,
                            'message' => 'The username and/or password is invalid. Please try again.'
                        );
                        
                        afsNotificationPeer::log('Failed to get authenticated in the system!', 'afStudioAuth');
                        
					}
				} else {
					$result = array(
                        'success' => false, 
                        'message' => 'The username and/or password is invalid. Please try again.',
                        'redirect' => '/afsAuthorize/index', 
                        'load' => 'page'
                    );
                    
                    afsNotificationPeer::log('Failed to get authenticated in the system!', 'afStudioAuth');
                }
                
            } else {

                $result = array(
                    'success' => false, 
                    'message' => 'You were logged out ! You\'ll be redirected to the login page!', 
                    'redirect' => '/afsAuthorize/index', 
                    'load' => 'page'
                );
                
                afsNotificationPeer::log('Successful logout', 'afStudioAuth');
                
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
				
				afsNotificationPeer::log('Successful logout', 'afStudioAuth');
				
			}
		}
        
        return $this->renderJson($result);
	}

    /**
     * Password request controller
     */
    public function executePasswordRequest(sfWebRequest $request)
    {
        if ($request->getMethod() != sfRequest::POST)
        {
            // display the form
            return sfView::SUCCESS;
        }
        
        $email = $request->getParameter('email');
        
        // Retrieve user via email
        $user = afStudioUser::getInstance()->retrieveByEmail($email);
        
        if ($user) {
            // set new random password
            $password = substr(md5(rand(100000, 999999)), 0, 6);
            
            // updating password 
            afStudioUser::update(
                $user['username'],
                array(afStudioUser::PASSWORD => afStudioUser::passwordRule($password))
            );
            
            // getting current domain
            $domain = '';
            if (sfConfig::get('app_domain')) {
                $domain = sfConfig::get('app_domain');
            } else {
                $domain = sfContext::getInstance()->getRequest()->getHost();
            }
            
            // parameters for partial -> recovering mail
            $aParameters = array(
                'user' => $user,
                'password' => $password,
            );
            
            sfProjectConfiguration::getActive()->loadHelpers(array("Url", "Tag"));
            
            $message = Swift_Message::newInstance()
                ->setFrom("no-reply@{$domain}", 'Studio')
                ->setTo($user['email'])
                ->setSubject('Studio password recovery')
                ->setBody($this->getPartial('recovery', $aParameters))
                ->setContentType('text/html')
            ;
            
            // Sending mail 
            if ($this->getMailer()->send($message) > 0) {
                $result = array(
                    'success' => true,
                    'message' => 'Your login information was sent to '.$email.'. <br>You should receive it shortly, so you can proceed to the '.link_to('login page', 'afsAuthorize/index').'.'
                );
            } else {
                $result = array(
                    'success' => false,
                    'message' => 'There is no user with this email address. Please try again!'
                );
            }
            
        } else {
            $result = array(
                'success' => false,
                'message' => 'There is no user with this email address. Please try again!'
            );
        }

        return $this->renderJson($result);
    }

}
