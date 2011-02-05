Ext.namespace('afStudio.viewport');

afStudio.viewport.StudioViewport = Ext.extend(Ext.Viewport, { 

	/**
	 * @property {Object} viewRegions
	 * Contains all regions of this viewport 
	 * {
	 *  north:  "north panel",
	 *  center: "center panel",
	 *  west:   "west panel",
	 *  south:  "south panel"
	 * }
	 */
	
	initComponent : function() {
		
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
			layout: 'fit',			
			title: "Dashboard",
			items: [
			{				
				columnWidth: 1,
				layout: 'fit',
				style: "padding: 10px;",
				items: [
				]
			}],
			bodyStyle: 'background-image: url(/appFlowerStudioPlugin/images/bg/backgrond_3.6.2.jpg);background-position: 50% 50%;background-repeat: no-repeat;',
			style: "padding-right:5px;"
		});
		
		var  westPanel = new afStudio.viewport.WestPanel(),
		    southPanel = new afStudio.viewport.SouthPanel();
		
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
		afStudio.viewport.StudioViewport.superclass.initComponent.apply(this, arguments);
	}
	
	/**
	 * Puts a mask over afStudio.viewport or its region to disable user interaction.
	 * @param {String/Object} opt (optional) if
	 * opt string -  message,
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