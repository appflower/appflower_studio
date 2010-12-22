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
	}	
	
	/**
	 * Create user interface
	 * @return {Object} the component instance
	 * @private
	 */
	,_initCmp : function() {
    
		this.propertiesGrid = new Ext.grid.PropertyGrid({
			region: 'south',
			split: true,
	        frame: true,
			height: 150,
	        propertyNames: {
	            wtype: 'Widget Type',
	            maxperpage: 'Maximum per page'
	        },
	        
	        listeners: {
	        	'afteredit': function(e){
	        		//Create tooltip for edited row.
	        		this.onGridRefresh(e.grid.getView());
	        		var node = this.widgetInspectorTree.getSelectionModel().getSelectedNode();
	        		this.rootNode.attributes.setPropertyField(node, e.record);
	        	}, scope: this
	        },
	        
	        customRenderers: {
	        	wtype: function(v){
	        		switch(v){
	        			case 'list': {
	        				v = 'List';
	        				break;
	        			}
	        			case 'show':{ 
	        				v = 'Show';
	        				break;
	        			}
	        			case 'edit': {
	        				v = 'Edit';
	        				break;
	        			}
	        		}
	        		return v;
	        	}
	        },
	        
	        customEditors: {
	        	wtype: new Ext.grid.GridEditor(new Ext.form.ComboBox({
	        		selectOnFocus:true, 
	        		store: [['list', 'List'], ['edit', 'Edit'], ['show', 'Show']],
	        		triggerAction: 'all'
	        	})),
	        },
	        
	        layout: 'fit',
	        
	        source: {},
	        viewConfig : {
	            forceFit: true,
	            scrollOffset: 19
	        }
    	});
		this.propertiesGrid.getView().on('refresh', this.onGridRefresh, this);
		
		//Create widget inspector tree item
		var scope = this;
		this.widgetInspectorTree = new Ext.tree.TreePanel({
			region: 'center',
            animate:true, autoScroll:true, 
			frame: true,
			
			bbar: [
				{text: 'Buil JSON', handler: this.buildJSONString, scope: this}
			],
			
            listeners: {
            	'click': function(node, e){
    				var fields = node.getProperties();
    				this.propertiesGrid.setSource(fields);
            	}, scope: scope
            },			
			
            containerScroll: true, 
            rootVisible: false,
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
	        		if(!cmp.isVisible()){
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
        	
			url:'/appFlowerStudio/filetree'
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
	},	
	
	buildJSONString: function(){
		function Dump(d,l) {
		    if (l == null) l = 1;
		    var s = '';
		    if (typeof(d) == "object" && typeof(d) != "function") {
		        s += typeof(d) + " {\n";
		        for (var k in d) {
		            for (var i=0; i<l; i++) s += "  ";
		            s += k+": " + Dump(d[k],l+1);
		        }
		        for (var i=0; i<l-1; i++) s += "  ";
		        s += "}\n"
		    } else {
		    	if(typeof(d) != "function")
			        s += "" + d + "\n";
		    }
		    return s;
		}
		
		var root = this.rootNode.getOwnerTree().getRootNode();
		var fields = this.rootNode.attributes.getModifiedFields(root);
		
		var s = Dump(fields, 10);
		alert(s)
	},
	
	/**
	 * Function _initEvents
	 */
	_initEvents: function(){
		var fn = function(cmp){
			var _this = this;
			(function(){
				cmp.body.mask('Building inspector. Please wait.')
				//SEND AJAX REQUEST
			}).defer(1000, this);
			
			(function(){
				cmp.body.unmask()
				
				
				
				
				//SUCCESSFULL
				var response = {
					"success": true,
					"data": "{\"xmlns:xsi\":\"http:\\\/\\\/www.w3.org\\\/2001\\\/XMLSchema-instance\",\"xsi:schemaLocation\":\"http:\\\/\\\/www.appflower.com \\\/schema\\\/appflower.xsd\",\"xmlns:i\":\"http:\\\/\\\/www.appflower.com\\\/schema\\\/\",\"type\":\"list\",\"i:title\":\"User Management\",\"i:params\":{\"i:param\":{\"name\":\"maxperpage\",\"_content\":\"20\"}},\"i:proxy\":{\"url\":\"parser\\\/listjson\"},\"i:datasource\":{\"type\":\"orm\",\"i:class\":\"afGuardUserPeer\",\"i:method\":{\"name\":\"getAllUsers\",\"i:param\":{\"name\":\"foo\",\"_content\":\"1\"}}},\"i:display\":{\"i:visible\":\"html_status,username,account,html_name,login\"},\"i:fields\":{\"i:column\":[{\"name\":\"html_status\",\"sortable\":\"false\",\"editable\":\"false\",\"resizable\":\"false\",\"style\":\"css\",\"label\":\"Status\"},{\"name\":\"html_name\",\"sortable\":\"false\",\"editable\":\"false\",\"resizable\":\"false\",\"style\":\"css\",\"label\":\"Name\",\"filter\":\"[type:string]\"},{\"name\":\"username\",\"sortable\":\"false\",\"editable\":\"false\",\"resizable\":\"false\",\"style\":\"css\",\"label\":\"Username\",\"filter\":\"[type:string]\"},{\"name\":\"allocated_time_weekly\",\"sortable\":\"false\",\"editable\":\"false\",\"resizable\":\"false\",\"style\":\"css\",\"label\":\"Allocated time per week\",\"filter\":\"[type:string]\"},{\"name\":\"login\",\"sortable\":\"false\",\"editable\":\"false\",\"resizable\":\"false\",\"style\":\"css\",\"label\":\"Last Login\",\"filter\":\"[type:date,dataIndex:timestamp]\"}]},\"i:rowactions\":{\"i:action\":[{\"name\":\"delete\",\"iconCls\":\"icon-minus\",\"url\":\"afGuardUser\\\/delete\",\"tooltip\":\"Delete User\",\"condition\":\"afGuardUserPeer,IsEditable\"},{\"name\":\"edit\",\"iconCls\":\"icon-application-key\",\"url\":\"afGuardUser\\\/edit\",\"tooltip\":\"Delete User\",\"condition\":\"afGuardUserPeer,IsEditable\"}]},\"i:actions\":{\"i:action\":[{\"name\":\"Add User\",\"iconCls\":\"icon-plus\",\"url\":\"afGuardUser\\\/edit\",\"condition\":\"afGuardUserPeer,IsNewUserAllowed\"},{\"name\":\"Manage roles\",\"iconCls\":\"icon-application-key\",\"url\":\"\\\/afGuardGroup\\\/list\"}]},\"i:moreactions\":{\"i:action\":[{\"name\":\"Activate Selected\",\"confirmMsg\":\"You are going to activate the selected users.\\\\r\\\\nAre you sure?\",\"post\":\"true\",\"icon\":\"\\\/images\\\/famfamfam\\\/accept.png\",\"url\":\"\\\/afGuardUser\\\/listActionsUserStatus\\\/activate\"},{\"name\":\"Deactivate Selected\",\"confirmMsg\":\"You are going to deactivate the selected users.\\\\r\\\\nAre you sure?\",\"post\":\"true\",\"icon\":\"\\\/images\\\/famfamfam\\\/delete.png\",\"url\":\"\\\/afGuardUser\\\/listActionsUserStatus\\\/deactivate\"},{\"name\":\"Delete Selected\",\"confirmMsg\":\"Are you sure to delete selected users\",\"post\":\"true\",\"icon\":\"\\\/images\\\/famfamfam\\\/cross.png\",\"url\":\"\\\/afGuardUser\\\/listActionsRemoveUser\"},{\"name\":\"Delete All\",\"forceSelection\":\"false\",\"confirmMsg\":\"Are you sure to delete all users\",\"post\":\"true\",\"icon\":\"\\\/images\\\/famfamfam\\\/cross.png\",\"url\":\"\\\/afGuardUser\\\/listActionsRemoveUser\\\/all\"}]},\"i:description\":\"This widget lists the basic information about all the users of the system. You can add, edit or delete the users of the system.\"}"
				}
				var data = Ext.decode(response.data);

				
				_this.rootNode = new afStudio.widgetDesigner.ListNode(data);
        		_this.widgetInspectorTree.setRootNode(_this.rootNode);
			}).defer(3000);
		}
		this.widgetInspectorTree.on('afterrender', fn, this);
	}
});
Ext.reg('afStudio.widgetDesigner.inspector', afStudio.widgetDesigner.inspector);