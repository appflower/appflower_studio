<?php
/**
 * Studio Project Command Class
 * 
 * @author Radu Topala <radu@appflower.com>
 * @author Sergey Startsev <startsev.sergey@gmail.com>
 */
class afStudioProjectCommand extends afBaseStudioCommand
{
    /**
     * Save wizard processing
     * 
     * @return afResponse
     * @author Radu Topala
     * @author Sergey Startsev
     */
    protected function processSaveWizard()
    {
        $userForm = json_decode($this->getParameter('userForm'), true);
        $databaseForm = json_decode($this->getParameter('databaseForm'), true);

        $afServiceClient = afStudioUtil::getAfServiceClient();
        $response = $afServiceClient->CreateProject($this->getParameter('name'), $userForm['email'], "$userForm[first_name] $userForm[last_name]");

        if ($response->isSuccess()) {
            
            $message = 'Project created!.<br />';
            $success = true;
            
            $data = $response->getData();
            $project = $data['project'];
            if ($project['url']) {
                $message .= "You can access it with this URL: <a target=\"_blank\" href=\"http://$project[url]\">$project[url]</a>";
            } else {
                $message .= "It looks like virtual host was not properly created. Path to your project is: $project[path]";
            }
        } else {
            $success = false;
            $message = 'Sorry but project was not created due to some errors.';
        }        
        
        return afResponseHelper::create()->success($success)->message($message);
                
    }
    
    /**
     * Execute run controller
     * 
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processRun()
    {
        return afResponseHelper::create()->success(true)->console(afStudioProjectCommandHelper::processRun());
    }
    
    /**
     * Checks if current project environment is a valid git repository
     * and if it is a studio playground repository
     * 
     * @return afResponse
     */
    protected function processCheckConfig()
    {
        $response = afResponseHelper::create();
        $afServiceClient = afStudioUtil::getAfServiceClient();
        if ($afServiceClient) {
            return $response->success(true);
        } else {
            return $response->success(false);
        }
    }
    
    /**
     * Export project functionality
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processExport()
    {
        $response = afResponseHelper::create();
        
        $by_os = $this->getParameter('by_os', 'false');
        $type = $this->getParameter('type', 'project');
        
        $path = $this->getParameter('path', sys_get_temp_dir());
        if (substr($path, -1, 1) != DIRECTORY_SEPARATOR) $path .= DIRECTORY_SEPARATOR;
        
        $name = $this->getParameter('name', pathinfo(afStudioUtil::getRootDir(), PATHINFO_BASENAME));
        
        $console_result = afStudioConsole::getInstance()->execute("sf afs:export --type={$type} --by_os={$by_os} --path={$path} --project_name={$name}");
        $postfix = ($type == 'db') ? 'sql' : 'tar.gz';
        
        if (!file_exists("{$path}{$name}.{$postfix}")) return $response->success(false)->message('Please check permissions, and propel settings');
        
        return $response->success(true)->data(array(), array('name' => $name, 'file' => "{$name}.{$postfix}", 'path' => $path), 0)->console($console_result);
    }
}
