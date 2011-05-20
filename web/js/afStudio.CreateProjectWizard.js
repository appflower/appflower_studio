
afStudio.CreateProjectWizard = Ext.extend(Ext.Window, {
	
	initComponent: function(){
		
		this.initForm1();
		this.initForm2();
		this.initForm3();
		this.initForm4();
		this.initForm5();
		this.initForm6();
		
		var config = {
			title: 'Your new Project', width: 493,
			closable: true, draggable: true, 
	    plain:true, modal: true, resizable: false,
	    bodyBorder: false, border: false, 
	    items: [this.form1, this.form2, this.form3, this.form4, this.form5, this.form6],
			buttons: [
			    {text: 'Previous', handler: this.previous, scope: this, hidden: true},
				  {text: 'Next', handler: this.next, scope: this},
			    {text: 'Save Project', handler: this.save, scope: this, hidden: true},
				
			],
			buttonAlign: 'right',
			listeners: {
				show: function()
				{
					//select the current selected template from the project using afTemplateConfig.template.current
					for (var item in this.dataview.store.data.items)
					{
						if(this.dataview.store.data.items[item].json&&afTemplateConfig.template.current==this.dataview.store.data.items[item].json[1].toLowerCase()){
							this.dataview.selectRange(item,item);
						}
					}
				}
			}
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.CreateProjectWizard.superclass.initComponent.apply(this, arguments);	

	},
	
	//Project form
	initForm1: function(){
		
		_self = this;
				
		var formItems = [
			{xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: '<b>This wizard will help guide you through a few steps to setup your new AppFlower Project.</b><br><br>Please choose your project name.', style: 'margin-bottom: 15px;',},
			{xtype:'textfield', enableKeyEvents:true, fieldLabel: 'Project name', anchor: '96%', name: 'name', allowBlank: false, vtype: 'uniqueNode', 
				listeners: {
					keyup: function(field,e) {	
						var slug = afStudio.createSlug(field.getValue());
						var pathDisplayField = _self.form2.items.items[1];
						var pathField = _self.form2.items.items[3];
						var nextPath = currentPath =  _self.getSelectedNodePath().slice(4);
												
						if(slug!='')
						nextPath = currentPath+'/'+slug;
						
						pathDisplayField.setValue('<small>'+nextPath+'</small>');
						pathField.setValue(nextPath);			
					}					
				}
			}
		];
		
		this.form1 = new Ext.FormPanel({
		  url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			defaults: {allowBlank: false, anchor: '95%'},
			items: formItems
		});
		
	},
	
	//Path form
	initForm2: function(){
		
		_self = this;
		this.tree = new Ext.ux.FileTreePanel({
			url:window.afStudioWSUrls.getProjectLoadTreeUrl(),
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
					var projectNameField =  _self.form1.items.items[1];
					var pathDisplayField = _self.form2.items.items[1];
					var pathField = _self.form2.items.items[3];					
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
			height: 200,
			style: 'background-color:white;'
		});
				
		var formItems = [
			{xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: 'Please select the Web server root folder. The project will be created as a sub-folder to this path, with your project name.', style: 'margin-bottom: 15px;',},
			{xtype:'displayfield', name: 'display_path', hideLabel: true, anchor:'100%', style: 'font-weight:bold;', value: '<small>select path below...</small>'},
			this.tree,
			{xtype:'hidden', name: 'path'}
		];
		
		this.form2 = new Ext.FormPanel({
		  url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			hidden: true,
			defaults: {allowBlank: false, anchor: '100%'},
			items: formItems
		});
		
	},
	
	//Template form
	initForm3: function(){
		
		_self = this;

		this.initDataview();
							
		var formItems = [
			{xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: 'Please select how your want your application theme to look like by selecting one of the templates below.', style: 'margin-bottom: 15px;',},			
			this.dataview
		];
		
		this.form3 = new Ext.FormPanel({
		  url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			hidden: true,
			defaults: {allowBlank: false, anchor: '95%'},
			items: formItems
		});
		
	},
	
	initDataview: function(){
	    var myData = [
	        ['desktoptemplate', 'Desktop', 'template_desktop.png'],
	        ['viewporttemplate', 'Viewport', 'template_viewport.png']
	    ];
	    var store = new Ext.data.SimpleStore({
	        fields: [
	           {name: 'id'},
	           {name: 'name'},
	           {name: 'img'}
	        ],
	        sortInfo: {
	            field: 'name', direction: 'ASC'
	        }
	    });
	    
	    store.loadData(myData);		
		  this.dataview = new Ext.DataView({
	        itemSelector: 'div.thumb-wrap',
	        style:'overflow:auto',
	        multiSelect: true,
	        store: store,
	        tpl: new Ext.XTemplate(
	            '<tpl for=".">',
	            '<div class="thumb-wrap" id="{id}">',
	            '<div class="thumb"><img src="appFlowerStudioPlugin/images/{img}"></div>',
	            '<span>{name}</span></div>',
	            '</tpl>'
	        )
    	});
	},
	
	getSelectedNodePath: function()
	{
		var node = this.tree.getSelectionModel().getSelectedNode(), path = false;	
		
		if(node)
		{	
			path = this.tree.getPath(node);
		}
		
		return path;
	},
	
	//User form
	initForm4: function(){
		var formItems = [
		  {xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: 'Please add your first user for this new project.', style: 'margin-bottom: 15px;',},
			{name: 'first_name', fieldLabel: 'First Name', value: afStudioUser.first_name},
			{name: 'last_name', fieldLabel: 'Last Name', value: afStudioUser.last_name},
			{name: 'username', fieldLabel: 'Username', value: afStudioUser.username},
			{name: 'password', inputType: 'password', fieldLabel: 'Password'},
			{name: 'email', fieldLabel: 'Email', vtype: 'email', value: afStudioUser.email},
			{name: 'role', inputType: 'hidden', value: 'admin'},
		];
		
		this.form4 = new Ext.FormPanel({
			url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			hidden: true,
			defaults: {allowBlank: false, anchor: '95%'},
			items: formItems
		});
	},
	
	//Database form
	initForm5: function(){
		var formItems = [
		  {xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: 'Please fill out the database configuration fields below for AppFlower being able to connect to your database service.', style: 'margin-bottom: 15px;',},			
			{xtype:'textfield', fieldLabel: 'Database', anchor: '96%', name: 'database', allowBlank: false},
			{xtype: 'panel', layout: 'column', 
				border: false, bodyBorder: false,
				defaults: {border: false, bodyBorder: false},
				items: [
					{xtype: 'panel', columnWidth: 0.8, layout: 'form', style: 'margin-right: 5px;',
						
						items: [{xtype: 'textfield', fieldLabel: 'Host', name: 'host', anchor: '92%', allowBlank: false}]
					},
					{xtype: 'panel', width: 100, layout: 'form', labelWidth: 35, columnWidth: 0.2,
						items: [{xtype: 'textfield', fieldLabel: 'Port', name: 'port', anchor: '100%', allowBlank: true}]
					}
				]
			},
			{xtype:'textfield', fieldLabel: 'Username', anchor: '96%', name: 'username', allowBlank: false},
			{xtype:'textfield', fieldLabel: 'Password', anchor: '96%', name: 'password', allowBlank: false, inputType: 'password'},
		];
		
		this.form5 = new Ext.FormPanel({
		    url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			hidden: true,
			defaults: {allowBlank: false, anchor: '95%'},
			items: formItems
		});	
	},
	
	//Virtual host form
	initForm6: function(){
		var formItems = [
			{xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', style: 'margin-bottom: 15px;',},
		];
		
		this.form6 = new Ext.FormPanel({
		    url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			hidden: true,
			defaults: {allowBlank: false, anchor: '95%'},
			items: formItems
		});	
	},
	
	currentItem: 0,
	
	next:function(){
		if (this.items.get(this.currentItem).getForm().isValid()) 
		{
			if (this.currentItem==4) // checking if user exist
			{
				var _this = this;
				Ext.Ajax.request({
					url: window.afStudioWSUrls.getCheckUserExistUrl(),
					params: { 
						username: this.form4.getForm().findField('username').getValue(),
						user: Ext.encode(this.form4.getForm().getValues()),
					},
					success: function(result,request){			   
						var obj = Ext.decode(result.responseText);
						if (!obj.success) {
							_this.form4.getForm().findField(obj.field).markInvalid(obj.message);
							return '';
						}
						_this.nextForm();
				   }
				});
				
				return '';
			}
			
			this.nextForm();
		}
	},
	
	nextForm: function(){
		if (this.currentItem==3)
		{
			var name = this.form1.getForm().findField('name').getValue();
			var path = this.form1.getForm().findField('path').getValue();
			var html = '<div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">Now please create a Virtual Host inside your Apache configuration file (httpd.conf, apache.conf ), that will read the path to the newly create project. This way, you\'ll have direct access to your new project, by accessing "'+name+'.local" in your browser.</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;"><br></span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">Here is an example:</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">&lt;VirtualHost *:80&gt;</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">ServerName '+name+'.local</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">DocumentRoot '+path+'/web</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;"><br></span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">DirectoryIndex index.php</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">Alias /sf "'+path+'/lib/vendor/symfony/data/web/sf"</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;"><br></span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">&lt;Directory "'+path+'/web"&gt;</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">&nbsp;AllowOverride All</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">&nbsp;Allow from All</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">&lt;/Directory&gt;</span></font></div><div><font face="tahoma, arial, helvetica, sans-serif"><span style="font-size: 12px;">&lt;/VirtualHost&gt;</span></font></div>';
			this.form6.getForm().findField('infor').update(html);
		}
		
		this.items.get(this.currentItem).hide();
		this.currentItem++;
		this.items.get(this.currentItem).show();
	
		this.setWindowTitle();
	},
	
	previous:function(){
		this.items.get(this.currentItem).hide();
		this.currentItem--;
		this.items.get(this.currentItem).show();
		
		this.setWindowTitle();
	},
	
	save:function(){ // save
		var _this = this;
		Ext.Ajax.request({
			url: window.afStudioWSUrls.getProjectCreateWizardUrl(),
			params: { 
				name: this.form1.getForm().findField('name').getValue(),
				path: this.form1.getForm().findField('path').getValue(),
				template: this.dataview.getSelectedRecords()[0].get('name'),
				
				username: this.form2.getForm().findField('username').getValue(),
				user: Ext.encode(this.form2.getForm().getValues()),
				
				database: this.form3.getForm().findField('database').getValue(),
				host: this.form3.getForm().findField('host').getValue(),
				port: this.form3.getForm().findField('port').getValue(),
				db_user: this.form3.getForm().findField('username').getValue(),
				db_pass: this.form3.getForm().findField('password').getValue(),
			},
			success: function(result,request){			   
				var obj = Ext.decode(result.responseText);
				if (obj.success) {
					Ext.Msg.alert('Success', obj.message);
				} else {
					Ext.Msg.alert('Failure', obj.message);
				}
				
				_this.close();
		   },
		   
		});
		
	},
	
	setWindowTitle:function(){
		switch (this.currentItem) {
			case 0:
				this.setTitle('Create New Project');
				this.buttons[0].hide();
				break;
			case 1:
				this.setTitle('Select Project\'s Web Server Root Folder');
				this.buttons[0].show();
				this.buttons[1].show();
				break;
			case 2:
				this.setTitle('Select Project\'s Template');
				break;
			case 3:
				this.setTitle('Create Your New Studio User');
				break;
			case 4:
			  this.setTitle('Setup Your Database Configuration');
				break;
			case 5:
				this.setTitle('Setup A Virtual Host');
				this.buttons[1].hide();
				this.buttons[2].show();
				break;
		}
		
		this.center();
	},
	
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