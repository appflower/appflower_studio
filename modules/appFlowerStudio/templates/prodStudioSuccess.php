<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/cache/af.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.WSUrlsClass.js"></script>
<script type="text/javascript">
	afStudioWSUrls = new afStudio.WSUrlsClass();
</script>

<script type="text/javascript">
var afStudioConsoleCommands='<?php echo afStudioConsole::getCommands(false); ?>';
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
</script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/cache/afStudio.js"></script>

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/xtheme-blue.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/css/my-extjs.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/rowactionsImm/css/Ext.ux.GridRowActions.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/rowactionsImm/css/icons.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/form/lovcombo-1.0/css/Ext.ux.form.LovCombo.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/grid-filtering/resources/style.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/portal/portal.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/css/main.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/grid/Ext.ux.grid.RowEditor.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/css/afStudio.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/js/filetree/css/filetype.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/js/filetree/css/filetree.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/js/filetree/css/icons.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/form/groupingcombobox/Ext.ux.form.GroupingComboBox.css" />

<?php
$appFlowerStudioPluginCssPath = sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/web/css/';

$afStudioCssExtensions=sfFinder::type('file')->name('afStudio.*.css')->in($appFlowerStudioPluginCssPath);
foreach ($afStudioCssExtensions as $afStudioCssExtension)
{
?>
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/css/<?php echo basename($afStudioCssExtension); ?>" />
<?php }?>

<script type="text/javascript">
Ext.onReady(afStudio.init, afStudio);
</script>

<div id="toolbar-container-el"></div>