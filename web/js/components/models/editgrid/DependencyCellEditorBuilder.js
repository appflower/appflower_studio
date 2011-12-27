Ext.ns('afStudio.models');

/**
 * DependencyCellEditorBuilder plugin.
 * 
 * dependencies:
 *     afStudio.models.TypeBuilder
 * 
 * @class afStudio.models.DependencyCellEditorBuilder
 * @extends Ext.util.Observable
 * @author Nikolai Babinski
 */
afStudio.models.DependencyCellEditorBuilder = Ext.extend(Ext.util.Observable, {

	/**
	 * @cfg {Field} defaultEditor The initial editor for a dependency column 
	 */
	defaultEditor : null,
	
	/**
	 * @cfg {String} mainDataIndex The dataIndex of main "control" column
	 */
	mainDataIndex : 'type',
	
	/**
	 * @cfg {String} dependencyDataIndex The dependency dataIndex
	 */
	dependencyDataIndex : 'default',	

	/**
	 * @cfg {String} sizeDataIndex The size dataIndex
	 */
	sizeDataIndex : 'size',

    /**
     * @property grid The applied grid
     * @type {Ext.grid.GridPanel}
     */
    grid : null,
    
	/**
	 * Plugin's entry point.
	 * @param {Ext.grid.EditorGridPanel} grid
	 */
	init : function(grid) {
		this.grid = grid;
        
		this.grid.on({
            scope: this,
            
			beforeedit: this.onGridBeforeEdit
		});	
	},
    
    /**
     * <u>beforeedit</u> event listener.
     * for more details look at {@link Ext.grid.EditorGridPanel#beforeedit}   
     * @param {Object} e
     */
    onGridBeforeEdit : function(e) {        
        var   me = this,         
        columnIndex = e.column,
             record = e.grid.getStore().getAt(e.row),
                 cm = e.grid.getColumnModel(),
          fieldName = cm.getDataIndex(columnIndex),
               type = record.get(me.mainDataIndex),
               size = record.get(me.sizeDataIndex),
             editor;
        
        if (fieldName == me.dependencyDataIndex) {
            //restore default editor
            if (this.defaultEditor) {
                cm.config[columnIndex].editor = this.defaultEditor;
            }
            
            editor = afStudio.models.TypeBuilder.createEditor(type, size);
            
            this.defaultEditor = cm.config[columnIndex].editor;
            cm.config[columnIndex].editor = editor ? editor : this.defaultEditor;
        }
    }
});

/**
 * Registers plugin
 */
Ext.preg('cellEditorBuilder', afStudio.models.DependencyCellEditorBuilder);