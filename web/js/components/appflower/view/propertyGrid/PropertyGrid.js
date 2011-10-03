Ext.ns('afStudio.view.property');

/**
 * @class afStudio.view.property.PropertyGrid
 * @extends Ext.grid.EditorGridPanel
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.property.PropertyGrid = Ext.extend(Ext.grid.EditorGridPanel, {
	/**
	 * @cfg {afStudio.controller.BaseController} (Required) controller
	 * The associated with this tree controller.
	 */
	/**
	 * Read-only the model node whose properties source is rendered by this grid.
	 * @property modelNode
	 * @type {afStudio.model.Node}
	 */

    enableColumnMove : false,
    
    stripeRows : false,
    
    trackMouseOver : false,
    
    clicksToEdit : 1,
    
    enableHdMenu : false,
    
    viewConfig : {
        forceFit: true
    },    

	/**
	 * Ext Template method
	 * @override
	 * @private
	 */
    initComponent : function() {
        this.customRenderers = this.customRenderers || {};
        this.customEditors = this.customEditors || {};        
        this.lastEditRow = null;
        var store = new afStudio.view.property.PropertyStore(this);
        this.propStore = store;
        var cm = new afStudio.view.property.PropertyColumnModel(this, store);
        store.store.sort('name', 'ASC');
        
        this.cm = cm;
        this.ds = store.store;
        
        this.view = new Ext.grid.GroupingView({
			forceFit: true,
			hideGroupedColumn: true,
            showGroupName: false,
            groupTextTpl: '{[values.gvalue == true ? "Mandatory" : "Optional"]}'
		});
        
        afStudio.view.property.PropertyGrid.superclass.initComponent.call(this, arguments);
    },
    //eo initComponent

    /**
	 * Ext Template method
	 * Initializes events.
	 * @override
	 * @private
     */
	initEvents : function() {
		afStudio.view.property.PropertyGrid.superclass.initEvents.call(this);
		var _me = this;

		_me.mon(_me.selModel, {
			scope: _me,
			beforecellselect : function(sm, rowIndex, colIndex) {
	            if (colIndex === 0) {
	                this.startEditing.defer(200, this, [rowIndex, 1]);
	                return false;
	            }
			}
        });
        
        _me.mon(_me.view, {
        	scope: _me,
        	refresh : _me.onViewRefresh
        });
		
		_me.on({
			scope: _me,
			
			/**
			 * @relayed from controller
			 */
			modelNodeRemove: _me.onModelNodeRemove,
			/**
			 * @relayed from controller
			 */
			modelNodeSelect: _me.onModelNodeSelect,
			/**
			 * @relayed from controller
			 */
			modelPropertyChanged: _me.onModelPropertyChanged
		});
	},
	//eo initEvents
    
    /**
     * Ext Template method
     * @override
     * @private
     */
    onRender : function() {
        afStudio.view.property.PropertyGrid.superclass.onRender.apply(this, arguments);
        this.getGridEl().addClass('x-props-grid');
    },

    /**
     * Ext Template method
     * @override
     * @private
     */
    afterRender : function() {
        afStudio.view.property.PropertyGrid.superclass.afterRender.apply(this, arguments);
        if (this.source) {
            this.setSource(this.source);
        }
    },
	
    /**
     * @override
     * @private
     */
    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        this.lastActiveEditor = this.activeEditor;
        this.activeEditor = null;

        var r = ed.record,
            field = this.colModel.getDataIndex(ed.col);
        value = this.postEditValue(value, startValue, r, field);
        if (this.forceValidation === true || String(value) !== String(startValue)) {
        	var mn = this.modelNode,
            	e = {
	                grid: this,
	                record: r,
	                field: field,
	                originalValue: startValue,
	                value: value,
	                row: ed.row,
	                column: ed.col,
	                modelNode: mn,
	                cancel:false
            	};
            if (this.fireEvent("validateedit", e) !== false && !e.cancel && String(value) !== String(startValue)) {
            	if (r.id == '_content') {
					mn.setNodeData(e.value);
            	} else {
	            	mn.setProperty(r.id, e.value);
            	}
                delete e.cancel;
                this.fireEvent("afteredit", e);
            }
        }
        this.view.focusCell(ed.row, ed.col);
    },
    //eo onEditComplete
    
	/**
	 * Relayed <u>modelNodeRemove</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeRemove}.
	 * @protected
	 * @interface
	 */
	onModelNodeRemove : function(ctr, parent, node) {
    	afStudio.Logger.info('@view [PropertyGrid] "modelNodeRemove"');
    	if (this.modelNode == node) {
    		this.setSource({});
    	}
	},
	//eo onModelNodeRemove	
    
	/**
	 * Relayed <u>modelNodeSelect</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelNodeSelect}.
	 * @protected
	 * @interface
	 */
	onModelNodeSelect : function(mn, trigger) {
		afStudio.Logger.info('@view [PropertyGrid] "modelNodeSelect"');
		this.modelNode = mn;
		this.setSource(mn.getPropertiesSource());
	},
	//eo onModelNodeSelect
	
	/**
	 * Relayed <u>modelPropertyChanged</u> event listener.
	 * More details {@link afStudio.controller.BaseController#modelPropertyChanged}.
	 * @protected
	 * @interface
	 */
	onModelPropertyChanged : function(node, p, v) {
		afStudio.Logger.info('@view [PropertyGrid] "modelPropertyChanged"');
		if (this.modelNode == node) {
			this.setProperty(p, v);
			this.onViewRefresh(this.view);
		}
	},
    
    /**
     * This grid's {@link #view} <u>refresh</u> event listener.
     * More details {@link Ext.grid.GridView#refresh}
     */
    onViewRefresh : function(view) {
		var ds = this.getStore();
		for (var i = 0, rn = ds.getCount(); i < rn; i++) {    		
			var r = ds.getAt(i),
				html = String.format('<b>{0}:</b> {1}', r.get('name'), r.get('value')),
				row = view.getRow(i),
				els = Ext.get(row).select('.x-grid3-cell-inner');
				
			for (var j = 0, eln = els.getCount(); j < eln; j++) {
		  		Ext.QuickTips.register({
		    		target: els.item(j),
		    		text: html
				});
			}
		}
		this.hideMandatoryChecker();
	},
	//eo onViewRefresh
    
    /**
     * @protected
     * @param {Object} source
     */
    setSource : function(source) {
        this.propStore.setSource(source);
        this.hideMandatoryChecker();
    },
    
	/**
	 * Hides required group
	 * @private
	 */
	hideMandatoryChecker: function() {
        var hd = Ext.select('div[id$="gp-required-true-hd"]');
		if (hd) {
			hd.setStyle({display: 'none'});
		}
	},
	
    /**
     * Gets the source data object containing the property data.
     * @public  
     * @return {Object} The data object
     */
    getSource : function() {
        return this.propStore.getSource();
    },
    
    /**
     * Sets the value of a property.
     * @public
     * @param {String} prop The name of the property to set
     * @param {Mixed} value The value being set
     */
    setProperty : function(prop, value) {
        this.propStore.setValue(prop, value);    
    }
});

/**
 * @type 'property.propertyGrid'
 */
Ext.reg("property.propertyGrid", afStudio.view.property.PropertyGrid);