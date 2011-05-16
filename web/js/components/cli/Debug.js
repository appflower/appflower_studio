Ext.namespace('afStudio.cli');

/**
 * Debug cli component.
 * 
 * @class afStudio.cli.Debug
 * @extends afStudio.cli.CommandLine
 */
afStudio.cli.Debug = Ext.extend(afStudio.cli.CommandLine, {
	
	/**
	 * @cfg {String} baseUrl
	 * Debug base URL.
	 */
	 baseUrl : afStudioWSUrls.getDebugUrl()
	
	/**
	 * @property debugDataView
	 * Reference 
	 * @cfg {Ext.DataView}
	 */ 
	 
	/**
	 * Initializes component.
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var store = new Ext.data.JsonStore({
			autoLoad: false,
            url: _this.baseUrl,
            storeId: 'cli-debug',
            root: 'data',
            totalProperty: 'total',
            fields: ['text']
        });
        
        var dataViewTpl = new Ext.XTemplate(
            '<tpl for=".">',
                '<div class="thumb-wrap">',
                	'{text}',
                	'<div class="x-clear"></div>',
                '</div>',
            '</tpl>'
        );
        
        this.debugDataView = new Ext.DataView({
            store: store,
            tpl: dataViewTpl,
            autoHeight: true,
            forceFit: true
        });   
        
        var debugBbar = new Ext.PagingToolbar({
            store: store,
            pageSize: 1,
            displayInfo: true
        });
        
		return {
            tbar: {
                id: 'debug-toolbar',
                items: []
            },
            bbar: debugBbar,
            items: [this.debugDataView]
		};
	}//eo _beforeInitComponent
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.cli.Debug.superclass.initComponent.apply(this, arguments);
	}//eo initComponent
	
	/**
     * @override 
     */
    ,loadCli : function() {
        var _this = this,
        	   st = this.debugDataView.getStore(),
			 tbar = this.getTopToolbar(),        	   
        	 bbar = this.getBottomToolbar();
        
		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: 'main'
			},
		    run: function(response) {
		    	st.loadData(response);
		    	st.setBaseParam('file_name', null);
		    	st.setBaseParam('command', null);
		    	bbar.moveLast();
                this.scrollCliDown();
                
                tbar.removeAll();
                var files_count = response.files.length;
                if (files_count > 0) {
                    Ext.each(response.files, function(file_name, index) {
                        tbar.addButton({
                        	itemId: file_name,
                            text: file_name
                        });
                        tbar.getComponent(file_name).on({
                            click: _this.onFileClick.createDelegate(_this)
                        });                        
                        if (index != files_count - 1) {
                            tbar.add('-');
                        }
                    });
                }
                tbar.doLayout();
		    }
		});
    }//eo loadCli
    
	,onFileClick : function(e, t) {
         var _this = this,
         	     s = this.debugDataView.getStore();
         	     
        this.maskCli();
        
        s.baseParams.file_name = e.itemId;
        s.baseParams.command = "file";
        
        s.load({
    		params: {
                start: 0,
                limit: 1
            }
        });
        this.unmaskCli();        
    }//eo onFileClick
    
});

/**
 * @type 'afStudio.cli.debug'
 */
Ext.reg('afStudio.cli.debug', afStudio.cli.Debug);