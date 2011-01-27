Ext.ns('afStudio.dbQuery');

/**
 * QueryForm
 * 
 * @class afStudio.dbQuery.QueryForm
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.dbQuery.QueryForm = Ext.extend(Ext.FormPanel, {
	
	/**
	 * @cfg {String} queryUrl required (defaults to 'afsDatabaseQuery/query')
	 * Query URL
	 */
	queryUrl : window.afStudioWSUrls.getDBQueryQueryUrl()
	
	/**
	 * @cfg {afStudio.dbQuery.QueryWindow} dbQueryWindow
	 */
	
	/**
	 * Executes Query
	 */
	,executeQuery : function() {
		var _this = this,
				f = _this.getForm(),
			   qt = _this.queryTypeCmp.getValue(),
			extraParams = {};
		
	    if (qt == 'sql') {
	    	extraParams.connection = this.dbQueryWindow.westPanel.getCurrentConnection();	    	
	    }
	    
	    if (qt == 'sql' && !extraParams.connection) {
	   		Ext.Msg.alert('Failure', 'Connection is not specified. <br /> Please select DataBase or DB\'s table.' );
	   		return;
	    }
	   
		_this.dbQueryWindow.maskDbQuery();
				
		f.submit({
		    clientValidation: true,
		    url: _this.queryUrl,
		    params: extraParams,
		    success: function(form, action) {
		    	_this.dbQueryWindow.unmaskDbQuery();
		    	if (action.result.type == 'success') {
		    		_this.fireEvent('executequery', action.result);
		    	} else {
		    		Ext.Msg.alert('Query Response', action.result.content);
		    	}
		    },
		    failure: function(form, action) {
		    	_this.dbQueryWindow.unmaskDbQuery();
		    	
		        switch (action.failureType) {
		            case Ext.form.Action.CLIENT_INVALID:
		                Ext.Msg.alert('Failure', 'Query text is empty');
		                break;
		            case Ext.form.Action.CONNECT_FAILURE:
		                Ext.Msg.alert('Failure', 'Ajax communication failed');
		                break;
		            case Ext.form.Action.SERVER_INVALID:
		               Ext.Msg.alert('Failure', action.result.content);
		       }
		    }			
		});
	}//eo executeQuery
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 * @private
	 */
	,_beforeInitComponent : function() {
		var _this = this;
		
		return {
			region: 'north',
			height: 140,
			layout: 'form',
			frame: true,
			iconCls: 'icon-sql', 
			margins: '0 5 5 5', 
			title: 'SQL',
			items: [
			{
				layout: 'column',
				border: false,				
				defaults: {
					border: false
				},
				items: [
				{
					layout: 'form',
					columnWidth: 1,
					style: 'margin-right: 5px;',
					items: {
						xtype: 'combo',
						ref: '../../queryTypeCmp',
						fieldLabel: 'Query type',						
						anchor: '100%',
						triggerAction: 'all',						
						value: 'sql',
						hiddenName: 'type',
						name: 'type',
						store: [['sql', 'sql'], ['propel', 'propel']]						
					}
				},{
					items: {
						xtype: 'button',
						text: 'Query',
						iconCls: 'icon-accept',
						handler: Ext.util.Functions.createDelegate(_this.executeQuery, _this)
					}
				}]
			},{
				xtype: 'textarea',
				ref: 'queryText',
				allowBlank: false,
				hideLabel: true,
				height: 80,
				name: 'query',
				anchor: '100% '
			}]			
		};		
	}//eo _beforeInitComponent
	
	//private 
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));				
		afStudio.dbQuery.QueryForm.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}
	
	/**
	 * @private
	 */
	,_afterInitComponent : function() {
		var _this = this;
		
		_this.addEvents(
			/**
			 * @event executequery Fires after query was successufully executed
			 * @param {Object} result The query result object, containing "meta" - meta-data and "data" - result set 
			 */
			'executequery'
		);
	}	
});

/**
 * @type 'afStudio.dbQuery.queryForm'
 */
Ext.reg('afStudio.dbQuery.queryForm', afStudio.dbQuery.QueryForm);