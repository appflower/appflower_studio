afStudio.CreateProject = Ext.extend(Ext.Window, { 
	
	initComponent: function(){
		_self = this;
		
		this.tree = new Ext.ux.FileTreePanel({
			url: afStudioWSUrls.project,
			rootPath:'root',
			rootVisible:true,
			rootText:afStudioHost.user+'@'+afStudioHost.name,
			topMenu:false,
			autoScroll:true,
			enableProgress:false,
			singleUpload:true,			
			onDblClick: Ext.emptyFn,
			onContextMenu: Ext.emptyFn,
			listeners: {
				//when node is clicked, path is stored in hidden field and displayed
				click: function(node) {
					var nextPath = currentPath = this.getPath(node).slice(4);
					var projectNameField = _self.form.form.items.items[0];
					var pathDisplayField = _self.form.form.items.items[1];
					var pathField = _self.form.form.items.items[2];					
					var slug = afStudio.createSlug(projectNameField.getValue());

					if(slug!='')
					var nextPath = currentPath+'/'+slug;
						
					pathDisplayField.setValue('<small>'+nextPath+'</small>');
					pathField.setValue(nextPath);
            	},
            	//this expands the nodes starting with root, until open dir node is the one the project sits in, also ensure scroll and selection for dir node
				expandnode: function(node) {
					
					if(node.childNodes)
					{
						for(var i=0;i<node.childNodes.length;i++)
						{
							if(afProjectInPath.indexOf(this.getPath(node.childNodes[i]).slice(4))>-1)
							{
								this.expandPath(node.childNodes[i].getPath());
								
								node.childNodes[i].select();
								node.childNodes[i].ensureVisible();
								
								this.fireEvent('click', node.childNodes[i]);
							}
						}
					}
            	}
			},
			height: 200
		});
		
		this.form = new Ext.FormPanel({
			url: Ext.urlAppend(afStudioWSUrls.project, {cmd: 'save'}),
		    bodyStyle: 'padding: 5px;', 
		    labelWidth: 140, 
			border: false,
			bodyBorder: false,
			items: [
				{xtype:'textfield', enableKeyEvents:true, fieldLabel: 'Project name', anchor: '96%', name: 'name', allowBlank: false, vtype: 'uniqueNode', listeners: {
					keyup: function(field,e) {	
						var slug = afStudio.createSlug(field.getValue());
						var pathDisplayField = _self.form.form.items.items[1];
						var pathField = _self.form.form.items.items[2];
						var nextPath = currentPath = _self.getSelectedNodePath().slice(4);
												
						if(slug!='')
						nextPath = currentPath+'/'+slug;
						
						pathDisplayField.setValue('<small>'+nextPath+'</small>');
						pathField.setValue(nextPath);						
					}					
				}
				},
				{xtype:'label', html: 'Path to Project:', style: 'font: 12px tahoma,arial,helvetica,sans-serif;'},							
				{xtype:'displayfield', name: 'display_path', hideLabel: true, anchor:'100%', style: 'font-weight:bold;', value: '<small>select path below...</small>'},
				_self.tree,
				{xtype:'hidden', name: 'path'},
				{xtype:'label', html: 'Project Description:', style: 'font: 12px tahoma,arial,helvetica,sans-serif;'},
				{xtype:'textarea', hideLabel: true, anchor: '100%', name: 'description', height: 57, style: 'margin-top: 5px;'},
				{xtype: 'checkbox', hideLabel: true, boxLabel: 'Use latest playground version (will be downloaded from appflower.com)', name: 'latest'},
				{xtype: 'checkbox', hideLabel: true, boxLabel: 'Auto-Deploy on Save', name: 'autodeploy'}
			]
		});

		var config = {
			title: 'Create new project', 
			width:450,
			height:450,
			closable: true,
	        draggable: true, 
	        modal: true, 
	        resizable: false,
	        bodyBorder: false, 
	        border: false,
	        layout: 'fit',
            items:[
            	this.form
            ],
	        
			buttons: [
				{text: 'Create', handler: this.create, scope: this},
				{text: 'Cancel', handler: this.cancel, scope: this}
			],
			buttonAlign: 'center'
		};
				
		// apply config
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.CreateProject.superclass.initComponent.apply(this, arguments);	
		this._initEvents();
	},
	
	/**
	 * Function _initEvents
	 * Initialize events
	 */
	_initEvents: function(){
		
	},
	
	/**
	 * Function cancel
	 * Closes window
	 */
	cancel:function(){
		this.close();
	},
	
	create: function()
	{
		var activeForm = this.form.getForm();
		
		if(activeForm.isValid()){
		    activeForm.submit({
		        failure:function(form,action){
		                if(action.result)
		                {
		                	afStudio.updateConsole(action.result.console);
		                	
		                    if(action.result.message)
		                    {
		                        Ext.Msg.alert("Failure", action.result.message, function(){
		                                if(action.result.redirect){
		                                        window.location.href=action.result.redirect;
		                                }
		                        });
		                    }
		                }
		        },
		        success:function(form,action){
		                if(action.result)
		                {
		                	afStudio.updateConsole(action.result.console);
		                	
		                    if(action.result.message)
		                    {
		                        Ext.Msg.alert("Success", action.result.message, function(){
		                                if(action.result.redirect){
		                                        window.location.href=action.result.redirect;
		                                }
		                        });
		                    }
		                }
		        }
		    });
		}
	},
	
	getSelectedNodePath: function()
	{
		var node = this.tree.getSelectionModel().getSelectedNode(), path = false;	
		
		if(node)
		{	
			path = this.tree.getPath(node);
		}
		
		return path;
	}
});

Ext.apply(Ext.form.VTypes, {
    uniqueNode : function(value, field) {
    	var tree = field.ownerCt.ownerCt.tree;
    	var currentNode = tree.getSelectionModel().getSelectedNode();
    	var slug = afStudio.createSlug(value);
        if(currentNode.childNodes)
		{
			for(var i=0;i<currentNode.childNodes.length;i++)
			{
				if(!currentNode.childNodes[i].isLeaf()&&currentNode.childNodes[i].text == slug)
				{
					return false;
				}
			}
		}
		return true;
    },
 
    uniqueNodeText : 'Path to Project already exist! Please choose another Project Name!'
});