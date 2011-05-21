Ext.ns('afStudio.models');

/**
 * DependencyCellEditorBuilder plugin
 * 
 * dependencies:
 *     afStudio.models.TypeBuilder
 * 
 * @class Ext.ux.grid.EditorPlugin
 * @extends Ext.util.Observable
 * @author Nikolay
 */
afStudio.models.DependencyCellEditorBuilder = Ext.extend(Ext.util.Observable, {

	/**
	 * @cfg grid
	 * Applied grid 
	 */
	grid : null
	
	/**
	 * @cfg defaultEditor
	 * Stores the initial editor for a dependency column 
	 */
	,defaultEditor : null
	
	/**
	 * @cfg mainDataIndex 
	 * dataIndex of main (control) column
	 */
	,mainDataIndex : 'type'
	
	/**
	 * @cfg dependencyDataIndex
	 * dependency dataIndex
	 */
	,dependencyDataIndex : 'default'	

	/**
	 * @cfg sizeDataIndex 
	 * size dataIndex
	 */
	,sizeDataIndex : 'size'
	
	/**
	 * <u>beforeedit</u> event listener
	 * for more details look at {@link Ext.grid.EditorGridPanel#beforeedit}   
	 * @param {Object} e
	 */
	,onGridBeforeEdit : function(e) {		
		var   _this = this,			
		columnIndex = e.column,
		     record = e.grid.getStore().getAt(e.row),
			     cm = e.grid.getColumnModel(),
		  fieldName = cm.getDataIndex(columnIndex),
			   type = record.get(_this.mainDataIndex),
			   size = record.get(_this.sizeDataIndex),
			 editor;
		
		if (fieldName == _this.dependencyDataIndex) {
			//restore default editor
			if (this.defaultEditor) {
				cm.config[columnIndex].editor = this.defaultEditor;
			}
			
			editor = afStudio.models.TypeBuilder.createEditor(type, size);
			
			this.defaultEditor = cm.config[columnIndex].editor;
			cm.config[columnIndex].editor = editor ? editor : this.defaultEditor;
		}
	}//eo onGridCellClick
	
	/**
	 * Plugin's entry point
	 * @param {Ext.grid.EditorGridPanel} grid
	 */
	,init : function(grid) {
		this.grid = grid;
		this.grid.on({
			beforeedit: Ext.util.Functions.createDelegate(this.onGridBeforeEdit, this)
		});	
	}//eo init	
	
});

/**
 * Registers plugin
 */
Ext.preg('cellEditorBuilder', afStudio.models.DependencyCellEditorBuilder);