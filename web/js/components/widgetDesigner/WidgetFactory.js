Ext.namespace('afStudio.wd');

afStudio.wd.WidgetFactory = function() {
	
	return {
		
		/**
		 * Creates WI root node
		 * @param {String} type The widget type
		 * @return {afStudio.wi.ObjectRootNode} concrete implementation of WI root node 
		 */
		createWIRootNode : function(type) {
			var root;
	   	    
	       	switch (type) {
	           case 'list':
	               root = new afStudio.wi.ListNode();
	           break;
	           case 'edit':
	               root = new afStudio.wi.EditNode();
	           break;
	       	}
	       	
	       	return root;
		}//eo createRootNode
		
		/**
		 * Builds widget's definition.
		 * @param {Array} data The widget data
		 * @param {String} type The widget type
		 * @return {Object} widget definition
		 */
		,buildWidgetDefinition : function(data, type) {
			var rootNode = this.createWIRootNode(type);			
		
        	rootNode.setTitle('new widget');
		
			for (k = 0; k < data.length; k++) {
	            var field = rootNode.getFieldsNode().addChild();
	            field.setNameAndLabel(
	                data[k].field,
	                data[k].field.ucfirst()
	            );
	            if (type == 'edit') {
	                field.setTypeAndValidatorFromModelType(data[k]);
	                field.getProperty('valueType').set('value', 'orm');
	            }
			}

	        if (data.length > 0) {
	            var modelFromFirstField = data[0].model;
	            rootNode.getDatasourceNode().setClassFromModel(modelFromFirstField, type);
	        }
			
	        return rootNode.dumpDataForWidgetDefinition();
		}//eo buildWidgetDefinition
		
		/**
		 * Creates and Opens {@link afStudio.wd.WidgetPanel} widget designer panel.
		 * @param {String} widgetUri The widget URI
		 * @param {String} action The action path
		 * @param {String} security The security path
		 */
		,showWidgetDesigner : function(widgetUri, action, security) {
			afStudio.vp.addToPortal({
				xtype: 'afStudio.wd.widgetPanel',
				actionPath: action,
				securityPath: security,
		        widgetUri: widgetUri
			}, true);
		}//eo showWidgetDesigner
	};
}();