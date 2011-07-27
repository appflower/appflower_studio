Ext.ns('afStudio.view.property');

/**
 * PropertyColumnModel
 * 
 * @dependency 
 * Types {afStudio.model.Types}
 * Grid {Ext.grid}
 * Fields {Ext.form}
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
     * @protected
     */
    buildEditors : function() {
        var g = Ext.grid,
	        f = Ext.form,
	        types = afStudio.model.Types,
    		editors = {};
    	
    	for (var t in types) {
    		var type     = types[t],
    			typeName = type.type;
    		
    		if (Ext.isFunction(type)) {
    			continue;
    		}
    		
    		var validator = Ext.util.Functions.createDelegate(type.validate, type);
    		
    		if (type.values) {
    			var store = [];
    			for (var i = 0, len = type.values.length; i < len; i++) {
    				store.push([type.values[i], type.values[i]]);
    			}
    			
    			editors[typeName] = new Ext.grid.GridEditor(
    				new Ext.form.ComboBox({
						editable: true,
						typeAhead: true,
						forceSelection: true,
						lazyRender: true,
						local: true,
						store: store,
						triggerAction: 'all',
						validator: validator
				}));
				
    		} else {
			    var bfield = new f.Field({
			        autoCreate: {tag: 'select', children: [
			            {tag: 'option', value: 'true', html: this.trueText},
			            {tag: 'option', value: 'false', html: this.falseText}
			        ]},
			        getValue : function() {
			            return this.el.dom.value == 'true';
			        }
			    });
			    
    			switch (type) {
    				case types.INTEGER:
    					editors[typeName] = new g.GridEditor(new f.NumberField({selectOnFocus:true, style:'text-align:left;', validator: validator}));
    				break;
    				case types.BOOLEAN:
    					editors[typeName] = new g.GridEditor(bfield, {autoSize: 'both'});
    				break;
    				case types.DATE:
    					editors[typeName] = new g.GridEditor(new f.DateField({selectOnFocus:true, validator: validator}));
    				break;
    				
    				default:
    					editors[typeName] = new g.GridEditor(new f.TextField({selectOnFocus:true, validator: validator}));
    				break;
    			}
    		}
    	}
    	

	    this.editors = editors;
    },
    //eo buildEditors
    
    /**
     * Returns the editor defined for the cell/column.
     * @protected
     * @override
     * @param {Number} colIndex The column index
     * @param {Number} rowIndex The row index
     * @return {Ext.Editor} The {@link Ext.Editor Editor} that was created to wrap
     * the {@link Ext.form.Field Field} used to edit the cell.
     */
    getCellEditor : function(colIndex, rowIndex) {
        var p = this.store.getProperty(rowIndex),
            pt = p.data.type.type,
            val = p.data.value;
            
        if (this.grid.customEditors[pt]) {
            return this.grid.customEditors[pt];
        }
        
        if (this.editors[pt]) {
            return this.editors[pt];
        }
        
//        if (Ext.isDate(val)) {
//            return this.editors.date;
//        } else if (typeof val == 'number') {
//            return this.editors.number;
//        } else if(typeof val == 'boolean') {
//            return this.editors['boolean'];
//        } else {
//            return this.editors.string;
//        }
    },
    //eo getCellEditor
    
    /**
     * @protected
     * @override
     */
    renderCell : function(val, meta, rec) {
        var renderer = this.grid.customRenderers[rec.get('type')];
        if (renderer) {
            return renderer.apply(this, arguments);
        }
        
        if (rec.get('required') && Ext.isEmpty(rec.get('value'))) {
        	meta.attr = 'style="background-color:red;"';
        	return;
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