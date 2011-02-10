Ext.namespace('afStudio.layoutDesigner.view');

/**
 * Represents Page - custom collection of Views (or Widgets). 
 * 
 * @class afStudio.layoutDesigner.view.Page
 * @extends Ext.Container
 * @author Nikolai
 */
afStudio.layoutDesigner.view.Page = Ext.extend(Ext.Container, {
	
	layout : 'border'	
	
	/**
	 * @cfg {Object} metaData required
	 * Page metadata
	 */	
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	,_beforeInitComponent : function() {
		afStudio.vp.mask({
			msg: String.format('"{0}" view building...', this.metaData['i:title']), 
			region: 'center'
		});
		
		var	views = afStudio.layoutDesigner.view.ViewFactory.buildView(this.metaData);
			
		return {
			items: views
		}
	}//eo _beforeInitComponent
	
	/**
	 * Template method
	 * @private
	 */
	,initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.layoutDesigner.view.Page.superclass.initComponent.apply(this, arguments);
		this._afterInitComponent();
	}//eo initComponent
	
	/**
	 * Initializes events & does post configuration
	 * @private
	 */	
	,_afterInitComponent : function() {
		afStudio.vp.unmask('center');
	}//eo _afterInitComponent
	
});

/**
 * @type 'afStudio.layoutDesigner.view.page'
 */
Ext.reg('afStudio.layoutDesigner.view.page', afStudio.layoutDesigner.view.Page);