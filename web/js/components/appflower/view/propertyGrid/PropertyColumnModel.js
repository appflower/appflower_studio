Ext.ns('afStudio.view.property');

/**
 * PropertyColumnModel
 * 
 * @dependency {afStudio.data.Types} types
 * @dependency {Ext.grid} grid 
 * @dependency {Ext.form} fields 
 *  
 * @class afStudio.view.property.PropertyColumnModel
 * @extends Ext.grid.PropertyColumnModel
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.property.PropertyColumnModel = Ext.extend(Ext.grid.PropertyColumnModel, {

	requiredText : 'Required',
	
	constructor : function(grid, store) {
	    this.grid = grid;
	    
	    Ext.grid.PropertyColumnModel.superclass.constructor.call(this, 
	    [
	        {header: this.nameText, width: 50, sortable: true, dataIndex:'name', id: 'name', menuDisabled: true},
	        {header: this.valueText, width: 50, resizable: false, dataIndex: 'value', id: 'value', menuDisabled: true},
	        {header: this.requiredText, resizable: false, dataIndex: 'required', id: 'required', menuDisabled: true, hidden: true}
	    ]);
	    
	    this.store = store;
	
	    this.buildEditors();
	    
	    this.renderCellDelegate = this.renderCell.createDelegate(this);
	    this.renderPropDelegate = this.renderProp.createDelegate(this);
    },
    //eo constructor
	
    /**
     * Creates and initializes {@link #editors} object.
     * @protected
     */
    buildEditors : function() {
	    var types = afStudio.data.Types,
        	g = Ext.grid,
    		editors = {};
    	
    	for (var t in types) {
    		var type = types[t],
    			typeName = type.type;
    		
    		if (Ext.isFunction(type)) {
    			continue;
    		}
    		
    		editors[typeName] = new g.GridEditor(
    			type.editor({style: 'text-align: left;'})
    		);
    	}

	    this.editors = editors;
    },
    //eo buildEditors
    
    /**
     * Returns the editor defined for the cell/column.
     * @override
     * @protected
     * @param {Number} colIndex The column index
     * @param {Number} rowIndex The row index
     * @return {Ext.Editor} The {@link Ext.Editor Editor} that was created to wrap
     * the {@link Ext.form.Field Field} used to edit the cell.
     */
    getCellEditor : function(colIndex, rowIndex) {
        var p = this.store.getProperty(rowIndex),
            pt = p.get('type'),
            typeName = pt.type;
        
		//read-only properties can't be modified 
        if (p.get('readOnly')) {
        	return null;
        }
        if (this.grid.customEditors[typeName]) {
            return this.grid.customEditors[typeName];
        }
        if (this.editors[typeName]) {
            return this.editors[typeName];
        }
    },
    //eo getCellEditor
    
    /**
     * @override
     * @protected
     */
    renderCell : function(val, meta, rec) {
        var renderer = this.grid.customRenderers[rec.get('type')];
        if (renderer) {
            return renderer.apply(this, arguments);
        }
        if (rec.get('required') && Ext.isEmpty(rec.get('value'))) {
        	meta.attr = 'style="background-color:#E6052A;"';
        }
        var rv = val;
        if (Ext.isDate(val)) {
            rv = this.renderDate(val);
        } else if (typeof val == 'boolean') {
            rv = this.renderBool(val);
        }
        
        return Ext.util.Format.htmlEncode(rv);
    }    
});