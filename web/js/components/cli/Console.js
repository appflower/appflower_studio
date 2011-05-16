Ext.namespace('afStudio.cli');

/**
 * Console cli component.
 * 
 * @class afStudio.cli.Console
 * @extends afStudio.cli.CommandLine
 * @author Nikolai
 */
afStudio.cli.Console = Ext.extend(afStudio.cli.CommandLine, {
	
	/**
	 * @cfg {String} baseUrl
	 * Console base URL.
	 */
	 baseUrl : afStudioWSUrls.getConsoleUrl()
	
	/**
	 * @cfg {String} consoleCommands
	 * Text presents available console commands.
	 * afStudioConsoleCommands - global variable
	 */ 
	,consoleCommands : afStudioConsoleCommands
	
	/**
	 * @property consoleCmdLine
	 * Reference to console command line text field.
	 * Commands entry point.
	 * 
	 * @cfg {Ext.form.TextField}
	 */
	
	/**
	 * Initializes component.
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		var consoleTopBar = new Ext.Toolbar({
			items: [
				'Enter command:',
				{
					xtype: 'tbspacer', width: 5	
				},{
					xtype: 'textfield',
					itemId: 'cml',
					width: 300,
					enableKeyEvents: true
				},{
					xtype: 'tbspacer', width: 10
				},{
					xtype: 'tbtext',
					text: '<b>cmds:</b> ' + _this.consoleCommands		
				}
			]
		});
		//sets command line property
		this.consoleCmdLine = consoleTopBar.getComponent('cml'); 
		
		return {
			tbar: consoleTopBar,
			html: ''
		};
	}//eo _beforeInitComponent
	
	/**
	 * ExtJS template method
	 * @private
	 */
	,initComponent: function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
		afStudio.cli.Console.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration actions.
	 * @private
	 */	
	,_afterInitComponent : function() {
		
		this.consoleCmdLine.on('keyup', this.onConsoleCmdLineKeyUp, this);	
	}//eo _afterInitComponent
	
	,onCliAfterRender : function() {
		this.loadCli();
	}
	
	/**
	 * @override
	 */
	,loadCli : function() {
		var _this = this;		
		
		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: 'start'
			},
		    run: function(response) {
		      	this.updateCli(response.console);
		    }
		});
	}//eo loadCli

	,refreshCli : function() {
		this.scrollCliDown();
	}
	
	/**
	 * @override
	 */
	,setCli : function(content) {
		this.body.dom.innerHTML = content;
		this.scrollCliDown();
	}//eo setCli 
	
	/**
	 * @override
	 */
	,updateCli : function(content) {
		if (Ext.isString(content) && content) {
			this.body.dom.innerHTML += content;
			this.scrollCliDown();
		}
	}//eo updateCli

	/**
	 * @override
	 */
	,clearCli : function() {
		this.setCli('');
	}//eo clearCli
	
	/**
	 * Console <u>keyup</u> event listener.
	 * 
	 * @param {Ext.form.TextField} cmdField The console's command line field.
	 * @param {Ext.EventObject} e
	 */
	,onConsoleCmdLineKeyUp : function(cmdField, e) {		
		var _this = this,
			fieldValue = cmdField.getValue(),
			key = e ? e.getKey() : Ext.EventObject.getKey();				
		 
		if (key == Ext.EventObject.ENTER) {
			cmdField.setValue('');
			
			if (fieldValue == 'clear') {
				this.clearCli();
			} else {
				this.executeAction({
					url: _this.baseUrl,
					params: {
						command: fieldValue
					},
				    loadingMessage: String.format('Executing command "{0}"...', fieldValue),
				    run: function(response) {
				    	this.updateCli(response.console);
				    }
				});
			}
		}
	}//eo onConsoleCmdLineKeyUp
});

/**
 * @type 'afStudio.cli.console'
 */
Ext.reg('afStudio.cli.console', afStudio.cli.Console);