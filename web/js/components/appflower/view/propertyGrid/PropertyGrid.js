Ext.ns('afStudio.view.property');

afStudio.view.property.PropertyGrid = Ext.extend(Ext.grid.EditorGridPanel, {
 
	// private config overrides
    enableColumnMove:false,
    stripeRows:false,
    trackMouseOver: false,
    clicksToEdit:1,
    enableHdMenu : false,
    viewConfig : {
        forceFit: true
    },

    // private
    initComponent : function() {
        this.customRenderers = this.customRenderers || {};
        this.customEditors = this.customEditors || {};        
        this.lastEditRow = null;
        var store = new afStudio.view.property.PropertyStore(this);
        this.propStore = store;
        var cm = new afStudio.view.property.PropertyColumnModel(this, store);
        store.store.sort('name', 'ASC');

        this.addEvents(
			/**
			 * @event beforepropertychange
             * Fires before a property value changes.  Handlers can return false to cancel the property change
             * (this will internally call {@link Ext.data.Record#reject} on the property's record).
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Mixed} value The current edited property value
             * @param {Mixed} oldValue The original property value prior to editing
			 */
        	'beforepropertychange',
        	
        	/**
        	 * @event propertychange
             * Fires after a property value has changed.
             * @param {Object} source The source data object for the grid (corresponds to the same object passed in
             * as the {@link #source} config property).
             * @param {String} recordId The record's id in the data store
             * @param {Mixed} value The current edited property value
             * @param {Mixed} oldValue The original property value prior to editing 
        	 */
        	'propertychange',
        	
        	/**
        	 * @event metaPropertyChange
        	 */
        	'metaPropertyChange'
        );
        
        this.cm = cm;
        this.ds = store.store;
        
        this.view = new Ext.grid.GroupingView({
			scrollOffset: 19,
			forceFit: true,
			hideGroupedColumn: true,
            showGroupName: false,
            groupTextTpl: '{[values.gvalue == true ? "Mandatory" : "Optional"]}'
		});
        
        afStudio.view.property.PropertyGrid.superclass.initComponent.call(this, arguments);

		this.mon(this.selModel, 'beforecellselect', function(sm, rowIndex, colIndex) {
            if (colIndex === 0) {
                this.startEditing.defer(200, this, [rowIndex, 1]);
                return false;
            }
        }, this);        
    },

    /**
     * @private
     */
    onRender : function() {
        Ext.grid.PropertyGrid.superclass.onRender.apply(this, arguments);
        this.getGridEl().addClass('x-props-grid');
    },

    /**
     * @private
     */
    afterRender : function() {
        Ext.grid.PropertyGrid.superclass.afterRender.apply(this, arguments);
        if (this.source) {
            this.setSource(this.source);
        }
    },
	
    // private
    onEditComplete : function(ed, value, startValue){
        this.editing = false;
        this.lastActiveEditor = this.activeEditor;
        this.activeEditor = null;

        var r = ed.record,
            field = this.colModel.getDataIndex(ed.col);
        value = this.postEditValue(value, startValue, r, field);
        if(this.forceValidation === true || String(value) !== String(startValue)){
            var e = {
                grid: this,
                record: r,
                field: field,
                originalValue: startValue,
                value: value,
                row: ed.row,
                column: ed.col,
                cancel:false
            };
            if (this.fireEvent("validateedit", e) !== false && !e.cancel && String(value) !== String(startValue)) {
                
            	console.log('model', this.modelNode, r.id, e.value);
            	this.modelNode.setProperty(r.id, e.value);
//                r.set(field, e.value);
                delete e.cancel;
                
                this.fireEvent("afteredit", e);
            }
        }
        this.view.focusCell(ed.row, ed.col);
    },    
    
    /**
     * @protected
     * @param {Object} source
     */
    setSource : function(source) {
        this.propStore.setSource(source);
        this.hideMandatoryCheckers();
    },
    
	/**
	 * Function hideMandatoryCheckers
	 * Hides checker group
	 */
	hideMandatoryCheckers: function() {
        //Hide mandatory checkers
        var hd = Ext.select('div[id*="-gp-required-true-hd"]');
		if (hd) {
			hd.setStyle({display: 'none'});
		}
	},
	
    /**
     * Gets the source data object containing the property data.  See {@link #setSource} for details regarding the
     * format of the data object.
     * @return {Object} The data object
     */
    getSource : function() {
        return this.propStore.getSource();
    }
});

/**
 * @type 'property.propertyGrid'
 */
Ext.reg("property.propertyGrid", afStudio.view.property.PropertyGrid);