Ext.namespace('afStudio.cli');

/**
 * 
 * @class afStudio.cli.AuditLog
 * @extends afStudio.cli.CommandLine
 */
afStudio.cli.AuditLog = Ext.extend(afStudio.cli.CommandLine, {
	
	/**
	 * @cfg {String} baseUrl
	 * AuditLog base URL.
	 */
	 baseUrl : afStudioWSUrls.notificationUrl
	
	/**
	 * @property notificationOffset 
	 * @type {Number}
	 */
	,notificationOffset : 0
	 
	/**
	 * Initializes component.
	 * @private
	 * @return {Object} The configuration object 
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		return {
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
		afStudio.cli.AuditLog.superclass.initComponent.apply(this, arguments);
	}//eo initComponent
	
	/**
	 * @override
	 */
	,loadCli : function() {
		this.executeAction({
			url: this.baseUrl,
			params: {
				cmd: 'get',
				offset: this.notificationOffset
			},
		    run: function(r) {
		    	this.notificationOffset = r.data.offset;
		    	this.updateCli(r.data.notifications);     		
		    }
		});
	}//eo loadCli
	
	/**
	 * @override
	 */
	,updateCli : function(content) {
		if (Ext.isString(content) && content) {
			this.body.dom.innerHTML += content;
			this.scrollCliDown();
		}
	}//eo updateCli	
});

/**
 * @type 'afStudio.cli.auditLog'
 */
Ext.reg('afStudio.cli.auditLog', afStudio.cli.AuditLog);