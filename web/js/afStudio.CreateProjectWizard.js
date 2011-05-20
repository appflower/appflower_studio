
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
			{xtype:'textfield', enableKeyEvents:true, fieldLabel: 'Project name<font color=red>*</font>', anchor: '96%', name: 'name', allowBlank: false, vtype: 'uniqueNode', 
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
			},
			{xtype:'displayfield', name: 'mandatory', hideLabel: true, anchor:'100%', value: 'Fields marked with <font color=red>*</font> are mandatory.', style: 'margin-top: 15px;'}
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
		  {xtype: 'panel', layout: 'column', 
				border: false, bodyBorder: false,
				defaults: {border: false, bodyBorder: false},
				items: [
					{xtype: 'panel', columnWidth: 0.5, layout: 'form', style: 'margin-right: 5px;',
						
						items: [
						{xtype: 'textfield', name: 'first_name', fieldLabel: 'First Name<font color=red>*</font>', value: afStudioUser.first_name, allowBlank: false, anchor: '92%'}
						]
					},
					{xtype: 'panel', layout: 'form', columnWidth: 0.5,
						items: [
						{xtype: 'textfield', name: 'last_name', fieldLabel: 'Last Name<font color=red>*</font>', value: afStudioUser.last_name, allowBlank: false, anchor: '92%'}
						]
					},
					{xtype: 'panel', columnWidth: 0.5, layout: 'form', style: 'margin-right: 5px;',
						
						items: [
						{xtype: 'textfield', name: 'username', fieldLabel: 'Username<font color=red>*</font>', value: afStudioUser.username, allowBlank: false, anchor: '92%'},
						]
					},
					{xtype: 'panel', layout: 'form', columnWidth: 0.5,
						items: [
						{xtype: 'textfield', name: 'email', fieldLabel: 'Email<font color=red>*</font>', vtype: 'email', value: afStudioUser.email, allowBlank: false, anchor: '92%'},
						]
					},
					{xtype: 'panel', columnWidth: 0.5, layout: 'form', style: 'margin-right: 5px;',
						
						items: [
						{xtype: 'textfield', name: 'password', inputType: 'password', fieldLabel: 'Password<font color=red>*</font>', allowBlank: false, anchor: '92%'}
						]
					},
					{xtype: 'panel', layout: 'form', columnWidth: 0.5,
						items: [
						{xtype: 'textfield', name: 'repassword', inputType: 'password', fieldLabel: 'Retype Password<font color=red>*</font>', allowBlank: false, vtype: 'checkPassword', anchor: '92%'}
						]
					}
				]
			},
			{name: 'role', inputType: 'hidden', value: 'admin'},
			{xtype:'displayfield', name: 'mandatory', hideLabel: true, anchor:'100%', value: 'Fields marked with <font color=red>*</font> are mandatory.', style: 'margin-top: 15px;'}
		];
		
		this.form4 = new Ext.FormPanel({
			url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			hidden: true,
			defaults: {allowBlank: false, anchor: '100%'},
			items: formItems
		});
	},
	
	//Database form
	initForm5: function(){
		var formItems = [
		  {xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: 'Please fill out the database configuration fields below for AppFlower being able to connect to your database service.', style: 'margin-bottom: 15px;'},			
			{xtype:'textfield', fieldLabel: 'Database<font color=red>*</font>', anchor: '96%', name: 'database', allowBlank: false, vtype: 'database'},
			{xtype: 'panel', layout: 'column', 
				border: false, bodyBorder: false,
				defaults: {border: false, bodyBorder: false},
				items: [
					{xtype: 'panel', columnWidth: 0.8, layout: 'form', style: 'margin-right: 5px;',
						
						items: [{xtype: 'textfield', fieldLabel: 'Host<font color=red>*</font>', name: 'host', anchor: '92%', allowBlank: false, vtype: 'host', value: 'localhost'}]
					},
					{xtype: 'panel', width: 100, layout: 'form', labelWidth: 35, columnWidth: 0.2,
						items: [{xtype: 'textfield', fieldLabel: 'Port', name: 'port', anchor: '100%', allowBlank: true,vtype:'port', value:'3306'}]
					}
				]
			},
			{xtype:'textfield', fieldLabel: 'Username<font color=red>*</font>', anchor: '96%', name: 'username', allowBlank: false,vtype:'alphanum'},
			{xtype:'textfield', fieldLabel: 'Password<font color=red>*</font>', anchor: '96%', name: 'password', allowBlank: false, inputType: 'password',vtype:'alphanum'},
			{xtype:'displayfield', name: 'mandatory', hideLabel: true, anchor:'100%', value: 'Fields marked with <font color=red>*</font> are mandatory.', style: 'margin-top: 15px;'}
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
			this.nextForm();
		}
	},
	
	nextForm: function(){
		if (this.currentItem==3)
		{
			var name = this.form1.getForm().findField('name').getValue();
			var slug = afStudio.createSlug(name);
			var path = this.form2.getForm().findField('path').getValue();
			var html = '<b>To connect to your new project from your browser, you need to ensure your web server is configured to serve the new web project.</b><br><br> In Apache, this is usually done with the usage of Virtual Hosts. This can be configured in your Apache Configuration file. This way, you\'ll have direct access to your new project, by accessing <b>'+slug+'.mydomain.com</b> in your browser.<br><br>Here is an example:<br>';
					
			html+='<pre><code>&lt;VirtualHost *:80&gt;<br>&nbsp;&nbsp;ServerName '+slug+'.mydomain.com<br>&nbsp;&nbsp;DocumentRoot '+path+'/web<br>&nbsp;&nbsp;DirectoryIndex index.php<br>&nbsp;&nbsp;Alias /sf "'+path+'/lib/vendor/symfony/data/web/sf"<br><br>&nbsp;&nbsp;&lt;Directory "'+path+'/web"&gt;<br>&nbsp;&nbsp;&nbsp;&nbsp;AllowOverride All<br>&nbsp;&nbsp;&nbsp;&nbsp;Allow from All<br>&nbsp;&nbsp;&lt;/Directory&gt;<br>&lt;/VirtualHost&gt;</code></pre>';
			
			this.form6.getForm().findField('infor').update(html);
			
			this.form5.getForm().findField('database').setValue(slug);
			this.form5.getForm().findField('username').setValue(this.form4.getForm().findField('username').getValue());
			this.form5.getForm().findField('password').setValue(this.form4.getForm().findField('password').getValue());
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
				path: this.form2.getForm().findField('path').getValue(),
				template: this.dataview.getSelectedRecords()[0].get('name'),
				
				username: this.form4.getForm().findField('username').getValue(),
				user: Ext.encode(this.form4.getForm().getValues()),
				
				database: this.form5.getForm().findField('database').getValue(),
				host: this.form5.getForm().findField('host').getValue(),
				port: this.form5.getForm().findField('port').getValue(),
				db_user: this.form5.getForm().findField('username').getValue(),
				db_pass: this.form5.getForm().findField('password').getValue(),
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
				this.buttons[2].hide();
				break;
			case 2:
				this.setTitle('Select Project\'s Template');
				this.buttons[1].show();
				this.buttons[2].hide();
				break;
			case 3:
				this.setTitle('Create Your New Studio User');
				this.buttons[1].show();
				this.buttons[2].hide();
				break;
			case 4:
			  this.setTitle('Setup Your Database Configuration');
			  this.buttons[1].show();
				this.buttons[2].hide();
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
    uniqueNode: function(value, field) {
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
 
    uniqueNodeText : 'Path to Project already exist! Please choose another Project Name!',
    
    checkPassword: function(value, field) {
        if(field.ownerCt.ownerCt.ownerCt.getForm().findField('password').getValue()!=value)
				{				 
				  return false;
				}
				return true;
    },
    
    checkPasswordText : 'Retype Password value does not match Password value',

    database: function(value, field)
    {
        return /^[a-zA-Z0-9_\-]+$/.test(value);
    },
    
    databaseText : 'Database should only contain letters, numbers, _, -',
    
    databaseMask : /[a-z0-9_\-]/i,
    
    host: function(value, field)
    {
        return /^[a-zA-Z0-9_\-\.]+$/.test(value);
    },
    
    hostText : 'Host should only contain letters, numbers, dots, _, -, ',
    
    hostMask : /[a-z0-9_\-\.]/i,
    
    port: function(value, field)
    {
        return /^[0-9]+$/.test(value);
    },
    
    portText : 'Port should only contain numbers',
    
    portMask : /[0-9]/i
});