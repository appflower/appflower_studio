Ext.namespace('afStudio.layoutDesigner');

/**
 * Widget Selector window, uses tree component to pick up widget. 
 * 
 * @class afStudio.layoutDesigner.WidgetSelectorTreeWindow
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.layoutDesigner.WidgetSelectorTreeWindow = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {String} Url (defaults to '/afsLayoutBuilder/getWidgetList')
	 */
	widgetListUrl : '/afsLayoutBuilder/getWidgetList'
	
	/**
	 * @property {Ext.tree.TreePanel} selectorTree
	 * Widget selector tree
	 */
	
	/**
	 * @property {Ext.Button} addWidgetBtn
	 * Add widget button
	 */
	
	/**
	 * Closes/Hides this window
	 */
	,closeWidgetSelectorTreeWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	}//eo closeWidgetSelectorTreeWindow
	
	/**
	 * Fires this window <u>widgetselect</u> event
	 */
	,selectWidget : function() {
		var t = this.selectorTree,
			treeSm = t.getSelectionModel(),
			selectedNode = treeSm.getSelectedNode();
		
		if (this.isNodeWidget(selectedNode)) {
			var eventObj = {
				module: this.getNodeAttribute(selectedNode, 'module'),
				widget: this.getNodeAttribute(selectedNode, 'widget')
			};
			
			this.closeWidgetSelectorTreeWindow();
			this.fireEvent('widgetselect', eventObj);
		}
	}//eo selectWidget
	
	/**
	 * Loads widgets list
	 */
	,loadWidgetList : function() {
		var treeLoader = this.selectorTree.getLoader(),
			rootNode = this.selectorTree.root;
			
		treeLoader.load(rootNode);
	}//eo loadModules
	
	
	/**
	 * This <u>show</u> event listener
	 * Sets first active tab and loads data
	 */
	,onWidgetSelectorShow : function() {
		this.addWidgetBtn.disable();
		this.loadWidgetList();
	}//eo onWidgetSelectorShow	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var selectorTree = new Ext.tree.TreePanel({
			ref: 'selectorTree',
		  	autoScroll: true,
		    animate: true,
		    containerScroll: true,
		    anchor: '100%',
		    border: false,
		    dataUrl: _this.widgetListUrl,
		    root: {
		        nodeType: 'node',
		        text: 'WidgetList',
		        draggable: false,
		        id: 'widget-list-root'
		    },
		    rootVisible: false				
		});
		
		return {
			title: 'Add Widget',
			closeAction: 'hide',
			modal: true,
			frame: true,
			width: 348,
			height: 400,
			closable: true,
            resizable: false,
            layout: 'fit',
            items: selectorTree,
            buttonAlign: 'center',
			buttons: [
			{
				text: 'Add Widget',
				ref: '../addWidgetBtn',
				disabled: true,
				handler: _this.selectWidget, 
				scope: _this				
			},{
				text: 'Cancel', 
				handler: _this.closeWidgetSelectorTreeWindow, 
				scope: _this
			}]
		}
	}//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.layoutDesigner.WidgetSelectorTreeWindow.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		var _this = this,
			tree = this.selectorTree,
		    treeLoader = tree.getLoader();

		_this.addEvents(
			/**
			 * @event 'widgetselect' Fires when widget was selected
			 * @param {Object} widgetParam the {'module': MODULE_NAME, 'widget': WIDGET_NAME}
			 */
			'widgetselect'
		);
		
		//Loader Events
		treeLoader.on({
			 beforeload: function(loader, node, clb) {
			 	node.getOwnerTree().body.mask('loading, please wait...', 'x-mask-loading');
			 }
			 ,load : function(loader, node, resp) {
				node.getOwnerTree().body.unmask();
			 }
			 ,loadexception: function(loader, node, resp) {
				node.getOwnerTree().body.unmask();
			 }
		});		
		
		//Tree events
		tree.on({
			click: _this.onNodeClick,
			dblclick: _this.onNodeDblClick,			
			scope: _this
	    });
		
		
		_this.on({
			'show': Ext.util.Functions.createDelegate(_this.onWidgetSelectorShow, _this)
		});
	}//eo _afterInitComponent
	
    /**
     * Returns node's attribute
     * @param {Ext.tree.TreeNode} node required
     * @param {String} attribute required
     * @param {Mixed} defaultValue optional
     * @return attribute / defaultValue / null
     */
    ,getNodeAttribute : function(node, attribute, defaultValue) {
    	return node.attributes[attribute]
    				? node.attributes[attribute] 
    				: (defaultValue ? defaultValue : null);
    }//eo getNodeAttribute
	
    /**
     * Checks if passed in node is a widget
     * @param {Ext.data.Node} node
     * @return {Boolean} true if node is a widget otherwise false
     */
    ,isNodeWidget : function(node) {
		var type = this.getNodeAttribute(node, 'type'),
			isWidget = false;

		if (type == 'xml') {
			isWidget = true;
		}
		
    	return isWidget;
    }//eo isNodeWidget
    
	/**
	 * Tree <u>click</u> event listener.
	 * 
	 * @param {Ext.data.Node} node
	 * @param {Ext.EventObject} e
	 */
	,onNodeClick : function(node, e) {
		if (this.isNodeWidget(node)) {
			this.addWidgetBtn.enable();
		} else {
			this.addWidgetBtn.disable();
		}
	}//eo onNodeClick
	
	/**
	 * Tree <u>dblclick</u> event listener. 
	 * 
	 * Fires when a node is double clicked.
	 * @param {Ext.data.Node} node The node
	 * @param {Ext.EventObject} e
	 */	
	,onNodeDblClick : function(node, e) {
		if (this.isNodeWidget(node)) {
			this.selectWidget();
		}
	}//eo onNodeDblClick
	
});
