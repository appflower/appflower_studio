afStudio.viewport = Ext.extend(Ext.Viewport, { 

	initComponent: function(){
		
		var northPanel = new Ext.Panel ({
			id: "north_panel",
			region: "north",
			height: 32,
			border: false,
			bodyStyle: "background-color:#dfe8f6;"
		});
						
		var centerPanel = new Ext.ux.Portal ({
			id: 'center_panel',
			region: "center",
			title: "Dashboard",
			items: [
			{				
				columnWidth: 1,
				style: "padding:10px 0 10px 10px;",
				items: [				
				]
			}],
			style: "padding-right:5px;"
		});
		
		var westPanel = new afStudio.westPanel(),
			southPanel = new afStudio.southPanel();
		
		this.viewRegions = {
			north: northPanel,
			center: centerPanel,
			west: westPanel,
			south: southPanel
		};		
		
		var config = {
			layout: "border",
			id: "viewport",
			items: [
				northPanel,
				westPanel,
				centerPanel,
				southPanel	
			]
		};	
		
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.viewport.superclass.initComponent.apply(this, arguments);
	}
	
	/**
	 * Puts a mask over afStudio.viewport or its region to disable user interaction.
	 * @param {String/Object} opt (optional) if
	 * opt striing -  message,
	 * opt {msg: 'message', region: 'region to mask'}
	 * (defaults to mask all viewport)  
	 */
	,mask : function(opt) {		
		var maskMessage = Ext.isString(opt) ? opt : 'Loading, please Wait...',
			region;
		
		if (Ext.isObject(opt)) {
			maskMessage = opt.msg ? opt.msg : maskMessage;
			region = opt.region ? opt.region : undefined;
		}		  
		
		if (['center', 'west', 'north', 'south'].indexOf(region) != -1) {			
			this.viewRegions[region].body.mask(maskMessage, 'x-mask-loading');
		} else {
			if (!this.loadMask) {
				this.loadMask = new Ext.LoadMask(this.el, {msg: maskMessage});
			}
			this.loadMask.show();
		}
	}
	
	/**
	 * Removes mask from afStudio.viewport
	 * @param {String} region The region to unmask
	 */
	,unmask : function(region) {
		if (['center', 'west', 'north', 'south'].indexOf(region) != -1) {			
			this.viewRegions[region].body.unmask();
		}
		this.loadMask ? this.loadMask.hide() : null;
	}
	
	/**
	 * Adds component to {@link Ext.ux.Portal} container.
	 * Look at {@link Ext.ux.Portal}
	 *  
	 * @param {Ext.Component/Array} component The component/array of component to add
	 * @param {Boolean} removeOthers This specifies if should be deleted all container's elements before add (defaults is false)
	 * @param {Number} column The portal column number (defaults is 0)
	 * @author Nikolai
	 */
	,addToPortal : function(component, removeOthers, column) {
		var cp = Ext.getCmp('center_panel');
		    clnNum = column ? column : 0,
		    portalColumn = cp.items.itemAt(clnNum);
		    
		if (removeOthers === true) {
			portalColumn.removeAll(true);
		}		
		portalColumn.add(component);
		portalColumn.doLayout();    
	}
	
	/**
	 * Clears center region of afStudio 
	 */
	,clearPortal : function() {
		var cp = Ext.getCmp('center_panel');		    
		    
		cp.items.each(function(column, index, colNumber){
			column.removeAll(true);
		});			
	}
});