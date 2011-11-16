/**
 * {Ext.ux.AceComponent} editor wrapper.
 * 
 * @class afStudio.wd.Editor
 * @extends Ext.Container
 * @author Nikolai Babinski
 */
afStudio.wd.Editor = Ext.extend(Ext.Container, {
	/**
	 * @override 
	 */
	layout: 'fit',
	
	/**
	 * @private
	 * @return {Object} configuration object
	 */
	_beforeInitComponent : function() {
		var aceCfg = {};
		
		if (this.file) {
			aceCfg.file = this.file;
			delete this.file;
		}
		if (this.theme) {
			aceCfg.theme = this.theme;
			delete this.theme;
		}
		if (this.mode) {
			aceCfg.mode = this.mode;
			delete this.mode;
		}
		if (this.fileUrl) {
			aceCfg.fileUrl = this.fileUrl;
			delete this.fileUrl;
		}
		
		/**
		 * @property ace The ACE editor
		 * @type {Ext.ux.AceComponent}
		 */
		this.ace = new Ext.ux.AceComponent(aceCfg);
		
		return {
			items: this.ace
		};
	},
	
	/**
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);		
		
		afStudio.wd.Editor.superclass.initComponent.apply(this, arguments);	
	},
	
	/**
	 * Returns editor code {@link Ext.ux.AceComponent#getCode}
	 * @return {String} code
	 */
	getCode : function() {
		return this.ace.getCode();
	},
	
	/**
	 * Sets editor file property {@link Ext.ux.AceComponent#setFile}.
	 * @param {String} file The file being set
	 * @param {Boolean} reload The reload file flag
	 */
	setFile : function(file, reload) {
		this.ace.setFile(file, reload);
	},
	
	/**
	 * Rerturns editor's file property {@link Ext.ux.AceComponent#file}.
	 * @return {String} file path
	 */
	getFile : function() {
		return this.ace.file; 
	}
});