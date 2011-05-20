Ext.namespace('afStudio.viewport');

afStudio.viewport.StudioViewport = Ext.extend(Ext.Viewport, {
	/**
	 * @property viewRegions
	 * Contains all regions of this viewport: 
	 * <ul>
	 *  <li><b>north</b>:  North panel</li>
	 *  <li><b>center</b>: Center panel</li>
	 *  <li><b>west</b>:   West panel</li>
	 * </ul>
	 * @type {Object}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {		
		var northPanel = new Ext.Panel ({
			id: "north_panel",
			region: "north",
			height: 32,
			border: false,
			bodyStyle: "background-color:#dfe8f6;",
			items: afStudio.tb
		});						
		
		var centerPanel = new Ext.Panel({
			id: 'center_panel',
			region: "center",			
			layout: 'fit',
			margins: {right: 5},
			bodyStyle: 'padding: 8px; background-image: url(/appFlowerStudioPlugin/images/bg/background_3.6.2_beta.jpg); background-position: 50% 50%; background-repeat: no-repeat;'
		});
		
		var westPanel = new afStudio.viewport.WestPanel();
		
		this.viewRegions = {
			north: northPanel,
			center: centerPanel,
			west: westPanel
		};		
		
		return {
			id: "studio-viewport",
			layout: "border",
			items: [
				northPanel,
				westPanel,
				centerPanel	
			]
		};
	}//eo _beforeInitComponent	
	
	/**
	 * Ext Template method
	 * @private
	 */	
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.viewport.StudioViewport.superclass.initComponent.apply(this, arguments);
	}//eo initComponent
	
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
			this.el.mask(maskMessage, 'x-mask-loading');
		}
	}//eo mask
	
	/**
	 * Removes mask from afStudio.viewport
	 * @param {String} region The region to unmask
	 */
	,unmask : function(region) {
		if (['center', 'west', 'north', 'south'].indexOf(region) != -1) {			
			this.viewRegions[region].body.unmask();
		}
		this.el.unmask();
	}//eo unmask
	
	/**
	 * Adds component(s) to viewport center region.
	 * @param {Ext.Component/Array} component The component/array of component being added.
	 * @param {Boolean} (Optional) removeOthers This specifies if should be deleted all region's components before add (defaults is false).
	 * @author Nikolai
	 */
	,addToWorkspace : function(component, removeOthers) {
		var cp = this.viewRegions.center;
		    
		if (removeOthers === true) {
			cp.removeAll(true);
		}		
		cp.add(component);
		cp.doLayout();    
	}//eo addToWorkspace
	
	/**
	 * Clears center region of afStudio 
	 */
	,clearWorkspace : function() {
		var cp = this.viewRegions.center;
		cp.removeAll(true);
	}//eo clearWorkspace
});