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
        // ini set for windows
        ini_set("max_execution_time", "300");
        
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
    
    /**
     * Getting yml helper definition
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGetHelper()
    {
        $response = afResponseHelper::create();
        
        $place = $this->getParameter('place', 'frontend');
        $place_type = $this->getParameter('place_type', 'app');
        $key = $this->getParameter('key', '');
        
        $helper_path = afExtjsBuilderParser::getHelperPath($place, $place_type);
        if (!file_exists($helper_path)) return $response->success(false)->message("Helper for '{$place_type}s/{$place}' doesn't exists");
        
        return $response->success(true)->data(array(), afExtjsBuilderParser::create($helper_path)->parse()->get($key), 0);
    }
    
    /**
     * Saving yml helper definition
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processSaveHelper()
    {
        $response = afResponseHelper::create();
        
        $place = $this->getParameter('place', 'frontend');
        $place_type = $this->getParameter('place_type', 'app');
        $content = json_decode($this->getParameter('content'), true);
        $key = $this->getParameter('key', '');
        
        $helper_path = afExtjsBuilderParser::getHelperPath($place, $place_type);
        if (file_exists($helper_path)) {
            if (!is_writable($helper_path)) return $response->success(false)->message("Please check permissions on helper file");
            $definition = afExtjsBuilderParser::create($helper_path)->parse()->get();
        } else {
            if (!is_writable(dirname($helper_path))) return $response->success(false)->message("Please check permissions on folder for helper file");
            $definition = array();
        }
        
        (!empty($key)) ? ($definition[$key] = $content) : ($definition = $content);
        
        $status = file_put_contents($helper_path, sfYaml::dump($definition, 8));
        
        return $response->success($status)->message(($status) ? "Helper has been successfully saved" : "Some problems occured while save processing");
    }
    
}
