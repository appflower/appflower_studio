
afStudio.CreateProjectWizard = Ext.extend(Ext.Window, {
	
	initComponent: function(){
		
		this.initForm1();
		this.initForm2();
		this.initForm3();
		this.initForm4();
		
		var config = {
			title: 'Your new Project', width: 493,
			closable: true, draggable: true, 
	    plain:true, modal: true, resizable: false,
	    bodyBorder: false, border: false, 
	    items: [this.form1, this.form2, this.form3, this.form4],
			buttons: [
			    {text: 'Previous', handler: this.previous, scope: this, hidden: true},
				  {text: 'Next', handler: this.next, scope: this},
			    {text: 'Save Project', handler: this.save, scope: this, hidden: true}
				
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
			{xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: '<div  class="guide_header"> <div class="date_cover"> <div>01</div> </div> <h2>This wizard will help guide you through a few steps to setup your new AppFlower Project.</h2> </div> <br> Please choose your project name.', style: 'margin-bottom: 15px;'},
			{xtype:'textfield', enableKeyEvents:true, fieldLabel: 'Project name<font color=red>*</font>', anchor: '96%', name: 'name', allowBlank: false, vtype: 'uniqueNode', 
				listeners: {
					keyup: function(field,e) {	
						var project_name = field.getValue();
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
	
	//Template form
	initForm2: function(){
		
		_self = this;

		this.initDataview();
							
		var formItems = [
			{xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: '<div  class="guide_header"> <div class="date_cover"> <div>02</div> </div> <h2>Please select how your want your application theme to look like by selecting one of the templates below.</h2> </div>', style: 'margin-bottom: 15px;'},			
			this.dataview
		];
		
		this.form2 = new Ext.FormPanel({
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
	
	//User form
	initForm3: function(){
		var formItems = [
		  {xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', value: '<div  class="guide_header"> <div class="date_cover"> <div>03</div> </div> <h2>Please add your first user for this new project.</h2> </div>', style: 'margin-bottom: 15px;'},
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
						{xtype: 'textfield', name: 'username', fieldLabel: 'Username<font color=red>*</font>', value: afStudioUser.username, allowBlank: false, vtype: 'username', anchor: '92%'}
						]
					},
					{xtype: 'panel', layout: 'form', columnWidth: 0.5,
						items: [
						{xtype: 'textfield', name: 'email', fieldLabel: 'Email<font color=red>*</font>', vtype: 'email', value: afStudioUser.email, allowBlank: false, anchor: '92%'}
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
			{name: 'role', inputType: 'hidden', value: 'admin'}
		];
		
		this.form3 = new Ext.FormPanel({
			url: '',
			defaultType: 'textfield',
			width: 480, labelWidth: 70,
			frame: true, title: false,
			hidden: true,
			defaults: {allowBlank: false, anchor: '100%'},
			items: formItems
		});
	},
	
	//Virtual host form
	initForm4: function(){
		var formItems = [
			{xtype:'displayfield', name: 'infor', hideLabel: true, anchor:'100%', style: 'margin-bottom: 15px;'}
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
	
	currentItem: 0,
	
	next:function(){
		if (this.items.get(this.currentItem).getForm().isValid()) 
		{					
		  if (this.currentItem==2) // setting db values and virtual host value
  		{
  			var name = this.form1.getForm().findField('name').getValue();
  			var html = '\
<div  class="guide_header">\
    <div class="date_cover">\
        <div>04</div>\
    </div>\
    <h2>To connect to your new project from your browser,\
        you need to ensure your web server is configured to serve the new web project.\
    </h2>\
</div>\
<br>\
<p>In Apache, this is usually done with the usage of Virtual Hosts.<br />\
 This can be configured in your Apache Configuration file.<br />\
This way, you\'ll have direct access to your new project, from your browser.<br />\
For more instructions on how to configure your apache virtual host - please refer to <a href="http://www.appflower.com/cms/learningcenter" target="_blank">online documentation</a>.</p>';
            html+='<br /><p><i><b>Create Project Wizard</b> will try to set up Apache virtual host automatically for you.</i></p>';
  			
  			this.form4.getForm().findField('infor').update(html);
  		}
		  	
			this.nextForm();
		}
	},
	
	nextForm: function(){				
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
		
		var mask = new Ext.LoadMask(this.getEl(), {msg: "<b>Creating new project</b> <br>Please wait..",removeMask:true});
        mask.show();

        var projectName = this.form1.getForm().findField('name').getValue();
        
		Ext.Ajax.request({
			url: Ext.urlAppend(afStudioWSUrls.project, Ext.urlEncode({cmd: 'saveWizard'})),
			params: { 
				name: projectName,
				template: this.dataview.getSelectedRecords()[0].get('name').toLowerCase(),
				
				userForm: Ext.encode(this.form3.getForm().getValues()),
			},
			success: function(result,request){			   
				var obj = Ext.decode(result.responseText);
				if (obj.success) {
					afStudio.Msg.info(obj.message);
				} else {
					afStudio.Msg.error(obj.message);
				}
				
				afStudio.updateConsole(obj.console);
								
				mask.hide();
				
				_this.close();
		   }
		   
		});
		
	},
	
	setWindowTitle:function(){
		switch (this.currentItem) {
			case 0:
				this.setTitle('Create New Project');
				this.buttons[0].hide();
				break;
			case 1:
				this.setTitle('Select Project\'s Template');
				this.buttons[1].show();
				this.buttons[2].hide();
				break;
			case 2:
				this.setTitle('Create Your New Studio User');
				this.buttons[1].show();
				this.buttons[2].hide();
				break;
			case 3:
				this.setTitle('Setup A Virtual Host');
				this.buttons[1].hide();
				this.buttons[2].show();
				break;
		}
		
		this.center();
	}
	
});