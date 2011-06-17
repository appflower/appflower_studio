afStudio.Theme = Ext.extend(Ext.Window, { 

	tabPanel : null,
	
	initComponent : function() {
		this.initDataviewThemeSelector();
		this.initDataviewEditors();
		this.initTabPanel();
		
		var config = {
			title: 'Theme Designer', 
			width: 463,
			height: 250, 
			closable: true,
	        draggable: true, 
	        plain:true,
	        modal: true, 
	        resizable: false,
	        bodyBorder: false, 
	        border: false,
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
			buttonAlign: 'center',
			listeners: {
				show: function()
				{
					//select the current selected template from the project using afTemplateConfig.template.current
					for (var item in this.dataviewThemeSelector.store.data.items)
					{
						if(this.dataviewThemeSelector.store.data.items[item].json&&afTemplateConfig.template.current==this.dataviewThemeSelector.store.data.items[item].json[1].toLowerCase()){
							this.dataviewThemeSelector.selectRange(item,item);
						}
					}
				}
			}
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		
		afStudio.Theme.superclass.initComponent.apply(this, arguments);	
	},
	
	initDataviewThemeSelector : function() {
		
		var _self = this;
		
	    var myData = [
	        ['desktoptemplate', 'Desktop', 'template_desktop.png'],
	        ['viewporttemplate', 'Viewport', 'template_viewport.png']
	    ];
	    var store = new Ext.data.SimpleStore({
	        fields: [
	           {name: 'id'},
	           {name: 'name'},
	           {name: 'img'}
	        ],
	        sortInfo: {
	            field: 'name', direction: 'ASC'
	        },
	        data: myData
	    });
	    
		this.dataviewThemeSelector = new Ext.DataView({
		    id: 'themeselector',
	        itemSelector: 'div.thumb-wrap',
	        style: 'overflow: auto;',
	        multiSelect: true,
			listeners: {
				selectionchange: function(dataview, selections) {
					var btn = Ext.getCmp(this.id + '-customize-btn-ts');
					if(selections.length){
						btn.enable();
					} else {
						btn.disable();
					}	
				},
				dblclick: function(dataview, index, node, e) {
					_self.customizeThemeSelector(_self.close);
				},
				scope: this
			},
	        store: store,
	        tpl: new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="thumb-wrap" id="{id}">',
	            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}"></div>',
	            '<span>{name}</span></div>',
	            '</tpl>'
	        )
		});
	},
	
	initDataviewEditors: function(){
		
		var _self = this;
		
    	var myData = afTemplateConfig.template.helpers[afTemplateConfig.template.current];
    	
    	var store = new Ext.data.SimpleStore({
	        fields: [
	           {name: 'id'},
	           {name: 'name'},
	           {name: 'img'},
	           {name: 'editor'}
	        ],
    		data: myData
	    });	    
	    	
		this.dataviewEditors = new Ext.DataView({
		    id: 'editors',
	        itemSelector: 'div.thumb-wrap',
	        style: 'overflow:auto',
	        multiSelect: true,
			listeners: {
				selectionchange: function(dataview, selections){
					var btn = Ext.getCmp(this.id + '-customize-btn-e');
					if (selections.length) {
						btn.enable();
					} else {
						btn.disable();
					}					
				},
				dblclick: function(dataview,index,node,e){
					_self.customizeEditors();
					_self.close();
				},
				scope: this
			},
	        store: store,
	        tpl: new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="thumb-wrap" id="{id}">',
	            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}"></div>',
	            '<span>{name}</span></div>',
	            '</tpl>'
	        )
    	});
	},
	
	updateDataviewEditors: function() {
	    var myData = afTemplateConfig.template.helpers[afTemplateConfig.template.current];	    
	    this.dataviewEditors.store.loadData(myData);
	},
	
	initTabPanel: function() {
		
	    var _self = this;
	    
	    this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			items: [
			{
				title: 'Theme Selector', 
				items: this.dataviewThemeSelector
			},{
				title: 'Editors',
				autoScroll: true,
				items: this.dataviewEditors
			}],
			listeners: {
			    tabchange: function(tabpanel, tab) {
			        switch (tab.items.keys[0]) {
			            case "themeselector":
			            	_self.buttons[0].show();
			            	_self.buttons[1].hide();
			            break;
			            
			            case "editors":
			            	_self.buttons[1].show();
			            	_self.buttons[0].hide();
			            break;
			        }
			    }
			}
		});
	},
	
	customizeThemeSelector : function(callback) {		
		var _self = this;
		
		if (this.dataviewThemeSelector.getSelectedIndexes()) {
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
						_self.updateDataviewEditors();
						if (Ext.isFunction(callback)) {
							Ext.util.Functions.createDelegate(callback, _self)();
						}
					}
				}				
			});
		}
	},
	
	customizeEditors : function() {
	    
	    if (this.dataviewEditors.getSelectedIndexes()) {
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
	
	cancel: function() {
		this.close();
	}
});