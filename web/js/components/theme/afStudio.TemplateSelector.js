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
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.TemplateSelector.superclass.initComponent.apply(this, arguments);	
	},
	
	initDataview: function(){
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
					
				}, scope: this
			},
	        store: store,
	        tpl: new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="thumb-wrap x-view-selected" id="{id}">',
	            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}"></div>',
	            '<span>{name}</span></div>',
	            '</tpl>'
	        )
		});
	},
	
	customize: function(){
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
					}
				}
				
			});
		}
	},
	
	cancel:function(){
		this.close();
	}
});