/**
 * Widget Inspector Container
 * @class afStudio.wd.inspector
 * @extends Ext.Container
 */
afStudio.wd.Inspector = Ext.extend(Ext.Container, { 

	/**
	 * @cfg {String} layout (sets to 'accordion') 
	 */
	layout : 'accordion'
	
	/**
	 * @cfg {String} style
	 */
	,style: 'border-top: 1px solid #99BBE8;'

	/**
	 * @property widgetInspectorTree
	 * @type {Ext.tree.TreePanel}
	 */

	/**
	 * @property propertiesGrid
	 * @type {Ext.grid.PropertyGrid}
	 */

	/**
	 * @property treeEditor
	 * @type {Ext.tree.TreeEditor}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
   		var _this = this;
		
		this.propertiesGrid = new afStudio.wi.PropertyGrid({
			region: 'south',
			split: true,			
			height: 150,			
	        propertyNames: {
//	            valueType: 'Value Type',
//	            valueChoice: 'Value Choice'
	        },	        
	        listeners: {
	        	'render': function(cmp) {	        		
	        	},
	        	'afteredit': function(e) {
	        		//Create tooltip for edited row.
	        		this.onGridRefresh(e.grid.getView());
                    if (e.record && e.record.WITreeNode) {
                        e.record.WITreeNode.propertyChanged(e.record);
                    }
	        	}, 
	        	scope: this
	        },	        
	        customRenderers: {},
	        customEditors: {},	        
	        layout: 'fit',	        
	        source: {},	       
			view: new Ext.grid.GroupingView({
				scrollOffset: 19,
				forceFit: true,
	            showGroupName: false,
	            groupTextTpl: '{text}'
	        })
    	});
    	
		this.propertiesGrid.getView().on('refresh', this.onGridRefresh, this);
		
		//Create widget inspector tree item
		this.widgetInspectorTree = new Ext.tree.TreePanel({
			region: 'center',			
            animate: true,
            containerScroll: true,
            autoScroll: true, 
			bodyStyle: 'border-bottom: 1px solid #99BBE8',			
			layout: 'fit',
			bbar: [
			{
	            text: 'Save',
	            handler: function() {
	                this.widgetInspectorTree.body.mask('Loading, please Wait...', 'x-mask-loading');
	                var widgetsTreePanel = afStudio.getWidgetsTreePanel()
	                widgetsTreePanel.saveWidgetDefinition();
	            },
	            scope: this
	        }],
            listeners: {
            	'click': function(node, e) {
    				var fields = node.getProperties();
    				this.propertiesGrid.setSource(fields);
            	}, 
            	scope: _this
            }
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
	        allowBlank: false,
	        blankText: 'A field is required',
	        selectOnFocus: true,	        
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
        	id: 'ftp',
        	title: 'Code Browser',
			url: afStudioWSUrls.getFiletreeUrl(),
			width: 248,
			height: 500,			
			rootPath: 'root',
			rootVisible: true,
			rootText: 'Home',
			maxFileSize: 524288 * 2 * 10,
			topMenu: false,
			autoScroll: true,
			enableProgress: false,
			singleUpload: true
		});

        var widgetInspector = new Ext.Panel({
            title: 'Widget Inspector',
            layout: 'border',
            items: [
            	this.widgetInspectorTree, 
            	this.propertiesGrid
            ]
        });     
        
		return {
			itemId: 'inspector',
			items: [
				widgetInspector,
				this.codeBrowserTree
			]
		};
	}//eo _beforeInitComponent	
	
	/**
	 * initComponent method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.wd.Inspector.superclass.initComponent.apply(this, arguments);
		
		//TODO: calculate and width to the WidgetInpectorTree and Properties grid
		(function(){
			var h1 = this.propertiesGrid.getHeight(),
				h2 = this.widgetInspectorTree.getHeight(),			
				 h = (h1 + h2) / 2;
			
			this.propertiesGrid.setHeight(h);
			this.widgetInspectorTree.setHeight(h);
			
			//Hot fix
			this.layout.setActiveItem(1);
			this.layout.setActiveItem(0);
		}).defer(100, this);
	}//eo initComponent
	
	/**
	 * Function onGridRefresh
	 * Creates QTips for each row in grid
	 * @param {Objectt} view - grid view
	 */
	,onGridRefresh: function(view){
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
	}//eo onGridRefresh
		
    ,setRootNode: function(rootNode){
        this.widgetInspectorTree.setRootNode(rootNode);
        this.widgetInspectorTree.expandAll();
    }//eo setRootNode
});

Ext.reg('afStudio.wd.inspector', afStudio.wd.Inspector);