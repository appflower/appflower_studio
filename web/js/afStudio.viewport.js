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
		
		var config = {
			layout: "border",
			id: "viewport",
			items: [
				northPanel,
				new afStudio.westPanel(),
				centerPanel,
				new afStudio.southPanel()
			]
		};
		
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.viewport.superclass.initComponent.apply(this, arguments);	
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
});