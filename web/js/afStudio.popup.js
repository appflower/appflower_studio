afStudio.DBQuery = Ext.extend(Ext.Window, { 
	form: [{
		region:'north',
		height:58,layout:'form',
		bodyStyle:'padding:5px 5px 0',
		labelWidth:40,
		frame:true,
		items:[{
			fieldLabel:'SQL',
			xtype:'textarea',
			height:40,
			anchor:'90%'
		}]
	},{
		xtype:'grid',
		region:'center',
		columns:[{
			header:'column1',width:120
		},{
			header:'column2',width:120
		},{
			header:'column3',width:120
		}],
		store:new Ext.data.ArrayStore({
	        fields: [
	                 {name: 'company'},
	                 {name: 'price', type: 'float'},
	                 {name: 'change', type: 'float'},
	                 {name: 'pctChange', type: 'float'},
	                 {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
	              ]
	          })

	}],
	initComponent: function(){
		var config = {
			title: 'Database Query', width: 463,
			height: 400, closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        items:this.form,layout:'border',
			buttons: [
				{text: 'Query',  scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.DBQuery.superclass.initComponent.apply(this, arguments);	

	},
	cancel:function(){
		this.close();
	}
});

afStudio.Logs = Ext.extend(Ext.Window, { 
	form: null,
	initComponent: function(){
		var config = {
			title: 'Logs', width: 463,
			autoHeight: true, closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
			buttons: [
				{text: 'Save',  scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Logs.superclass.initComponent.apply(this, arguments);	

	},
	cancel:function(){
		this.close();
	}
});

afStudio.Help = Ext.extend(Ext.Window, { 
	form: null,
	initComponent: function(){
		var config = {
			title: 'Help', width:720,height:600,
			closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        html:'<iframe style="height:100%;width:100%;" frameborder=0 src="http://www.appflower.com/docs/index.html"></iframe>',
			buttons: [
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Help.superclass.initComponent.apply(this, arguments);	

	},
	cancel:function(){
		this.close();
	}
});