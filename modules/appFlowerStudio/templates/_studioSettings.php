<script type="text/javascript">
var afStudioConsoleCommands = '<?php echo afStudioConsole::getCommands(false); ?>';
var afStudioUser = <?php echo html_entity_decode($afStudioUser); ?>;
var afStudioHost = { 
	name: '<?php echo afStudioConsole::getInstance()->getUnameShort();?>',
	user: '<?php echo afStudioConsole::getInstance()->getWhoami();?>' 
};
<?php
    $projectPath = sfConfig::get('sf_root_dir');
    $projectInPath = explode('/',$projectPath);
    unset($projectInPath[count($projectInPath)-1]);
    $projectInPath = implode('/',$projectInPath);
?>
var afProjectInPath = '<?php echo $projectInPath; ?>';
var afTemplateConfig = <?php echo json_encode(afStudioUtil::getTemplateConfig()); ?>;
var afStudioProjectsManagementEnabled = <?php echo (sfConfig::get('app_afs_projects_management_enabled') ? 'true' : 'false'); ?>;
</script>
