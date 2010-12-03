Ext.ns('afStudio.models');

/**
 * DependencyCellEditorBuilder plugin
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
	 * Creates editor
	 * @param {String} key The model data type
	 * @return {Ext.Editor}
	 */
	,createEditer : function(key) {
		var editor = null;
		
		switch(key) {
			case 'boolean':
				editor = new Ext.form.ComboBox({
					typeAhead: true,
					triggerAction: 'all',
					lazyRender: true,
					editable: false,
					mode: 'local',
					valueField: 'field',
					displayField: 'field',
					store : [[true, 'true'], [false, 'false']]
	    		});
			break;
			
			case 'char': case 'varchar': case 'longvarchar': case 'timestamp':
				editor = new Ext.form.TextField();
			break;
			
			case 'bigint': case 'numeric': case 'decimal': case 'integer': case 'smallint':			
				editor = new Ext.form.NumberField({
					allowDecimals: false
				});							
			break;
			
			case 'tinyint':
				editor = new Ext.form.NumberField({
					autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: 3},
					maxValue: 255,
					allowDecimals: false
				});
			break;
			
			case 'real': case 'float': case 'double':
				editor = new Ext.form.NumberField();
			break;
				
			case 'date':
				editor = new Ext.form.DateField();
			break;
			
			case 'time':
				editor = new Ext.form.TimeField();
			break;
			
			case 'binary': case 'varbinary': case 'longvarbinary': case 'blob': case 'clob':
				editor = new Ext.form.DisplayField();
			break;
		}
				
		return editor ? new Ext.grid.GridEditor(editor) : null;
	}//eo createEditer

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
			 editor;
		
		if (fieldName == _this.dependencyDataIndex) {
			//restore default editor
			if (this.defaultEditor) {
				cm.config[columnIndex].editor = this.defaultEditor;
			}
			
			editor = _this.createEditer(type);
			
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