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
					xtype: 'tbbutton',
					text: 'Commands',
					menu: [{
                            text: 'App',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                    text: 'Fix permissions',
                                    handler: function() {
                                        _this.commandFixPermissions();
                                    }
                                },{
                                    text: 'Display Version',
                                    handler: function() {
                                        _this.commandDisplayVersion();
                                    }
                                }/*,{
                                    text: 'Auto-generate Widgets',
                                    handler: function() {
                                        _this.commandAutoGenerateWidgets();
                                    }
                                }*/]
                            }
						},{
                            text: 'Cache',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                    text: 'Clear Cache',
                                    handler: function() {
                                        _this.commandClearCache();
                                    }
                                }]
                            }
						},{
                            text: 'Model',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                    text: 'Build SQL',
                                    handler: function() {
                                        _this.commandBuildSQL();
                                    }
                                },{
                                    text: 'Insert SQL',
                                    handler: function() {
                                        _this.commandInsertSQL();
                                    }
                                },{
                                    text: 'Build Classes',
                                    handler: function() {
                                        _this.commandBuildClasses();
                                    }
                                },{
                                    text: 'SQL Diff',
                                    handler: function() {
                                        _this.commandSQLDiff();
                                    }
                                }]
                            }
                        },{
                            text: 'Test & Benchmarking',
                            menu: {
                                xtype: 'menu',
                                items: [/*{
                                    text: 'Check Model Integrity',
                                    handler: function() {
                                        _this.commandCheckModelIntegrity();
                                    }
                                },*/{
                                    text: 'Check Widget Integrity',
                                    handler: function() {
                                        _this.commandCheckWidgetIntegrity();
                                    }
                                }]
                            }
                        }/*,{
                            text: 'Security',
                            menu: {
                                xtype: 'menu',
                                items: [{
                                    text: 'Security Scan',
                                    handler: function() {
                                        _this.commandSecurityScan();
                                    }
                                }]
                            }
						}*/]
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
	 * @override
	 */
	,commandFixPermissions: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony project:permissions; ./symfony afs:fix-perms'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandFixPermissions

	/**
	 * @override
	 */
	,commandDisplayVersion: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony afs:version'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandDisplayVersion

	/**
	 * @override
	 */
	,commandAutoGenerateWidgets: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony afs:generate-widget-all'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandAutoGenerateWidgets

	/**
	 * @override
	 */
	,commandClearCache: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony cc; ./symfony appflower:validator-cache frontend cache'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandClearCache

	/**
	 * @override
	 */
	,commandBuildSQL: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony propel:build-sql'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandBuildSQL

	/**
	 * @override
	 */
	,commandInsertSQL: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony propel:insert-sql --no-confirmation'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandInsertSQL

	/**
	 * @override
	 */
	,commandBuildClasses: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony propel:build-model'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandBuildClasses

	/**
	 * @override
	 */
	,commandSQLDiff: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony propel:diff'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandSQLDiff

	/**
	 * @override
	 */
	,commandCheckModelIntegrity: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony afs:integrity'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandCheckModelIntegrity

	/**
	 * @override
	 */
	,commandCheckWidgetIntegrity: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony appflower:list-files ext verbose'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandCheckWidgetIntegrity

	/**
	 * @override
	 */
	,commandSecurityScan: function() {
		var _this = this;

		this.executeAction({
			url: _this.baseUrl,
			params: {
				command: './symfony appflower:security-scan frontend'
			},
			run: function(response) {
				this.updateCli(response.console);
			}
		});
	}//eo commandSecurityScan

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