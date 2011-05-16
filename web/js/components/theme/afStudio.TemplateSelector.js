afStudio.TemplateSelector = Ext.extend(Ext.Window, { 

	dataview: null,
	
	initComponent: function(){
		this.initDataview();
				
		var config = {
			title: 'Template Selector', width: 463,
			height: 250, closable: true,
	        draggable: true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'fit',
	        items: this.dataview,
			buttons: [
				{text: 'Set Template', handler: this.customize, scope: this, id: this.id + '-customize-btn', disabled: true},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center',
			listeners: {
				show: function()
				{
					//select the current selected template from the project using afTemplateConfig.template.current
					for (var item in this.dataview.store.data.items)
					{
						if(this.dataview.store.data.items[item].json&&afTemplateConfig.template.current==this.dataview.store.data.items[item].json[1].toLowerCase()){
							this.dataview.selectRange(item,item);
						}
					}
				}
			}
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.TemplateSelector.superclass.initComponent.apply(this, arguments);	
	},
	
	initDataview: function(){
		
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
	        }
	    });
	    
	    store.loadData(myData);		
	    
		this.dataview = new Ext.DataView({
	        itemSelector: 'div.thumb-wrap',
	        style:'overflow:auto',
	        multiSelect: true,
			listeners: {
				'selectionchange': function(dataview, selections){
					var btn = Ext.getCmp(this.id + '-customize-btn');
					if(selections.length){
						btn.enable();
					} else {
						btn.disable();
					}	
				},
				'dblclick': function(dataview,index,node,e){
					_self.customize();
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
	
	customize: function(){
		
		var _self = this;
		
		if(this.dataview.getSelectedIndexes()){
			var templateName = this.dataview.getSelectedRecords()[0].get('name');
			
			Ext.Ajax.request({
				url:window.afStudioWSUrls.getTemplateSelectorUrl(),
				method: 'post',
				params: {
					cmd: 'update',
					template: templateName
				},
				callback: function(options, success, response) {				
					response = Ext.decode(response.responseText);
					
					if (!response.success) {
						afStudio.Msg.error(response.message);
					}
					else
					{
						afTemplateConfig.template.current = templateName.toLowerCase();
						
						afStudio.Msg.info(response.message);
						
						_self.close();
					}
				}
				
			});
		}
	},
	
	cancel:function(){
		this.close();
	}
});