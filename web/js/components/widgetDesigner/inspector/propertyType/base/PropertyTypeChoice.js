/**
 * @class afStudio.wi.PropertyTypeChoice
 * @extends afStudio.wi.PropertyBaseType
 */
afStudio.wi.PropertyTypeChoice = Ext.extend(afStudio.wi.PropertyBaseType, {
	type : 'choice'
	
	,defaultValue : ''
	
	,setChoices : function(store) {
		/**
		 * @property store
		 * @type {Object}
		 */
		this.store = store;		
		return this;
	}
});