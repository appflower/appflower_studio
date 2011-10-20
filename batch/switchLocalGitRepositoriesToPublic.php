#!/usr/bin/env php
<?php

/**
 * This script is made for use on projects created through studio iniside VM image
 * 
 * Such projects are created through cloning local repositories - this makes it very quick.
 * Unfortunately this also makes it harder to later update such projects
 * 
 * We are assuming that VM has internet access so knowing this - script will
 * switch back playground and all submodules repositories back to public github URL's
 * 
 * You should provide one mandatory argument:
 * * path to playground project directory
 * 
 * Example: ./switchLocalGitRepositoriesToPublic.php /home/lukas/workspace/newPlaygroundProject
 */

$localRepoCloner = new LocalGitRepositoryPublicSwitcher($argv);
$localRepoCloner->switchToPublic();
exit(0);

class LocalGitRepositoryPublicSwitcher
{
    function __construct($argv)
    {
        if (count($argv) < 2) {
            $this->reportFatalError('Please provide required argument with path to playground project directory');
        }

        $sourceGitRepository = realpath($argv[1]) . DIRECTORY_SEPARATOR;

        if (!is_dir($sourceGitRepository)) {
            $this->reportFatalError("Playground project git repository ($sourceGitRepository) could not be found");
        }

        if (!is_dir($sourceGitRepository.'.git')) {
            $this->reportFatalError("Playground project git repository ($sourceGitRepository) does not look like valid git repository");
        }

        $this->source = $sourceGitRepository;
    }
    
    private function reportFatalError($message)
    {
        echo $message."\nStopping work :|\n";
        exit(-1);
    }
    
    private function reportMessage($message)
    {
        echo $message."\n";
    }
    
    private function isRepositoryLinkedToPublicURL()
    {
    }
    
    public function switchToPublic()
    {
        chdir($this->source);
        
        $this->reportMessage("Checking remote of repository: $this->source");
        exec("git remote -v", $remoteStatus);
        if (strpos($remoteStatus[0], 'github')) {
//            $this->reportFatalError('Playground project "remote" looks like already likned to public URL');
        }
        
        $this->reportMessage("Switching remote to public URL for repository: $this->source");
        exec("git remote rm origin", $output, $retVal);
        if ($retVal !== 0) {
            $this->reportFatalError('Removing remote failed');
        }
        exec("git remote add origin git://github.com/appflower/appflower_studio_playground.git");
        if ($retVal !== 0) {
            $this->reportFatalError('Adding remote with public URL failed');
        }
        
        $submodules = explode('[submodule', file_get_contents($this->source.'.gitmodules'));
        
        foreach ($submodules as $submodule) {
            $submodule = trim($submodule);
            if ($submodule == '') {
                continue;
            }
            $this->switchSubmoduleToPublicURL($submodule);
        }
        
        
    }
    
    private function switchSubmoduleToPublicURL($submodule) {
        $parts = explode("\n", $submodule);
        if (count($parts) != 3) {
            return;
        }
        
        $path = str_replace('path = ', '', trim($parts[1]));
        $url = str_replace('url = ', '', trim($parts[2]));
        
        $this->reportMessage("Switching submodule: $path to public URL : $url");
        if (!is_dir($path)) {
            $this->reportFatalError("$path is not a directory ?");
        }
        
        exec("cd $path;git remote rm origin;git remote add origin $url");
    }
}
?>