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
        $afServiceClient = afStudioUtil::getAfServiceClient();
        
        $response = $afServiceClient->CreateProject(
            $this->getParameter('name'),
            $userForm['email'],
            "$userForm[first_name] $userForm[last_name]",
            $userForm['username'],
            $userForm['password']
        );

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
        
        if (file_exists(afStudioProjectCommandHelper::getPhpHelperPath($key, $place, $place_type))) {
            $response->message("You have redefined helper file in '{$place_type}/{$place}'. Changes that you will made here may not be available.");
        }
        
        $helper_path = afExtjsBuilderParser::getHelperPath($place, $place_type);
        if (!file_exists($helper_path)) $helper_path = afExtjsBuilderParser::getHelperPath('appFlowerPlugin', 'plugin');
        
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
        $filesystem = afsFileSystem::create();
        
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
            
            $filesystem->touch($helper_path);
            $filesystem->chmod($helper_path, 0777);
        }
        
        (!empty($key)) ? ($definition[$key] = $content) : ($definition = $content);
        
        $status = file_put_contents($helper_path, sfYaml::dump($definition, 8));
        
        return $response->success($status)->message(($status) ? "Helper has been successfully saved" : "Some problems occured while save processing");
    }
    
    /**
     * Process getting wallpapers list
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processGetWallpapers()
    {
        $web_dir = sfConfig::get('sf_web_dir');
        $files = array();
        
        $place = $this->getParameter('place', 'frontend');
        $place_type = $this->getParameter('place_type', 'app');
        
        $default_prefix = "/appFlowerPlugin/extjs-3/plugins/desktop/wallpapers/";
        $default_area = sfConfig::get('sf_plugins_dir') . "/appFlowerPlugin/web/extjs-3/plugins/desktop/wallpapers/";
        
        $finder = sfFinder::type('file')->maxdepth(0)->name('*.jpg', '*.jpeg', '*.JPG', '*.JPEG', '*.png', '*.PNG');
        
        foreach ($finder->in($default_area, "{$web_dir}/images/desktop/wallpapers/") as $key => $file) {
            $files[] = array(
                'id' => $key,
                'name' => pathinfo($file, PATHINFO_BASENAME),
                'image' => (strpos($file, $default_area) !== false) ? str_replace($default_area, $default_prefix, $file) : str_replace($web_dir, '', $file),
            );
        }
        
        $data = array(
            'list' => $files,
            'active_image' => afStudioProjectCommandHelper::getActiveBackground($place, $place_type),
            'active_color' => afStudioProjectCommandHelper::getActiveBackground($place, $place_type, afStudioProjectCommandHelper::BACKGROUND_TYPE_COLOR),
        );
        
        return afResponseHelper::create()->success(true)->data(array(), $data, 0);
    }
    
    /**
     * Set wallpaper action
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processSetWallpaper()
    {
        $response = afResponseHelper::create();
        
        $place = $this->getParameter('place', 'frontend');
        $place_type = $this->getParameter('place_type', 'app');
        $path = $this->getParameter('path');
        $color = $this->getParameter('color');
        
        if (empty($path) && empty($color)) return $response->success(false)->message("You should provide path for background wallpaper or background color");
        
        $app_path = sfConfig::get("sf_{$place_type}s_dir") . "/{$place}/config/app.yml";
        
        $app_config = array();
        if (file_exists($app_path)) $app_config = sfYaml::load($app_path);
        
        if (!empty($path)) {
            $app_config['all'][afStudioProjectCommandHelper::CONFIG_APP_APPFLOWER][afStudioProjectCommandHelper::CONFIG_DESKTOP_BACKGROUND_IMAGE] = $path;
        }
        
        if (!empty($color)) {
            $app_config['all'][afStudioProjectCommandHelper::CONFIG_APP_APPFLOWER][afStudioProjectCommandHelper::CONFIG_DESKTOP_BACKGROUND_COLOR] = $color;
        }
        
        $is_saved = file_put_contents($app_path, sfYaml::dump($app_config, 4));
        
        return $response->success($is_saved)->message(($is_saved) ? "Wallpaper has been successfully saved" : "Some problems occured while save processing");
    }
    
    /**
     * Upload action
     *
     * @return afResponse
     * @author Sergey Startsev
     */
    protected function processUploadWallpaper()
    {
        $response = afResponseHelper::create();
        $wallpaper_folder = "/images/desktop/wallpapers";
        $folder = sfConfig::get('sf_web_dir') . $wallpaper_folder;
        
        if (!file_exists($folder)) mkdir($folder, 0777, true);
        
        if (!file_exists($folder)) return $response->success(false)->message("Can't create folder '{$wallpaper_folder}' in web area. Please check permissions");
        if (!is_writable($folder)) return $response->success(false)->message("Folder '{$wallpaper_folder}' is not writable. Please check permissions");
        
        if (!empty($_FILES) && array_key_exists('wallpaper', $_FILES) && ($params = $_FILES['wallpaper']) && ($params['size'] > 0) ) {
            $extension = pathinfo($params['name'], PATHINFO_EXTENSION);
            $fileName = Util::stripText(pathinfo($params['name'], PATHINFO_FILENAME)) . ".{$extension}";
            
            if (!move_uploaded_file($params["tmp_name"], "{$folder}/{$fileName}" )) return $response->success(false)->message("Can't upload wallpaper");
            
            $data = array(
                'path' => "{$wallpaper_folder}/{$fileName}",
            );
            
            return $response->success(true)->data(array(), $data, 0);
        }
        
        return $response->success(false)->message("You haven't defined any wallpaper for upload");
    }
    
}
