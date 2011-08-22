Ext.namespace('afStudio.wd');

//TODO ALL will be rewritten
afStudio.wd.WidgetFactory = function() {
	
	return {
		
		/**
		 * Creates and opens {@link afStudio.wd.WidgetDesigner}.
		 * @param {Object} cfg The widget configuration object.
		 */
		showWidgetDesigner : function(cfg) {
			
			var c = new afStudio.controller.ViewController({
			    widget: cfg,
			    listeners: {
			    	ready: function() {
						var mt = this.getModelType();
						
						if (mt == 'list') {
							this.registerView('widget', afStudio.wd.list.ListView);
						} else {
							afStudio.vp.clearWorkspace();
							afStudio.Msg.info(String.format('View type {0} is under development', mt));
							return;
						}
						afStudio.vp.addToWorkspace({
							xtype: 'widgetdesigner', 
							controller: c
						}, true);
					}
			    }
			});
			
			c.run();
		}
		
		
	};
}();