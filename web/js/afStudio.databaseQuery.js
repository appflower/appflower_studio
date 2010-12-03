afStudio.DBQuery = Ext.extend(Ext.Window, { 
	form: [{
		region:'north',
		height:58,layout:'form',
		
//		bodyStyle:'padding:5px 5px 0',
		
		margins: '0 5 5 5',
		
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
		margins: '0 5 0 0',
		columns:[
			{header:'column1',width:120},
			{header:'column2',width:120},
			{header:'column3',width:120}
		],
		store:new Ext.data.ArrayStore({
	        fields: [
	                 {name: 'company'},
	                 {name: 'price', type: 'float'},
	                 {name: 'change', type: 'float'},
	                 {name: 'pctChange', type: 'float'},
	                 {name: 'lastChange', type: 'date', dateFormat: 'n/j h:ia'}
	              ]
	          })

	},
	{xtype: 'panel', region: 'west', html: 'west', width: 100, margins: '0 0 0 5', split: true}
	],
	initComponent: function(){
		var config = {
			title: 'Database Query', width: 563,
			height: 500, closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        
	        items:this.form,
	        
	        layout:'border',
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