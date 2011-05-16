afStudio.TemplateDesigner = Ext.extend(Ext.Window, { 

	dataview: null,
	
	initComponent: function(){
		this.initDataview();
		var config = {
			title: 'Template Designer', width: 463,
			height: 250, closable: true,
	        draggable: true,
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
		
		var _self = this;
		
    	var myData = afTemplateConfig.template.helpers[afTemplateConfig.template.current];
    	
    	var store = new Ext.data.SimpleStore({
	        fields: [
	           {name: 'id'},
	           {name: 'name'},
	           {name: 'img'},
	           {name: 'editor'}
	        ]
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
		if(this.dataview.getSelectedIndexes()){
			var id = this.dataview.getSelectedRecords()[0].get('id');
			var name = this.dataview.getSelectedRecords()[0].get('name');
			var editor = this.dataview.getSelectedRecords()[0].get('editor');
			
			if(editor!='')
			{
				eval('new '+editor+'({helper: \''+id+'\',title:\''+name+'\'}).show()');
			}
			else
			{
				afStudio.Msg.error('There is not javascript Editor set for this button.');
			}
			
			this.close();
		}
	},
	
	cancel:function(){
		this.close();
	}
});