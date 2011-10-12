<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/xtheme-blue.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/cache/af.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/cache/afStudio.css" />

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/cache/af.js"></script>

<script type="text/javascript">
var afStudioConsoleCommands = '<?php echo afStudioConsole::getCommands(false); ?>';
var afStudioUser = <?php echo html_entity_decode($afStudioUser); ?>;
var afStudioHost = { 
	name: '<?php echo afStudioConsole::getInstance()->getUnameShort();?>',
	user: '<?php echo afStudioConsole::getInstance()->getWhoami();?>' 
};
<?php $projectPath = sfConfig::get('sf_root_dir'); $projectInPath = explode('/',$projectPath); unset($projectInPath[count($projectInPath)-1]); $projectInPath = implode('/',$projectInPath);?>
var afProjectInPath = '<?php echo $projectInPath; ?>';
var afTemplateConfig = <?php echo json_encode(afStudioUtil::getTemplateConfig()); ?>;
</script>

<script type="text/javascript" src="/appFlowerStudioPlugin/cache/afStudio.js"></script>
<script src="/appFlowerStudioPlugin/js/ace/require.js" data-ace-base="/appFlowerStudioPlugin/js/ace/src" type="text/javascript" charset="utf-8"></script> 

<script type="text/javascript">
	Ext.onReady(afStudio.init, afStudio);
</script>

<div id="toolbar-container-el"></div>