/**
 * This class is dedicated for WD managing.
 * 
 * @class WD
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.WD = function() {
	
	return {
		
		/**
		 * Opens widget for preview in new browser's window.
		 * @param {String} uri The widget's uri being opened
		 * @param {String} (optional) title The widget's title
		 */
		previewWidget : function(uri, title) {
			var url = Ext.urlAppend(afStudioWSUrls.widgetPreviewUrl, Ext.urlEncode({uri: uri, title: title}));
			window.open(url, 'widget-preview');
		},
		
		/**
		 * Returns gui view constructor.
		 * @param {String} type The view type
		 * @return {Function} view constructor or null if view's constructor was not found 
		 */
		getGuiView : function(type) {
			var viewName = type.ucfirst() + 'View';
			
			try {			
				return afStudio.wd[type][viewName];
			} catch (e) {
				afStudio.Msg.warning('Widget Designer', 
					String.format('<b>{0}</b> was not found <br/> view type - <u>{1}</u>', viewName, type));	
			}
			
			return null;
		},
		
		/**
		 * Creates and opens {@link afStudio.wd.WidgetDesigner}.
		 * @param {Object} cfg The widget configuration object.
		 */
		showWidgetDesigner : function(cfg) {
			var ctr = new afStudio.controller.ViewController({
			    widget: cfg,
			    listeners: {
			    	ready: function(controller) {
						var mt = controller.getModelType(),
							view = afStudio.WD.getGuiView(mt);
							
						if (view) {
							controller.registerView('widget', view);
						} else {
							afStudio.vp.clearWorkspace();
							afStudio.Msg.info(String.format('View type {0} is under development', mt));
							return;
						}
						
						afStudio.vp.addToWorkspace({
							xtype: 'wd',
							controller: controller
						}, true);
					}
			    }
			    
			});
			
			ctr.run();
		},
		//eo showWidgetDesigner
		
		/**
		 * Returns view definition carcass.
		 * @param {String} type The view type
		 * @return {Object} view definition
		 */
		getViewCarcass : function(type) {
			return {
			    attributes: {
			        'type': type,
			        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			        'xsi:schemaLocation': 'http:\/\/www.appflower.com\/schema\/appflower.xsd',
			        'xmlns:i': 'http://www.appflower.com/schema/'
			    }
			};
		},
		//eo getViewCarcass
		
		/**
		* open WD for a specific node found from app/module/action uri
		*/
		findShowWidgetDesigner : function(app,module,action) {		    
		    var tree = Ext.getCmp('widgets');
		    
		    path = String.format('/root/{0}/{1}/{2}', app, module, action);
            
            tree.expandPath(path, 'text', function(success, lastNode){
                tree.runNode(lastNode);
            });		    
		    
		}
		
	};
}();