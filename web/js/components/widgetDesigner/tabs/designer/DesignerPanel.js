/**
 * WD GUI container.
 * 
 * @class afStudio.wd.DesignerPanel
 * @extends Ext.Panel
 * @author Nikolai Babinski
 */
afStudio.wd.DesignerPanel = Ext.extend(Ext.Panel, {
	/**
	 * @cfg {String} layout (sets to 'fit')
	 */
	layout : 'fit',
	
	/**
	 * Widget errors window.
	 * @property errorWin
	 * @type {Ext.Window}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var self = this,
			c = this.controller,
			widget = c.getView('widget');
		
		var topBarItems = [
			{
				text: 'Save',
				itemId: 'saveBtn',
				iconCls: 'icon-save',
				listeners: {
					scope: self,
					click: self.onSaveWidget
				}
			},'-',{
				text: 'Preview', 
				itemId: 'previewBtn',
				iconCls: 'icon-preview',
				listeners: {
					scope: self,
					click: self.onPreviewWidget
				}
			}
		];
		
		return {
			border: true,
			bodyStyle: 'padding: 4px;',
			tbar: {
				items: topBarItems
			},
			items: widget 
		};
	},	
	
	/**
	 * ExtJS template method
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		afStudio.wd.DesignerPanel.superclass.initComponent.apply(this, arguments);
	},	
	
	/**
	 * Returns menu item.
	 * @param {String} item The itemId property  
	 * @return {Ext.Toolbar.Item} top toolbar item
	 */
	getMenuItem : function(item) {
		return this.getTopToolbar().getComponent(item);
	},
	
	/**
	 * Shows widget's errors.
	 * @param {Object} errors The errors object
	 */
	showWidgetErrors : function(errors) {
		if (!this.errorWin) {
			this.errorWin = new afStudio.wd.ModelErrorWindow();
		}
		this.errorWin.modelErrors = errors;
		this.errorWin.show();
	},
	
	/**
	 * Save button <u>click</u> event listener.
	 * Saves view definition.
	 * @protected
	 */
	onSaveWidget : function() {
		var c = this.controller,
			valid = c.validateModel();
		
		if (valid === true) {
			c.saveView();
		} else {
			this.showWidgetErrors(valid);
		}
	},

	/**
	 * Opens widget for preview.
	 * @protected
	 */
	onPreviewWidget : function() {
		var c = this.controller,
			widget = c.getWidget();
			
		var model = c.getRootNode(),
			titleNode = model.getImmediateModelNode(afStudio.ModelNode.TITLE),		
			title = titleNode ? titleNode.getNodeDataValue() : null;
		
		afStudio.WD.previewWidget(widget.uri, title);	
	}
});


/**
 * @type 'wd.designerPanel'
 */
Ext.reg('wd.designerPanel', afStudio.wd.DesignerPanel);