/**
 * ViewController class serves AppFlower Views structure. 
 * 
 * @class afStudio.controller.ViewController
 * @extends afStudio.controller.BaseController
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.controller.ViewController = Ext.extend(afStudio.controller.BaseController, {

	/**
	 * TODO place real url! correct afStudioWSUrls.getGetWidgetUrl 
	 * 
	 * @cfg {String} url (defaults to 'URL_HERE')
	 */
	url : '/afsWidgetBuilder/getWidget',
	/**
	 * The view meta information (Required).
	 * @cfg {Object} widget
	 * <ul>
	 * 	<li><b>uri</b>: The view URI.</li>
	 * 	<li><b>placeType</b>: The type of the place where a view is located i.e. <i>app</i>, <i>plugin</i>.</li>
	 * 	<li><b>place</b>: The place's name.</li>
	 * 	<li><b>actionPath</b>: The view actions class path</li>
	 * 	<li><b>securityPath</b>: The view security file path</li>
	 * </ul>
	 */
    
    /**
     * @constructor
     * @param {Object} config Controller configuration object
     */
    constructor : function(config) {
    	config = config || {};
    	
    	afStudio.controller.ViewController.superclass.constructor.call(this, config);
    	
    	if (!config.widget && !Ext.isObject(config.widget)) {
    		throw new afStudio.controller.error.ControllerError('widget-cfg-incorrect');
    	}
		this.widget = config.widget;
		
    	this.url = Ext.urlAppend(this.url, Ext.urlEncode({uri: this.widget.uri}));
		
    	this.setupViews();
    },
    //eo constructor
    
    /**
     * Configures views.
     * @protected
     */
    setupViews : function() {
    	Ext.apply(this.views, {
	        inspectorTree: {
	            view: afStudio.view.inspector.TreePanel,
	            cfg: {
	                border: false
	            }
	        },
	        propertyGrid: {
	            view: afStudio.view.property.PropertyGrid,
	            cfg: {
	                border: false
	            }
	        }
    	});
    }

});