
App = Ext.extend(Ext.util.Observable, {
	
	connections: [],
	
	/**
	 * Creates dragable element
	 * @return {Ext.Window} new window instance
	 */
	getWindow: function(){
		
	},
	
	/**
	 * Function constructor
	 * Create initial config and init component
	 */
	constructor: function(config){
        Ext.apply(this, config || {});

        App.superclass.constructor.call(this);
        this.buildContent();
	},

	/**
	 * Build application content data
	 */
	buildContent: function(){


//
//this.q1 = new Ext.Window({
//    constrain: true,
//    closable: false,
//    title: 'Window 1',
//	width: 100,
//	height: 100,
//
//    y: 150,
//
//    listeners: {
//    	afterrender: this.addWindowDragHandler,
//    	scope: this
//    },
//
//    html: '<h1 style="cursor:move">The title</h1><p>The content</p>',
//    draggable: true
//});
//
//this.q2 = new Ext.Window({
//    constrain: true,
//    closable: false,
//    title: 'Window 2',
//	width: 100,
//	height: 100,
//    
//    y: 300,
//    
//    listeners: {
//    	afterrender: this.addWindowDragHandler,
//    	scope: this
//    },
//    
//    html: '<h1 style="cursor:move">The title</h1><p>The content</p>',
//    draggable: true
//});
//
//this.q3 = new Ext.Window({
//    constrain: true,
//    closable: false,
//    title: 'Window 3',
//	width: 100,
//	height: 100,
//    
//    y: 300,
//    x: 50,
//    
//    listeners: {
//    	afterrender: this.addWindowDragHandler,
//    	scope: this
//    },
//    
//    html: '<h1 style="cursor:move">The title</h1><p>The content</p>',
//    draggable: true
//});
//
//this.q4 = new Ext.Window({
//    constrain: true,
//    closable: false,
//    title: 'Window 4',
//	width: 100,
//	height: 100,
//    
//    y: 10,
//    
//    listeners: {
//    	afterrender: this.addWindowDragHandler,
//    	scope: this
//    },
//    
//    html: '<h1 style="cursor:move">The title</h1><p>The content</p>',
//    draggable: true
//});
//
//this.q5 = new Ext.Window({
//    constrain: true,
//    closable: false,
//    title: 'Window 5',
//	width: 100,
//	height: 100,
//    
//    y: 300,
//    x: 550,
//    
//    listeners: {
//    	afterrender: this.addWindowDragHandler,
//    	scope: this
//    },
//    
//    html: '<h1 style="cursor:move">The title</h1><p>The content</p>',
//    draggable: true
//});
//		
		
		//Create diagramm
		this.diagramm = Ext.create('Ext.ux.DiagramRelations', {renderTo: 'diagramDiv'});
		
		//Create dummy button
		Ext.create('Ext.Container', {
		    renderTo: 'diagramDiv2',
		    items: [
		        {xtype: 'button', text : 'Load data', handler: this.loadData, scope: this}
		    ]
		});
	},
	
	//Load default dataset
	loadData: function(){
		Ext.Ajax.request({
	    	url: 'data.json',
	    	success: function(response){
	        	// process server response
	        	var data = Ext.decode(response.responseText);
	        	
	        	//Create entities
	        	this.diagramm.createEntities(data['propel']);
	    	}, scope: this
		});
	},
	
	redrawConnections: function(cmp){
		if(this.connections && this.connections){
			for(var i = 0, l = this.connections.length; i<l; i++){
				
				var o1 = o2 = p = null;
				
				//Check if 
				if(cmp.getId() == this.connections[i].parentId){
					o1 = cmp.ghostPanel;
					o2 = Ext.getCmp(this.connections[i].childId);
				}
				
				if(cmp.getId() == this.connections[i].childId){
					o1 = cmp.ghostPanel;
					o2 = Ext.getCmp(this.connections[i].parentId);
				}
				
				if(o1 && o2){
					p = this.getPath(o1, o2);
					this.connections[i].setAttributes({path: p}, true);
				}
			}
		}
	}
});