#!/usr/bin/env php
<?php

/**
 * This script can clone any git repository following resursively also its submodules
 * 
 * It was made for cloning local repositories in order to remove need for internet connection while cloning
 * 
 * You should provide two mandatory arugments:
 * * path to source repository
 * * destination path for cloned repository
 * * optional branch name of source git repository that should be used
 * 
 * Example: ./cloneLocalGitRepository.php /home/lukas/workspace/AppFlower/appflower_studio_playground /home/lukas/workspace/newPlaygroundProject
 */

$localRepoCloner = new LocalGitRepositoryCloner($argv);
$localRepoCloner->cloneRepository();
exit(0);

class LocalGitRepositoryCloner
{
    function __construct($argv)
    {
        if (count($argv) < 3) {
            $this->reportFatalError('Please provide at least two arguments (look inside the script for description)');
        }

        $sourceGitRepository = realpath($argv[1]) . DIRECTORY_SEPARATOR;
        $destinationPath = $argv[2] . DIRECTORY_SEPARATOR;

        if (!is_dir($sourceGitRepository)) {
            $this->reportFatalError("Source git repository ($sourceGitRepository) could not be found");
        }

        if (!is_dir($sourceGitRepository.'.git')) {
            $this->reportFatalError("Source git repository ($sourceGitRepository) does not look like valid git repository");
        }

        if (file_exists($destinationPath)) {
            $this->reportFatalError("Destination directory ($destinationPath) should not exist. This script will create it. Please remove it and rerun the script.");
        }
        
        $this->source = $sourceGitRepository;
        $this->destination = $destinationPath;
        if (isset($argv[3])) {
            $this->branch = $argv[3];
        }
    }
    
    private function reportFatalError($message)
    {
        echo $message."\n";
        exit(-1);
    }
    
    private function reportMessage($message)
    {
        echo $message."\n";
    }
    
    public function cloneRepository()
    {
        if (@$this->branch) {
            system(sprintf("git clone %s %s -b %s", $this->source, $this->destination, $this->branch), $returnValue);
        } else {
            system(sprintf("git clone %s %s", $this->source, $this->destination), $returnValue);
        }
        
        if ($returnValue !== 0) {
            $this->reportFatalError('Cloning base repository failed');
        }
        
        $this->cloneSubmodules($this->source, $this->destination);
    }
    
    private function cloneSubmodules($source, $destination)
    {
        $source .= (substr($source, -1) == DIRECTORY_SEPARATOR ? '' : DIRECTORY_SEPARATOR);
        $originalWorkingDir = getcwd();
        chdir($destination);

        $submodulesStatus = array();
        $this->reportMessage("Looking for submodules in $source");
        exec('git submodule status', $submodulesStatus);

        foreach ($submodulesStatus as $submoduleStatus) {
            $ssParts = explode(' ', $submoduleStatus);
            $submodulePath = $ssParts[1];
            $submoduleSourcePath = $source.$submodulePath;
            $cmd = sprintf("git clone $submoduleSourcePath $submodulePath");
            $this->reportMessage("Running '$cmd'");
            system($cmd, $retVal);
            
            if ($retVal !== 0) {
                $this->reportFatalError('Cloning submodule failed');
            }
            
            $this->cloneSubmodules($submoduleSourcePath, $submodulePath);
        }
        
        chdir($originalWorkingDir);
    }
}
?>