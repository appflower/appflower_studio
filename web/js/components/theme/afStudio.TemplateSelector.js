afStudio.TemplateSelector = Ext.extend(Ext.Window, { 

	dataview: null,
	
	initComponent: function(){
		this.initDataview();
		var config = {
			title: 'Template Selector', width: 463,
			height: 250, closable: true,
	        draggable: true, 
	        
//	        plain:true,
	        
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'fit',
	        items: this.dataview,
			buttons: [
				{text: 'Customize', handler: this.customize, scope: this, id: this.id + '-customize-btn', disabled: true},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.TemplateSelector.superclass.initComponent.apply(this, arguments);	
	},
	
	initDataview: function(){
    var myData = [
        ['desktoptemplate', 'Desktop', 'template_web_desktop.png']
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
	            '<div class="thumb-wrap" id="{id}">',
	            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}" class="thumb-img"></div>',
	            '<span>{name}</span></div>',
	            '</tpl>'
	        )
    	});
	},
	
	customize: function(){
		if(this.dataview.getSelectedIndexes()){
			var name = this.dataview.getSelectedRecords()[0].get('name');
			alert('Template ' + name + ' selected');
		}
		
		this.dataview
	},
	
	cancel:function(){
		this.close();
	}
});