Ext.namespace('afStudio.cli');

afStudio.cli.WindowWrapper = Ext.extend(Ext.Window, {

	width : 1007
	
	,height : 600

	,closable : true
	
	,closeAction : 'hide'
	
    ,draggable : true
    
    ,plain : true
    
    ,modal : true
	
    ,maximizable : true
    
    ,border : false
    
    ,bodyBorder : false
    
    ,layout : 'fit'
    
	/**
	 * Closes/Hides this window
	 */
	,closeWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	}//eo closeWindow
	
	,constructor : function(config) {
		Ext.apply(this, config);
		
		afStudio.cli.WindowWrapper.superclass.constructor.call(this, config);
	}//eo constructor
	
	/**
	 * Ext Template method.
	 * @private
	 */
	,initComponent : function() {
		afStudio.cli.WindowWrapper.superclass.initComponent.apply(this, arguments);
		
		var _this = this;
		
		this.on({
			beforeshow : function() {
				var cli = this.items.itemAt(0);
				cli.refreshCli();
			}
		})
	}//eo initComponent 
});