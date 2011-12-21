Ext.ns('afStudio.models');

/**
 * Fixtures form.
 * 
 * @class afStudio.models.FixturesForm
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.models.FixturesForm = Ext.extend(Ext.Panel, {

    /**
     * @cfg {String} url The base import url
     */
    url : afStudioWSUrls.modelListUrl,
    
    layout : 'form',

    /**
     * @cfg {Boolean} autoLoadFixtures The flag responsible for loading fixtures after rendering, defaults to false
     */
    autoLoadFixtures : false,
     
    /**
     * @property fixturesGrid The fixtures grid
     * @type {Ext.grid.GridPanel}
     */
    /**
     * @property appendChbox The append checkbox
     * @return {Ext.form.Checkbox}
     */
     
    /**
     * Initializes component.
     * @private
     * @return {Object} The configuration object
     */
    _beforeInitComponent : function() {

        this.fixturesGrid = this.createFixtures();
        
        return {
            items: [
                this.fixturesGrid,
                {
                    xtype: 'checkbox',
                    ref: 'appendChbox',
                    fieldLabel: 'Append'
                }
            ],
            buttons: [
            {
                text: 'Import',
                itemId: 'import',
                iconCls: 'icon-accept',
                disabled: true,
                scope: this,
                handler: this.importFixtures
            }]
        };
    },
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        Ext.apply(this, 
            Ext.apply(this.initialConfig, this._beforeInitComponent())
        );
        
        afStudio.models.FixturesForm.superclass.initComponent.apply(this, arguments);
    },
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    afterRender : function() {
        var fSm = this.fixturesGrid.getSelectionModel(),
            fStore = this.fixturesGrid.getStore();
        
        this.addEvents(
            /**
             * @event importfixtures Fires when fixtures were successfully imported
             * @param {Array} fixtures The fixtures which were imported
             */
            'importfixtures'
        );
        
        fSm.on('selectionchange', function(){
            var importBtn = this.getImportButton();
            fSm.hasSelection() ? importBtn.enable() : importBtn.disable();
        }, this);
        
        if (this.autoLoadFixtures === true) {
	        fStore.load();
        }
        
        afStudio.models.FixturesForm.superclass.afterRender.call(this);
    },

    /**
     * Returns import button.
     * @return {Ext.Button} import button
     */
    getImportButton : function() {
        var fbar = this.getFooterToolbar();

        return fbar.getComponent('import');  
    },
    
    /**
     * Reloads fixtures.
     */
    reloadFixtures : function() {
        this.fixturesGrid.store.reload();
    },
    
    /**
     * Creates fixtures grid panel.
     * @protected
     * @return {Ext.grid.GridPanel} fixtures grid
     */
    createFixtures : function() {
        var me = this;
        
        var st = new Ext.data.ArrayStore({
            url: me.url,
            baseParams: {
                cmd: 'getFixtures'
            },
            method: 'GET',
            root: 'dataset',
            idProperty: 'id',
            fields: ['file']
        });
        
        var sm = new Ext.grid.CheckboxSelectionModel({
            singleSelect: false
        });        
        
        var fgrid = new Ext.grid.GridPanel({
	        title: 'Fixtures',
	        store: st,
	        sm: sm,
	        columns: [
	            sm,
	            {header: 'File', sortable: true, id: 'fixture'}
	        ],
            viewConfig: {
                emptyText: 'There are no fixtures'  
            },
            anchor: '100% 90%',
	        autoExpandColumn: 'fixture',
	        autoScroll: true
        });
        
        return fgrid;
    },
    
    /**
     * Imports fixtures files.
     * @protected
     */
    importFixtures : function() {
        var fSm = this.fixturesGrid.getSelectionModel(),
            recs = fSm.getSelections(),
            append = this.appendChbox.getValue(),
            files = [];
        
        Ext.each(recs, function(f, idx) {
            files.push(f.get('file'));
        });
        
        afStudio.xhr.executeAction({
            url: this.url,
            params: {
                cmd: 'importData',
                remote_files: files,
                append: append
            },
            //mask: "Importing...",
            scope: this,
            run: function(response, opts) {
                
                this.fireEvent('importfixtures', opts.params.remote_files);
            }
        });
    }
    
});

Ext.reg('import.fixtures', afStudio.models.FixturesForm);