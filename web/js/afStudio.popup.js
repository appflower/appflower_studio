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


afStudio.LayoutDesigner=Ext.extend(Ext.Window, { 
	form: [{
		xtype:'tabpanel',
		 activeTab: 0,
		    items: [{
		        title: 'Layout Designer',
		        layout:'border',
		        items:[{
		        	title:'Layouts',
		        	id:'layouttree',
		        	region:'west',
		        	xtype:'treepanel',
		        	split:true,
					margins: '2 0 5 5',
			        width: 150,
			        minSize: 100,
			        maxSize: 500,
			        root: {
			            nodeType: 'async',
			            text: 'Layouts',
			            draggable: false,
			            id: 'source',
			            expanded:true,
			            children:[{
			            	text:'1 column',leaf:true,columns:1
			            },{
			            	text:'2 column',leaf:true,columns:2
			            },{
			            	text:'3 column',leaf:true,columns:3
			            },{
			            	text:'4 column',leaf:true,columns:4
			            }]
			        }
		        },{
		        	id: 'details-panel',
		            title: 'Details',
		            region: 'center',
		            bodyStyle: 'padding-bottom:15px;background:#eee;',
		    		autoScroll: true,
		    		resizerHandler:function(resizer,width,height,e){
		    			var id = resizer.el.id;
		    			var index = id.substr(10,1);
		    			index = parseInt(index);
		    			index++;
		    			var w = resizer._width;
		    			w = width -w;
		    			Ext.getCmp(id).doLayout();
		    			var nextcolumn = Ext.getCmp('portColumn'+index);
		    			var ww  = nextcolumn.getWidth();
		    			nextcolumn.setWidth(ww-w);
		    			nextcolumn.doLayout();
		    		},
		    		tools:[{
		    			id:'gear',
		    	        handler: function(){
		    	        	var detailp=Ext.getCmp('details-panel');
		    	        	var columns = detailp.columns;
		    	        	detailp.resizer=[];
		    	        	for(var i=1;i<columns;i++){
			    	    		var resizer = new Ext.Resizable('portColumn'+(i-1), {
			    	    			 width: 200,
			    	                 minWidth:100,
			    	                 minHeight:50,
			    	                 listeners:{
			    	                	 beforeresize :function(resizer,e){
			    	                		 var el = Ext.fly(resizer.el);
			    	                		 resizer._width = Ext.fly(el).getWidth();
			    	                	 },
			    	                	 resize:function(resizer,width,height,e){
			    	                		 detailp.resizerHandler(resizer,width,height,e);
			    	                	 }
			    	                 }
			    	    		})
			    	    		//resizer.on('resize', detailp.resizerHandler,detailp);
			    	    		detailp.resizer.push(resizer);
		    	        	}
		    	        }
		    		},{
		    			id:'refresh',
		    	        handler: function(){
		    	        	var detailp=Ext.getCmp('details-panel');
		    	        	var resizers = detailp.resizer;
		    	        	for(var i=0;i<resizers.length;i++){
		    	        		resizers[i].destroy();
		    	        	}
		    	        }
		    		}],
		    		layout:'fit',
		    		items:[{
		    			html: '<p class="details-info">When you select a layout from the tree, additional details will display here.</p>',
		    			border:false
		    		}]

		        }],
		        buttons: [
	  				{text: 'add new widgets', handler: this.cancel, scope: this}
	  			],
	  			buttonAlign: 'center'
		    },{
		        title: 'Preview',
		        html: 'Another one'
		    }]

	}],
	addLayout:function(detailp,columns){
		var portItems = [];
		var columnwidth = 1/columns;
		for(var i =0;i<columns;i++){
			portItems.push({	
				id:'portColumn'+i,
				columnWidth: columnwidth,
				style: "padding:10px 0 10px 10px;",
				items: [{
					title:'widget1'+i,
					height:300
				},{
					title:'widget2'+i,
					height:300
				},{
					title:'widget3'+i,
					height:300
				}]
			});
		}
		detailp.columns=columns;
		detailp.add(
			new Ext.ux.Portal ({
				items: portItems,
				style: "padding-right:5px;"
			})
		);
		detailp.doLayout();
	},
	onTreeClick:function(n){
		if(n.leaf){
			var columns = n.attributes.columns;
			var detailP = Ext.getCmp('details-panel');
			detailP.removeAll(true);
			this.addLayout(detailP,columns)
		}
	},
	initComponent: function(){
		var config = {
			title: 'Layout Designer', width:820,height:600,
			closable: true,
	        draggable: true, plain:true,
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        items:this.form,layout:'fit',
	        listeners:{
	        	afterrender:function(){
	        		var treep = Ext.getCmp('layouttree');
	        		treep.on('click',this.onTreeClick,this);
	        	}
	        }
			
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.Help.superclass.initComponent.apply(this, arguments);	

	},
	cancel:function(){
		this.close();
	}
});