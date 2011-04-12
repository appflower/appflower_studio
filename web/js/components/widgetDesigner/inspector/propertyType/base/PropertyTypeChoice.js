/**
 * @class afStudio.wi.PropertyTypeChoice
 * @extends afStudio.wi.PropertyBaseType
 */
afStudio.wi.PropertyTypeChoice = Ext.extend(afStudio.wi.PropertyBaseType, {
	type : 'choice'
	
	,defaultValue : ''
	
	,setChoices : function(store) {
		this.store = store;		
		return this;
	}
});