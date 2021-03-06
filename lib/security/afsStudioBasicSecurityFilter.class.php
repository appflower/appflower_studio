<?php
/**
 *  Studio Security filter
 * 
 *  @author startsev.sergey@gmail.com
 */
class afsStudioBasicSecurityFilter extends sfBasicSecurityFilter
{
    /**
     * Filter executer
     */
    public function execute($filterChain)
    {
        if ($this->isFirstCall()) {
        
            $context = $this->getContext();
            
            // Checking user authorization
            if (!afStudioUser::getInstance()->authorize()) {
                $context->getController()->forward('afsAuthorize', 'index');
                throw new sfStopException();
            }
        }
        
        $filterChain->execute();
    }
    
}
