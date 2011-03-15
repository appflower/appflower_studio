<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base-debug.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all-debug.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/Ext.CrossDomain.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.WSUrlsClass.js"></script>
<script type="text/javascript">
window.afStudioWSUrls = new afStudio.WSUrlsClass();
</script>

<script type="text/javascript" src="/appFlowerPlugin/js/custom/widgetJS.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/BorderLayoutOverride.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/js/custom/gridUtil.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/overrides/Override.Ext.data.SortTypes.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/overrides/Override.Ext.form.Field.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/overrides/Override.Fixes.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/plugins/Ext.ux.Notification.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/layout/AccordionLayoutSetActiveItem.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/portal/Ext.ux.MaximizeTool.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/form/Ext.ux.form.Combo.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/form/Ext.ux.plugins.HelpText.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/plugins/Ext.ux.plugins.RealtimeWidgetUpdate.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid/Ext.ux.GridColorView.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid/Ext.ux.GroupingColorView.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid/Ext.ux.Grid.GroupingStoreOverride.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid/RowExpander.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/cheatJS.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/rowactionsImm/js/Ext.ux.GridRowActions.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/form/lovcombo-1.0/js/Ext.ux.form.LovCombo.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/treegrid/Ext.ux.CheckboxSelectionModel.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/menu/EditableItem.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/menu/ComboMenu.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/menu/RangeMenu.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/GridFilters.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/DrillFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/RePositionFilters.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/SaveSearchState.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/FilterInfo.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/filter/Filter.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/filter/BooleanFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/filter/ComboFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/filter/DateFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/filter/ListFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/filter/NumericFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid-filtering/ux/grid/filter/StringFilter.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/portal/sample-grid.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/portalsJS.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/form/Ext.ux.ClassicFormPanel.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/grid/Ext.ux.grid.RowEditor.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/examples/form/groupingcombobox/Ext.ux.form.GroupingComboBox.js"></script>

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

<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.DataDrop.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/form/GroupingComboBox.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/grid/PagingRowNumberer.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/codepress/Ext.ux.CodePress.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/TypeComboBox.js"></script>

<!-- Error -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/error/ApsError.js"></script>

<!-- Navigation -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/navigation/BaseItemTreePanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/navigation/LayoutItem.js"></script>

<!-- Viewport -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/viewport/StudioToolbar.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/viewport/StudioViewport.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/viewport/WestPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/viewport/SouthPanel.js"></script>

<!-- Portal -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/portal/Portal.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/portal/PortalColumn.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/portal/Portlet.js"></script>

<!-- models -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/TypeBuilder.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/relationcombo/RelationPicker.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/relationcombo/RelationCombo.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/relationcombo/ModelTree.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/editgrid/FieldsGrid.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/modelgrid/ModelGrid.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/modelgrid/EditFieldWindow.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/editgrid/DependencyCellEditorBuilder.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/ModelTab.js"></script>

<!-- dbQuery -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/query/QueryResultsGrid.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/table/DataGrid.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/table/StructureGrid.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/table/TableModelTab.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/QueryForm.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/DBStructureTree.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/ContentPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/QueryWindow.js"></script>

<!-- layoutDesigner -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/ViewFactory.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/MetaDataProcessor.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/NormalView.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/TabbedView.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/Page.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/DesignerPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/TabNamePickerWindow.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/WidgetSelectorWindow.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.FileTreePanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.FileTreeMenu.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.form.BrowseButton.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.FileUploader.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.UploadPanel.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.TabMenu.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/nodeBehaviors/base/afStudio.widgetDesigner.BaseBehavior.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/nodeTypes/base/afStudio.widgetDesigner.BaseNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/nodeTypes/base/afStudio.widgetDesigner.ContainerNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/nodeTypes/base/afStudio.widgetDesigner.CollectionNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/nodeTypes/base/afStudio.widgetDesigner.NodeBuilder.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/rootNodeTypes/afStudio.widgetDesigner.ObjectRootNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/propertyType/base/afStudio.widgetDesigner.PropertyBaseType.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/widgetDesigner/propertyType/base/afStudio.widgetDesigner.PropertyTypeChoice.js"></script>
<?php 
$appFlowerStudioPluginJsPath = sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/web/js/';

$afStudioJsExtensions = sfFinder::type('file')->name('afStudio.*.js')->sort_by_name()->in($appFlowerStudioPluginJsPath);
foreach ($afStudioJsExtensions as $afStudioJsExtension)
{
?>
<script type="text/javascript" src="/appFlowerStudioPlugin/<?php echo strstr($afStudioJsExtension, 'js'); ?>"></script>
<?php }?>


<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/resources/css/xtheme-blue.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/css/my-extjs.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/examples/rowactionsImm/css/Ext.ux.GridRowActions.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/examples/rowactionsImm/css/icons.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/examples/form/lovcombo-1.0/css/Ext.ux.form.LovCombo.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/examples/grid-filtering/resources/style.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/examples/portal/portal.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/css/main.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/examples/grid/Ext.ux.grid.RowEditor.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/css/afStudio.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/js/filetree/css/filetype.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/js/filetree/css/filetree.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/js/filetree/css/icons.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/examples/form/groupingcombobox/Ext.ux.form.GroupingComboBox.css" />

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

<body>
	<div id="toolbar-container-el"></div>
</body>

