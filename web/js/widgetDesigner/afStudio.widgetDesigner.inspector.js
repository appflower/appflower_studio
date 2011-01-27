/**
 * Widget Inspector Container
 * @class afStudio.widgetDesigner.inspector
 * @extends Ext.Container
 */
afStudio.widgetDesigner.inspector = Ext.extend(Ext.Container, {
	
	xtype: 'panel', 

	layout: 'accordion',
	style: 'border-top: 1px solid #99BBE8',

	/**
	 * @var {Object} widgetInspectorTree
	 * Ext.TreePanel component
	 */
	widgetInspectorTree: null,

	/**
	 * @var {Object} propertiesGrid
	 * Ext.grid.PropertyGrid component
	 */	
	propertiesGrid: null,

	/**
	 * @var {Object} widgetDefinition
	 * Definition of a widget - its properties all values
	 */
	widgetDefinition: null,

	/**
	 * @var {Object} treeEditor
	 * Ext.tree.TreeEditor component
	 */		
	treeEditor: null,
	
	/**
	 * initComponent method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, Ext.apply(this.initialConfig, this._initCmp()));
		afStudio.widgetDesigner.inspector.superclass.initComponent.apply(this, arguments);
		this._initEvents();
		
		//TODO: calculate and width to the WidgetInpectorTree and Properties grid
		(function(){
			var h1 = this.propertiesGrid.getHeight();
			var h2 = this.widgetInspectorTree.getHeight();
			
			var h = (h1+h2)/2;
			
			this.propertiesGrid.setHeight(h);
			this.widgetInspectorTree.setHeight(h);
			
			//Hot fix
			this.layout.setActiveItem(1);
			this.layout.setActiveItem(0);
		}).defer(100, this);
	}
	
	/**
	 * Create user interface
	 * @return {Object} the component instance
	 * @private
	 */
	,_initCmp : function() {
    
//		this.propertiesGrid = new Ext.grid.PropertyGrid({
		this.propertiesGrid = new afStudio.widgetDesigner.PropertyGrid({
			region: 'south',
			split: true,
	        frame: true,
			
			height: 150,
			
	        propertyNames: {
//	            valueType: 'Value Type',
//	            valueChoice: 'Value Choice'
	        },
	        
	        listeners: {
	        	'render': function(cmp){

	        		
	        	},
	        	'afteredit': function(e){
	        		//Create tooltip for edited row.
	        		this.onGridRefresh(e.grid.getView());
                    if (e.record && e.record.WITreeNode) {
                        e.record.WITreeNode.propertyChanged(e.record);
                    }
	        	}, scope: this
	        },
	        
	        customRenderers: {},
	        customEditors: {},
	        
	        layout: 'fit',
	        
	        source: {},
	       
			view: new Ext.grid.GroupingView({
				scrollOffset: 19,
				forceFit:true,
	            showGroupName: false,
	            groupTextTpl: '{text}'
	        })
    	});
    	
    	
    	
    	
		this.propertiesGrid.getView().on('refresh', this.onGridRefresh, this);
		
		//Create widget inspector tree item
		var scope = this;
		this.widgetInspectorTree = new Ext.tree.TreePanel({
			region: 'center',
            animate:true, autoScroll:true, 
			frame: true,
			
			bodyStyle: 'border-bottom: 1px solid #99BBE8',
			
			bbar: [
				{text: 'Save', handler: this.saveWidget, scope: this}
			],
			
            listeners: {
            	'click': function(node, e){
    				var fields = node.getProperties();
    				this.propertiesGrid.setSource(fields);
            	}, scope: scope
            },			
			
            containerScroll: true, 
            layout: 'fit'
        });
        
        //Create and setup root item
        var root = new Ext.tree.AsyncTreeNode({
            expanded: true,
            text: 'Widget Inspector',
			id: 'widgetinspector'
        });
        new Ext.tree.TreeSorter(this.widgetInspectorTree, {folderSort:true});
		this.widgetInspectorTree.setRootNode(root);
		
		this.treeEditor = new Ext.tree.TreeEditor(this.widgetInspectorTree, {}, {
	        allowBlank:false,
	        blankText: 'A field is required',
	        selectOnFocus:true,
	        
	        listeners: {
	        	'beforestartedit': function(editor, boundEl, value){
	        		var cmp = Ext.getCmp('widget-inspector-menu');
	        		if(cmp && !cmp.isVisible()){
	        			return false;
	        		}
	        	},
	        	'complete': function(editor, value, startValue){
	        		var node = editor.tree.getSelectionModel().getSelectedNode();
	        		if(node && ('field' == node.attributes.itemId) ){
	        			node.text = value;
	        			editor.tree.fireEvent('click', node);
	        		}
	        	}
	        }
	    });
		
        this.codeBrowserTree = new Ext.ux.FileTreePanel({
        	region: 'center',
        	
			url:window.afStudioWSUrls.getFiletreeUrl()
			,width:248
			,height:500
			,id:'ftp'
			,rootPath:'root'
			,rootVisible:true
			,rootText:'Home'
			,maxFileSize:524288*2*10
			,topMenu:false
			,autoScroll:true
			,enableProgress:false
			,singleUpload:true
			,frame:true
		});

        var widgetInspector = new Ext.Panel({
            title: 'Widget Inspector',
            layout: 'border',
            items:[
            	this.widgetInspectorTree, this.propertiesGrid
            ]
        });
        
        var codeBrowser = new Ext.Panel({
            title: 'Code Browser',
            layout: 'border',
            items:[
            	this.codeBrowserTree
            ]
        });

		
		return {
			itemId: 'inspector',	
			items: [
				widgetInspector, codeBrowser
			]
		}
	},
	
	/**
	 * Function onGridRefresh
	 * Creates QTips for each row in grid
	 * @param {Objectt} view - grid view
	 */
	onGridRefresh: function(view){
		var grid = view.grid;
   		var ds = grid.getStore();
    	for (var i=0, rcnt=ds.getCount(); i<rcnt; i++) {
    		
    		var rec = ds.getAt(i);
    		var html = '<b>' + rec.get('name') + ':</b> ' + rec.get('value');
			
        	var row = view.getRow(i);
        	var els = Ext.get(row).select('.x-grid3-cell-inner');
    		for (var j=0, ccnt=els.getCount(); j<ccnt; j++) {
          		Ext.QuickTips.register({
            		target: els.item(j),
            		text: html
        		});
    		}
		}
		grid.hideMandatoryCheckers();
	},	
	
	saveWidget: function(){
		this.widgetInspectorTree.body.mask('Loading, please Wait...', 'x-mask-loading');
        this.widgetDefinition.save();
	},
	
	/**
	 * Function _initEvents
	 */
	_initEvents: function(){
		var fn = function(cmp){
			var _this = this;
				cmp.body.mask('Building inspector. Please wait.')
				
                _this.widgetDefinition = new afStudio.widgetDesigner.WidgetDefinition(this.widgetUri);
                _this.widgetDefinition.fetchAndConfigure(_this);
                
				cmp.body.unmask()
		}
		this.widgetInspectorTree.on('afterrender', fn, this);
	},
    setRootNode: function(rootNode){
        this.rootNode = rootNode;
        this.widgetInspectorTree.setRootNode(rootNode);
        this.widgetInspectorTree.expandAll();
    }
});
Ext.reg('afStudio.widgetDesigner.inspector', afStudio.widgetDesigner.inspector);
