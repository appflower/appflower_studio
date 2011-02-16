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
                        
					} else {
						$result = array(
                            'success' => false,
                            'message' => 'The username and/or password is invalid. Please try again.'
                        );
                        
					}
				} else {
					$result = array(
                        'success' => false, 
                        'message' => 'The username and/or password is invalid. Please try again.',
                        'redirect' => '/afsAuthorize/index', 
                        'load' => 'page'
                    );
                }
                
            } else {

                $result = array(
                    'success' => false, 
                    'message' => 'You were logged out ! You\'ll be redirected to the login page!', 
                    'redirect' => '/afsAuthorize/index', 
                    'load' => 'page'
                );
                
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
				
			}
		}
        
        return $this->renderJson($result);
        
	}


    /**
     * Password request controller
     * 
     * @TODO end this functionality, and need to create template with form
     */
    public function executePasswordRequest(sfWebRequest $request)
    {
        if ($this->getRequest()->getMethod() != sfRequest::POST)
        {
            // display the form
            return sfView::SUCCESS;
        }

        // handle the form submission
        $c = new Criteria();
        $c->add(sfGuardUserPeer::USERNAME, $this->getRequestParameter('email'));
        $user = sfGuardUserPeer::doSelectOne($c);

        // email exists?
        if ($user)
        {
            //audit log
            $user_old=clone $user;

            // set new random password
            $password = substr(md5(rand(100000, 999999)), 0, 6);
            $user->setPassword($password);
            $user->save(); // save new password


                        if ($user->getUsername()) {
                            $parameters = array(
                                'userObj'  => $user,
                                'password' => $password,
                                'email'    => $user->getUsername(),
                                'subject'  => 'seedControl password recovery',
                                'from'     => 'Seedcontrol'
                            );

                            afAutomailer::saveMail('mail', 'sendPasswordRequest', $parameters);
                        }


            sfProjectConfiguration::getActive()->loadHelpers(array("Url","Tag"));
            $result = array('success' => true,'message'=>'Your login information was sent to '.$this->getRequestParameter('email').'. <br>You should receive it shortly, so you can proceed to the '.link_to('login page', '@login').'.');

        }
        else
        {
            $result = array('success' => false,'message'=>'There is no user with this email address. Please try again!');
        }

        $result = json_encode($result);
        return $this->renderText($result);
    }

}
