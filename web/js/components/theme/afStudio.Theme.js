afStudio.Theme = Ext.extend(Ext.Window, {
    /**
     * @property tabPanel
     * @type {Ext.TabPanel}
     */
	tabPanel : null,

    /**
     * @property dataviewThemeSelector
     * @type {Ext.DataView}
     */
    dataviewThemeSelector : null,
    
    /**
     * @property dataviewEditors
     * @type {Ext.DataView}
     */
    dataviewEditors : null,
	
    /**
     * Ext template method.
     * @override
     * @private
     */
	initComponent : function() {
		this.initTabPanel();
		
		var config = {
			title: 'Theme Designer', 
			width: 464,
			height: 260, 
	        modal: true,
	        plain:true,
	        resizable: false,
	        border: false,
	        bodyBorder: false, 
	        layout: 'fit',
	        items: this.tabPanel,
	        buttons: [
			{
				id: this.id + '-customize-btn-ts', 
				text: 'Set Theme', 
				hidden: true, 
				disabled: true,
				handler: this.customizeThemeSelector, 
				scope: this
			},{
				id: this.id + '-customize-btn-e', 
				text: 'Customize', 
				hidden: true, 
				disabled: true,
				handler: this.customizeEditors,
				scope: this 
			},{
				text: 'Cancel',
				handler: this.cancel, 
				scope: this
			}],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		afStudio.Theme.superclass.initComponent.apply(this, arguments);	
	},
    
    /**
     * Initialises appearance.
     * Method that is called immediately before the <code>show</code> event is fired.
     * @override
     * @protected
     */    
    onShow : function() {
	    if (this.dataviewThemeSelector) {
	        var recIdx = this.dataviewThemeSelector.store.find('name', afTemplateConfig.template.current);
	        this.dataviewThemeSelector.select(recIdx);
	    }
    },
	
    /**
     * Initialises tab panel {@link #tabPanel}.
     * @private
     */
    initTabPanel: function() {
        var me = this;
        
        this.initDataviewThemeSelector();
        this.initDataviewEditors();
        
        this.tabPanel = new Ext.TabPanel({
            activeTab: 0,
            defaults: {
                autoScroll: true
            },
            items: [
            {
                title: 'Theme Selector',
                items: this.dataviewThemeSelector
            },{
                title: 'Editors',
                items: this.dataviewEditors
            }],
            listeners: {
                tabchange: function(tabpanel, tab) {
                    switch (tab.items.keys[0]) {
                        case "themeselector":
                            me.buttons[0].show();
                            me.buttons[1].hide();
                        break;
                        
                        case "editors":
                            me.buttons[1].show();
                            me.buttons[0].hide();
                        break;
                    }
                }
            }
        });
    },
    
    /**
     * Init theme selector {@link #dataviewThemeSelector}.
     * @private
     */
	initDataviewThemeSelector : function() {
		var me = this;
		
	    var store = new Ext.data.SimpleStore({
	        fields: ['id', 'name', 'img'],
	        sortInfo: {
	            field: 'name', direction: 'ASC'
	        },
	        data: [
	            ['desktoptemplate', 'Desktop', 'template_desktop.png'],
	            ['viewporttemplate', 'Viewport', 'template_viewport.png']
            ]
	    });
	    
		this.dataviewThemeSelector = new Ext.DataView({
		    id: 'themeselector',
	        itemSelector: 'div.thumb-wrap-large',
            singleSelect: true,
	        store: store,
	        tpl: new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="thumb-wrap-large" id="{id}">',
	            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}"></div>',
	            '<span>{name}</span></div>',
	            '</tpl>'
	        ),
			listeners: {
				scope: this,
				selectionchange: function(dataview, selections) {
					var btn = Ext.getCmp(this.id + '-customize-btn-ts');
					selections.length ? btn.enable() : btn.disable();
				},
				dblclick: function(dataview, index, node, e) {
					me.customizeThemeSelector(me.close);
				}
			}
		});
	},
	
    /**
     * Init view editors {@link #dataviewEditors}.
     * @private
     */
	initDataviewEditors : function() {
		var me = this,
            tplCfg = afTemplateConfig.template;
        
    	var store = new Ext.data.SimpleStore({
	        fields: ['id', 'name', 'img', 'editor'],
    		data: tplCfg.helpers[tplCfg.current]
	    });
	    	
		this.dataviewEditors = new Ext.DataView({
		    id: 'editors',
	        itemSelector: 'div.thumb-wrap',
	        singleSelect: true,
	        store: store,
	        tpl: new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="thumb-wrap" id="{id}">',
	            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}"></div>',
	            '<span>{name}</span></div>',
	            '</tpl>'
	        ),
			listeners: {
				scope: this,
				selectionchange: function(dataview, selections){
					var btn = Ext.getCmp(this.id + '-customize-btn-e');
                    selections.length ? btn.enable() : btn.disable();
                },
				dblclick: function(dataview,index,node,e){
					me.customizeEditors();
					me.close();
				}
			}
    	});
	},
	
    updateDataviewEditors: function() {
        var myData = afTemplateConfig.template.helpers[afTemplateConfig.template.current];      
        this.dataviewEditors.store.loadData(myData);
    },
    
	customizeThemeSelector : function(callback) {		
		var me = this;
        
		if (this.dataviewThemeSelector.getSelectionCount()) {
			var templateName = this.dataviewThemeSelector.getSelectedRecords()[0].get('name');
			
			Ext.Ajax.request({
				url:afStudioWSUrls.getTemplateSelectorUrl(),
				method: 'post',
				params: {
					cmd: 'update',
					template: templateName
				},
				callback: function(options, success, response) {				
					response = Ext.decode(response.responseText);
					
					if (!response.success) {
						afStudio.Msg.error(response.message);
					} else {
						afTemplateConfig.template.current = templateName.toLowerCase();						
						afStudio.Msg.info(response.message);						
						me.updateDataviewEditors();
						if (Ext.isFunction(callback)) {
							Ext.util.Functions.createDelegate(callback, me)();
						}
					}
				}				
			});
		}
	},
	
	customizeEditors : function() {
	    if (this.dataviewEditors.getSelectionCount()) {
			var id     = this.dataviewEditors.getSelectedRecords()[0].get('id'),
				name   = this.dataviewEditors.getSelectedRecords()[0].get('name'),
				editor = this.dataviewEditors.getSelectedRecords()[0].get('editor');
			
			if (editor != '') {
				eval('new ' + editor + '({helper: \'' + id + '\',title:\'' + name + '\'}).show()');
			} else {
				afStudio.Msg.error('There is not javascript Editor set for this button.');
			}
			
			this.close();
		}
	},
	
	cancel : function() {
		this.close();
	}
});