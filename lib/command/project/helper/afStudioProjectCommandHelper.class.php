<?php
/**
 * Studio project command helper class 
 * 
 * @package appFlowerStudio
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioProjectCommandHelper extends afBaseStudioCommandHelper
{
    /**
     * Returns Prepared commands results - for now just imploded values
     * 
     * @return string
     * @author Sergey Startsev
     */
    static public function processRun()
    {
        $commands = array(
            'sf propel:build-model',
            'sf appflower:validator-cache frontend cache yes',
            'sf cc',
        );
        
        return afStudioConsole::getInstance()->execute($commands);
    }
    
    /**
     * User in Create Project Wizard
     * 
     * @param user - Object
     * @author Radu Topala
     */
    static public function createNewUser($user, $path)
    {
        // Prepare data
        $aCreate = array(
            afStudioUser::FIRST_NAME => $user->first_name,
            afStudioUser::LAST_NAME => $user->last_name,
            afStudioUser::EMAIL => $user->email,
            afStudioUser::PASSWORD => $user->password,
            afStudioUser::ROLE => $user->role
        );
        
        unset($aCreate[afStudioUser::USERNAME]);
            
        // Create new user
        afStudioUser::create($user->username, $aCreate, $path);
    }
    
}
