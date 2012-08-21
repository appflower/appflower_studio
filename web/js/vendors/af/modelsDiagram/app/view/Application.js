
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
	buildContent: function() {
		//Create diagramm
		this.diagramm = Ext.create('Ext.ux.DiagramRelations', {renderTo: 'diagramDiv'});
	},
	
	//Load default dataset
	loadData: function() {
		Ext.Ajax.request({
	    	url: 'data.json',
	    	success: function(response){
	        	// process server response
	        	var data = Ext.decode(response.responseText);
	        	
	        	//Create entities
	        	this.diagramm.createEntities(data['propel']);
	    	},
            scope: this
		});
	},
	
	redrawConnections: function(cmp){
		if (this.connections && this.connections) {

			for (var i = 0, l = this.connections.length; i<l; i++) {
				var o1 = o2 = p = null;
				
				//Check if 
				if (cmp.getId() == this.connections[i].parentId){
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