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
	name: '<?php echo afStudioConsole::getInstance()->getUnameShort();?>',
	user: '<?php echo afStudioConsole::getInstance()->getWhoami();?>' 
};
<?php $projectPath = sfConfig::get('sf_root_dir'); $projectInPath = explode('/',$projectPath); unset($projectInPath[count($projectInPath)-1]); $projectInPath = implode('/',$projectInPath);?>
var afProjectInPath = '<?php echo $projectInPath; ?>';
var afTemplateConfig = <?php echo json_encode(afStudioUtil::getTemplateConfig()); ?>;
</script>

<!-- engine ux -->
<!-- ========== -->
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/datetime/Ext.ux.form.DateTime.js"></script>

<!-- multiselect (multicombo) -->
<link rel="stylesheet" type="text/css" href="/appFlowerPlugin/extjs-3/plugins/multiselect/multiselect.css" />
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/multiselect/DDView.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/multiselect/MultiSelect.js"></script>
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/multiselect/ItemSelector.js"></script>

<!-- doublemulticombo -->
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/multiselect/Ext.ux.plugins.ItemSelectorAutoSuggest.js"></script>

<!-- doubletree -->
<script type="text/javascript" src="/appFlowerPlugin/extjs-3/plugins/multiselect/Ext.ux.TreeItemSelector.js"></script>
<!-- ========== -->

<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.xhr.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/afStudio.WSUrlsClass.js"></script>

<!-- logger -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/log/Console.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/log/Logger.js"></script>

<!-- custom ext ux -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/Ext.ux.DataDrop.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/form/GroupingComboBox.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/grid/PagingRowNumberer.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tab/TabCloseMenu.js"></script>

<!-- filetree -->
<link rel="stylesheet" type="text/css" href="/appFlowerStudioPlugin/js/custom/tree/filetree/css/filetype.css" />
<link rel="stylesheet" type="text/css" href="/appFlowerStudioPlugin/js/custom/tree/filetree/css/filetree.css" />
<link rel="stylesheet" type="text/css" href="/appFlowerStudioPlugin/js/custom/tree/filetree/css/icons.css" />
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/filetree/js/Ext.ux.FileTreePanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/filetree/js/Ext.ux.FileTreeMenu.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/filetree/js/Ext.ux.form.BrowseButton.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/filetree/js/Ext.ux.FileUploader.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/filetree/js/Ext.ux.UploadPanel.js"></script>

<!-- treegrid -->
<link rel="stylesheet" type="text/css" href="/appFlowerStudioPlugin/js/custom/tree/treegrid/treegrid.css" /> 
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/treegrid/TreeGridSorter.js"></script> 
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/treegrid/TreeGridColumnResizer.js"></script> 
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/treegrid/TreeGridNodeUI.js"></script> 
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/treegrid/TreeGridLoader.js"></script> 
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/treegrid/TreeGridColumns.js"></script> 
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/tree/treegrid/TreeGrid.js"></script>

<!-- ace code-editor -->
<script src="/appFlowerStudioPlugin/js/ace/src/ace.js" type="text/javascript" charset="utf-8"></script> 
<script src="/appFlowerStudioPlugin/js/ace/src/mode-textile.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/mode-javascript.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/mode-css.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/mode-html.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/mode-json.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/mode-markdown.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/mode-php.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/mode-xml.js" type="text/javascript" charset="utf-8"></script>
<script src="/appFlowerStudioPlugin/js/ace/src/theme-twilight.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/custom/ace/Ext.ux.AceComponent.js"></script>
<!-- end of custom ext ux -->

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
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/TypeComboBox.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/TypeBuilder.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/relationcombo/RelationPicker.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/relationcombo/RelationCombo.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/relationcombo/ModelTree.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/editgrid/FieldsGrid.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/models/modelgrid/ModelStore.js"></script>
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

<!-- appflower view model -->
	<!-- data type -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/base/Type.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/base/Number.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/Auto.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/String.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/Integer.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/Float.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/Boolean.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/Date.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/TypeRestrictions.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/type/SchemaTypes.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/data/Types.js"></script>
	<!-- model -->
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
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Title.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Param.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Params.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/Description.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/AlternateDescriptions.js"></script>
		<!-- widget -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Actions.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Action.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/If.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Column.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Confirm.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Datasource.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Class.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Fields.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Grouping.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Method.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Ref.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Set.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Handler.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Button.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Field.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Item.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Link.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Radiogroup.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Source.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Trigger.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Validator.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Value.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/model/widget/Window.js"></script>
	<!-- definition -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/definition/error/DefinitionError.js"></script>	
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/definition/DataDefinition.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/definition/ViewDefinition.js"></script>
	<!-- controller -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/controller/BaseController.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/controller/ViewController.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/controller/error/ControllerError.js"></script>
	<!-- view -->
		<!-- inspector tree -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/InspectorTree.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/InspectorLoader.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/InspectorSorter.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/error/LoaderError.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/base/TreeNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/base/ContainerNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/RootNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/ColumnNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/MethodNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/HandlerNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/RefNode.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/inspectorTree/node/SetNode.js"></script>
		<!-- property grid -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/propertyGrid/PropertyStore.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/propertyGrid/PropertyColumnModel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/appflower/view/propertyGrid/PropertyGrid.js"></script>
<!-- end of appflower view model -->

<!-- widget designer -->
	<!-- gui views -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/ModelInterface.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/ModelMapper.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/ModelReflector.js"></script>
		<!-- list -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/list/ListModelInterface.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/list/ListModelReflector.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/list/ListGridView.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/list/ActionColumn.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/list/ListView.js"></script>
		<!-- edit -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/edit/EditModelInterface.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/edit/EditModelReflector.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/gui/edit/EditView.js"></script>
	<!-- containers -->
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WD.js"></script>	
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WidgetsBuilder.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/designer/InspectorPalette.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/designer/DesignerPanel.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/designer/ModelErrorWindow.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/codeEditor/Editor.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/Designer.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/tabs/CodeEditor.js"></script>
<script type="text/javascript" src="/appFlowerStudioPlugin/js/components/widgetDesigner/WidgetDesigner.js"></script>
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
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/form/lovcombo-1.0/css/Ext.ux.form.LovCombo.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/grid-filtering/resources/style.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/portal/portal.css" />
<link rel="stylesheet" type="text/css" media="screen" href="/css/main.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerPlugin/extjs-3/plugins/grid/Ext.ux.grid.RowEditor.css" />

<link rel="stylesheet" type="text/css" media="screen" href="/appFlowerStudioPlugin/css/afStudio.css" />

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

