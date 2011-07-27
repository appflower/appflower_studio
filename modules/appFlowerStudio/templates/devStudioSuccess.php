<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Waiting+for+the+Sunrise">

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/adapter/ext/ext-base-debug.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/ext-all-debug.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/js/custom/Ext.CrossDomain.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/widgetJS.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/BorderLayoutOverride.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/gridUtil.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/overrides/Override.Ext.data.SortTypes.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/overrides/Override.Ext.form.Field.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/overrides/Override.Fixes.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/plugins/Ext.ux.Notification.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/layout/AccordionLayoutSetActiveItem.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/portal/Ext.ux.MaximizeTool.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/form/Ext.ux.form.Combo.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/form/Ext.ux.plugins.HelpText.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/plugins/Ext.ux.plugins.RealtimeWidgetUpdate.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid/Ext.ux.GridColorView.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid/Ext.ux.GroupingColorView.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid/Ext.ux.Grid.GroupingStoreOverride.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid/RowExpander.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/cheatJS.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/rowactionsImm/js/Ext.ux.GridRowActions.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/form/lovcombo-1.0/js/Ext.ux.form.LovCombo.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/treegrid/Ext.ux.CheckboxSelectionModel.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/menu/EditableItem.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/menu/ComboMenu.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/menu/RangeMenu.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/GridFilters.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/DrillFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/RePositionFilters.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/SaveSearchState.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/FilterInfo.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/filter/Filter.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/filter/BooleanFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/filter/ComboFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/filter/DateFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/filter/ListFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/filter/NumericFilter.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid-filtering/ux/grid/filter/StringFilter.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/portal/sample-grid.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/js/custom/portalsJS.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/form/Ext.ux.ClassicFormPanel.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/grid/Ext.ux.grid.RowEditor.js"></script>

<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/form/groupingcombobox/Ext.ux.form.GroupingComboBox.js"></script>

<script type="text/javascript">
var afStudioConsoleCommands='<?php echo afStudioConsole::getCommands(false); ?>';
var afStudioUser = <?php echo html_entity_decode($afStudioUser);?>;
var afStudioHost = { 
	name: '<?php echo afStudioConsole::getInstance()->uname_short;?>',
	user: '<?php echo afStudioConsole::getInstance()->whoami;?>' 
};
<?php $projectPath = sfConfig::get('sf_root_dir'); $projectInPath = explode('/',$projectPath); unset($projectInPath[count($projectInPath)-1]); $projectInPath = implode('/',$projectInPath);?>
var afProjectInPath = '<?php echo $projectInPath; ?>';
var afTemplateConfig = <?php echo json_encode(afStudioUtil::getTemplateConfig()); ?>;
</script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.xhr.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.WSUrlsClass.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.DataDrop.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/form/GroupingComboBox.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/grid/PagingRowNumberer.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tab/TabCloseMenu.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/codepress/Ext.ux.CodePress.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/TypeComboBox.js"></script>

<!-- Error -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/error/ApsError.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/notification/MessageBox.js"></script>

<!-- CLI -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/cli/CommandLine.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/cli/AuditLog.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/cli/Console.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/cli/Debug.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/cli/WindowWrapper.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/cli/CommandLineMgr.js"></script>

<!-- Navigation -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/navigation/BaseItemTreePanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/navigation/ModelItem.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/navigation/LayoutItem.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/navigation/WidgetItem.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/navigation/PluginItem.js"></script>

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
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/dbQuery/query/QueryResultsTab.js"></script>
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
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/tabbed/TabbedViewCloseMenuPlugin.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/tabbed/TabViewPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/ViewMessageBox.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/NormalView.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/TabbedView.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/view/Page.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/DesignerPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/TabNamePickerWindow.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/layoutDesigner/WidgetSelectorTreeWindow.js"></script>

<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.FileTreePanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.FileTreeMenu.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.form.BrowseButton.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.FileUploader.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/filetree/js/Ext.ux.UploadPanel.js"></script>

<!-- appflower view model -->
	<!-- model -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/type/Types.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/template/ModelNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/template/BaseTemplate.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/template/Templates.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/base/Node.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/base/TypedNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/base/Property.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Root.js"></script>
		<!-- model errors -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/error/NodeError.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/error/PropertyError.js"></script>
		<!-- general -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Param.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Params.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Description.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/AlternateDescriptions.js"></script>
		<!-- widget -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Actions.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Column.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Confirm.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Datasource.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Fields.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Grouping.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Method.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Ref.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Set.js"></script>
	<!-- definition -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/definition/error/DefinitionError.js"></script>	
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/definition/DataDefinition.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/definition/ViewDefinition.js"></script>
	<!-- controller -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/controller/BaseController.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/controller/error/ControllerError.js"></script>
	<!-- view -->
		<!-- inspector tree -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/InspectorTree.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/InspectorLoader.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/InspectorSorter.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/error/LoaderError.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/base/TreeNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/base/ContainerNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/ColumnNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/MethodNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/RootNode.js"></script>
		<!-- property grid -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/propertyGrid/PropertyStore.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/propertyGrid/PropertyColumnModel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/propertyGrid/PropertyGrid.js"></script>
			
<!-- end of appflower view model -->

<!-- widgetDesigner -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.TabMenu.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeBehaviors/base/BaseBehavior.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeBehaviors/WithIParamsBehavior.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeBehaviors/WithNamePropertyAsLabelBehavior.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeBehaviors/WithValueTypeBehavior.js"></script>
	<!-- wi nodeTypes -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/base/BaseNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/base/ContainerNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/base/CollectionNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/base/FieldsNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/base/NodeBuilder.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/ActionNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/ColumnNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/DatasourceNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/FieldNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/FieldNodeValueSourceNodes.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/ParamNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/ValidatorNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/nodeTypes/ValidatorsNode.js"></script>
	<!-- wi propertyType -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/base/PropertyGrid.js"></script>	
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/base/PropertyBaseType.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/base/PropertyTypeBoolean.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/base/PropertyTypeChoice.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/base/PropertyTypeString.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/FieldType.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/ValueSource.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/ValueType.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/propertyType/AlignType.js"></script>
	<!-- wi rootNodeTypes -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/rootNodeTypes/ObjectRootNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/rootNodeTypes/EditNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/rootNodeTypes/ListNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/rootNodeTypes/HtmlNode.js"></script>
	<!-- wi components -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/WidgetInspectorTree.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/InspectorPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/inspector/InspectorPalette.js"></script>
	<!-- wd gui -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/designer/list/ListMetaProcessor.js"></script>	
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/designer/list/ListGridView.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/designer/list/Column.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/designer/list/SimpleListView.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/designer/GuiFactory.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/designer/DesignerPanel.js"></script>
	<!-- wd -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WidgetFactory.js"></script>	
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WidgetDefinition.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WidgetsBuilder.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/designer/DesignerPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/DesignerTab.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/CodeEditorTab.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WidgetTabPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WidgetPanel.js"></script>
<!-- end of widgetDesigner -->

<?php 
$appFlowerStudioPluginJsPath = sfConfig::get('sf_root_dir').'/plugins/appFlowerStudioPlugin/web/js/';

$afStudioJsExtensions = sfFinder::type('file')->name('afStudio.*.js')->sort_by_name()->in($appFlowerStudioPluginJsPath);
foreach ($afStudioJsExtensions as $afStudioJsExtension)
{
?>
<script type="text/javascript" src="/appFlowerStudioPlugin/<?php echo strstr($afStudioJsExtension, 'js'); ?>"></script>
<?php }?>

<!-- welcome popup -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/jquery/jquery-1.4.4.min.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/jquery/jquery.jscrollpane.min.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/jquery/jquery.prettyPhoto.js"></script>

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

<body>
	<div id="toolbar-container-el"></div>
</body>

