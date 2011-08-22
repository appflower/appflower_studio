Ext.namespace('afStudio.wd');

//TODO ALL will be rewritten
afStudio.wd.WidgetFactory = function() {
	
	return {
		
//		/**
//		 * Builds widget's definition.
//		 * @param {Array} data The widget data
//		 * @param {String} type The widget type
//		 * @return {Object} widget definition
//		 */
//		buildWidgetDefinition : function(data, type) {
//			var rootNode = this.createWIRootNode(type);
//		
//        	rootNode.setTitle('new widget');
//		
//			for (k = 0; k < data.length; k++) {
//	            var field = rootNode.getFieldsNode().addChild();
//	            field.setNameAndLabel(
//	                data[k].field,
//	                data[k].field.ucfirst()
//	            );
//	            if (type == 'edit') {
//	                field.setTypeAndValidatorFromModelType(data[k]);
//	                field.getProperty('valueType').set('value', 'orm');
//	            }
//			}
//
//	        if (data.length > 0) {
//	            var modelFromFirstField = data[0].model;
//	            rootNode.getDatasourceNode().setClassFromModel(modelFromFirstField, type);
//	        }
//			
//	        return rootNode.dumpDataForWidgetDefinition();
//		}//eo buildWidgetDefinition
		
		/**
		 * Creates and Opens {@link afStudio.wd.WidgetPanel} widget designer panel.
		 * @param {Object} cfg The {@link afStudio.wd.WidgetPanel} configuration object.
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