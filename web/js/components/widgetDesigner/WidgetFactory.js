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
	           case 'list': case 'grid':
	               root = new afStudio.wi.ListNode();
	           break;
	           
	           case 'edit': case 'show':
	               root = new afStudio.wi.EditNode();
	           break;
	           
	           case 'html':
	               root = new afStudio.wi.HtmlNode();
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
		 * @param {Object} cfg The {@link afStudio.wd.WidgetPanel} configuration object.
		 */
		,showWidgetDesigner : function(cfg) {			
			afStudio.vp.addToWorkspace(Ext.apply({xtype: 'afStudio.wd.widgetPanel'}, cfg), true);
		}//eo showWidgetDesigner
	};
}();