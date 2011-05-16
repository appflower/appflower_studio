<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/cache/af.js"></script>
<script type="text/javascript">
var afStudioConsoleCommands = '<?php echo afStudioConsole::getCommands(false); ?>';
var is_visible_users = <?php echo (int)$userinfo['is_admin']; ?>;
var userinfo = {
    'username': "<?php echo $userinfo['username'] ?>",
    'name': "<?php echo $userinfo['name'] ?>"
};
var afStudioHost = { 
	name: '<?php echo afStudioConsole::getInstance()->uname_short;?>',
	user: '<?php echo afStudioConsole::getInstance()->whoami;?>' 
};
<?php $projectPath = sfConfig::get('sf_root_dir'); $projectInPath = explode('/',$projectPath); unset($projectInPath[count($projectInPath)-1]); $projectInPath = implode('/',$projectInPath);?>
var afProjectInPath = '<?php echo $projectInPath; ?>';
var afTemplateConfig = <?php echo json_encode(afStudioUtil::getTemplateConfig()); ?>;
</script>
<script type="text/javascript" src="/appFlowerStudioPlugin/cache/afStudio.js"></script>

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/xtheme-blue.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/cache/afStudio.css" />

<script type="text/javascript">
	Ext.onReady(afStudio.init, afStudio);
</script>

<div id="toolbar-container-el"></div>