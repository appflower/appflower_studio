/**
 * User Window
 * @class afStudio.UsersList
 * @extends Ext.Window
 * @author PavelK
 */
afStudio.UserWindow = Ext.extend(Ext.Window, { 
	/**
	 * @var {Object}
	 * User form
	 */
	form: null,
	
	/**
	 * @var {String}
	 * Form mode
	 * Add by default
	 */
	mode: 'add',
	
	/**
	 * @var {Object}
	 * Form data
	 */
	formData: null,
	
	/**
	 * @var {Boolean}
	 * Flag which will notify if the Role combobox available
	 * Set to false if you want to hide Role combobox
	 */
	isRoleFieldAvailable: true,
	
	/**
	 * @var {String}
	 * Captcha source destination
	 */
	captchaSrc: '/afsUserManager/captcha?width=415&height=50',
	
	/**
	 * initComponent method
	 * ExtJS template method
	 * @private
	 */
	initComponent: function(){
		//Create form instance
		this.initForm();
		
		//Create needful title for the form
		var title = ('edit' == this.mode)?'You can edit an existing user from this widget':'You can add a new user from this widget';
		
		//Create config object
		var config = {
			width: 463,
			title: title,
			autoHeight: true, closable: true, draggable: true,
			plain:true, modal: true, resizable: false,
			bodyBorder: false, border: false,
			items: this.form,
			
			buttons: [
				{text: 'Save user data', handler: this.saveForm, scope: this},
				{text: 'Cancel', handler: this.closeForm, scope: this}
			],
			buttonAlign: 'center'			
		};
		
		Ext.apply(this, Ext.apply(this.initialConfig, config));
		afStudio.UserWindow.superclass.initComponent.apply(this, arguments);
		this._initEvents();
	},
	
	/**
	 * Function initForm
	 * Initializes form with user information
	 */
	initForm: function(){
		//Form items
		var formItems = [
			{name: 'first_name', fieldLabel: 'First Name'},
			{name: 'last_name', fieldLabel: 'Last Name'},
			{name: 'username', fieldLabel: 'Username', readOnly: ('edit' == this.mode)?true:false, vtype: 'username'},
			{name: 'email', fieldLabel: 'Email', vtype: 'email'},
			{name: 'password', inputType: 'password', fieldLabel: 'Password', allowBlank: ('edit' == this.mode)?true:false},
			{xtype: 'combo', mode: 'local', triggerAction: 'all', 
				hidden: (this.isRoleFieldAvailable && afStudioUser.is_admin)?false:true,
				disabled: (this.isRoleFieldAvailable && afStudioUser.is_admin) ? false : true,
				fieldLabel: 'User Role',
				emptyText: 'Please select user role...',
				store: [
					['admin', 'Administrator'], ['user', 'Studio User']
				],
				hiddenName: 'role',
				name: 'role'
			}
		];
		
		//Add CAPTCHA if needed (login form)
		if(false == this.isRoleFieldAvailable){
			formItems[formItems.length] = {fieldLabel: 'Verification', helpText: '<i>Type the code you see below</i>', name: 'captcha', emptyText: 'Please enter text from the verification image...'};
			formItems[formItems.length] = {xtype: 'label', html: ['<img style="cursor: pointer;" ext:qtip="Please click on the picture if you can\'t see the symbols" id="verificationimage" src="', this.captchaSrc, '">'].join('')};
		}
		
		//Active form
		this.form = new Ext.FormPanel({
		    url: '',
			defaultType: 'textfield',
			width: 450, labelWidth: 70,
			frame: true, title: false,
			defaults: {allowBlank: false, anchor: '95%', plugins:[Ext.ux.plugins.HelpText], helpType: "comment"},
			items: formItems
		});		
	},
	
	/**
	 * Function closeForm
	 * Closes user form
	 */
	closeForm: function(){
		this.close();
	},
    
    /**
     * Function saveForm
     * Saves information about user
     */
     saveForm: function() {
        var form_panel = this.form;
        var f = form_panel.getForm();
        
        if (f.isValid()) {
            var params = f.getValues();
            form_panel.ownerCt.getEl().mask('Please wait...', 'x-mask-loading');
            
            Ext.Ajax.request({
                url: ('edit' == this.mode) ? afStudioWSUrls.userUpdateUrl : afStudioWSUrls.userCreateUrl,
                
                params: {
                    username: params['username'],
                    user: Ext.encode(params)
                },
                
                success: function(response, options){
                    form_panel.ownerCt.getEl().unmask();
                    response = Ext.decode(response.responseText);
                    
                    if (response.console) afStudio.updateConsole(response.console);
                    
                    if (!response.success) {
                        if (Ext.isArray(response.message)) {
                            for (var i=0, l=response.message.length; i<l; i++) {
                                var msg = response.message[i]
                                this.form.find('name', msg.fieldname)[0].markInvalid(msg.message);
                            }
                        }
                        
                        //Update CAPTCHA element if it exists
                        if (false == this.isRoleFieldAvailable) {
                            this.refreshCaptcha();
                        }
                    } else {
                        afStudio.Msg.info('System Message', response.message);
                        this.closeForm();
                        
                        //TODO: please provide this function in constructor
                        if (Ext.isFunction(this.onFormClose)) {
                            this.onFormClose();
                        }
                    }
                },
                
                failure: function(response, options){
                    if (Ext.isFunction(action.error)) {
                        Ext.util.Functions.createDelegate(action.error, this, [xhr, opt], false)();
                    }
                    var message  = String.format('Status code: {0} <br /> Message: {1}', xhr.status, xhr.statusText || 'none'),
                    msgTitle = "Server communication failure";
                    
                    afStudio.Msg.error(msgTitle, message);
                },
                
                scope: this
            });
        }
    },
    
	/**
	 * Function refreshCaptcha
	 * Refreshes current captcha
	 */
	refreshCaptcha: function(){
		//Generate additional parametr which will solve "caching issue"
		var dc = (new Date()).format('U');
		
		//Get CAPTCHA element
		var el = Ext.get("verificationimage");
		el.dom.src = [this.captchaSrc, '&', dc].join('');
	},
	
	/**
	 * Function onWindowShow
	 * Runs when window showed
	 * Loads data into the grid
	 */
	onWindowShow: function(cmp){
		//Run getData query
		if('edit' == this.mode){
			//Mask panel body
			cmp.getEl().mask('Please wait...');
			Ext.Ajax.request({
				url: '/afsUserManager/get',
				params: {username: this.username},
				success: function(response, opt){
					//Unmask body
					cmp.getEl().unmask();
					//Decode server response
					response = Ext.decode(response.responseText);
					//Set user data
					this.setUserData(response);
				},
				failure: function(response, opt){
					//Create  onFailure handler
				},
				scope: this
			});			
		}
		
		//Create handler for refreshCaptcha function
		if (Ext.get('verificationimage')) {			
			Ext.get('verificationimage').on('click', this.refreshCaptcha, this);
		}
	},
	
	/**
	 * Function setUserData
	 * Sets user data to the form
	 * @param {Object} data
	 */
	setUserData: function(data){
		if(data){
			this.form.getForm().setValues({
				first_name: data.first_name,
				last_name: data.last_name,
				username: data.username,
				email: data.email,
				role: data.role
			});
		}		
	},
	
	/**
	 * Inits events of the needful components
	 */
	_initEvents: function(){
		this.on({
			'show': this.onWindowShow,
			scope: this
		});
	},
	
	/**
	 * Function cancel
	 * Close active wimdow
	 */
	cancel: function(){
		this.close();
	}
});