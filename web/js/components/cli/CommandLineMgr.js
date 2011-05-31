Ext.ns('afStudio.cli');

afStudio.cli.CommandLineMgr = function() {
	
	var afStudioConsole = new afStudio.cli.Console();
	
	var consoleWin = new afStudio.cli.WindowWrapper({
		title: 'Console',
		iconCls: 'icon-console',
		items: afStudioConsole
	});

	var debugWin = new afStudio.cli.WindowWrapper({
		title: 'Debug',
		iconCls: 'icon-debug',
		items: new afStudio.cli.Debug()
	});
	
	var auditLogWin = new afStudio.cli.WindowWrapper({
		title: 'Notifications',
		iconCls: 'icon-debug-auditlog',
		items: new afStudio.cli.AuditLog()
	});
	
	return {
		
		init : function() {
			//render console and hide it.
			consoleWin.show().closeWindow();
		}
		
		,showConsole : function() {
			consoleWin.show();
		}
		
		,showAuditLog : function() {
			auditLogWin.show();
		}
		
		,showDebug : function() {
			debugWin.show();
		}
		
		,updateConsole : function(text) {
			afStudioConsole.updateCli(text);
		}

		,setConsole : function(text) {
			afStudioConsole.setCli(text);
		}
	};
}();

/**
 * Shorthand for {@link afStudio.cli.CommandLineMgr}
 */
afStudio.Cli = afStudio.cli.CommandLineMgr;