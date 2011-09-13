/**
 * ViewController class serves AppFlower Views structure. 
 * 
 * @class afStudio.controller.ViewController
 * @extends afStudio.controller.BaseController
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.controller.ViewController = Ext.extend(afStudio.controller.BaseController, {

	/**
	 * @cfg {String|Object} url 
	 * Defaults to url:
	 * <ul>
	 * 	<li><b>read</b>: {@link afStudioWSUrls#widgetGetDefinitionUrl}</li>
	 * 	<li><b>save</b>: {@link afStudioWSUrls#widgetSaveDefinitionUrl}</li>
	 * </ul>
	 */
	url : {
		read: afStudioWSUrls.widgetGetDefinitionUrl,
		save: afStudioWSUrls.widgetSaveDefinitionUrl
	},
	
	/**
	 * Required & Read-Only.
	 * The view meta information.
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
     * ViewController
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
		
		this.setupUrls();
		
    	this.setupViews();
    },
    //eo constructor
    
    /**
     * Configures urls.
     * @protected
     */
    setupUrls : function() {
		this.url = {
			read: this.getUrl('read', {uri: this.widget.uri}),
			save: this.getUrl('save', {uri: this.widget.uri})
		}
    },
    
    /**
     * Configures views.
     * ViewController has two registered views by default: {@link afStudio.view.inspector.InspectorTree}
     * and {@link afStudio.view.property.PropertyGrid}.
     * @protected
     */
    setupViews : function() {
    	Ext.apply(this.views, {
	        inspectorTree: {
	            view: afStudio.view.inspector.InspectorTree,
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
    },
    
    /**
     * Returns model type. This method should be used only when controller is ready, look at {@link #isReady}.
     * @return {String} model type
     */
    getModelType : function() {
    	var model = this.getRootNode();
    	
    	return model.getModelType();
    },
    
    /**
     * Returns widget data.
     * @return {Object} widget
     */
    getWidget : function() {
    	return this.widget;
    },
    
    /**
     * Saves view model.
     * @override
     * @public
     * @param {Object} (Optional) params The save parameters
     */    
    saveView : function(params) {
    	params = Ext.copyTo(params || {}, this.widget, 'uri, place, placeType');
    	params.widgetType = this.getModelType();
    	
    	afStudio.controller.ViewController.superclass.saveView.apply(this, [params]);
    }

});