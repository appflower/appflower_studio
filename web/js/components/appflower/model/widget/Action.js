/**
 * <u>i:action</u> model node.
 * 
 * @class afStudio.model.widget.Action
 * @extends afStudio.model.Node
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Action = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.ACTION,
	
	//action model node has no data(_content)
	_content : null,
	
	properties : [
      	{name: "name", type: "token", required: true},
      	{name: "url", type: "combinedUriType", required: true},
	  	{name: "condition", type: "token"},
      	{name: "script", type: "token"},
      	{name: "params", type: "token"},
		{name: "icon", type: "absoluteUriType"},
		{name: "iconCls", type: "token"},
		{name: "tooltip", type: "token"},
		{name: "text", type: "token"},
		{name: "style", type: "token"},
		{name: "post", type: "boolean",  defaultValue: false},
		{name: "forceSelection", type: "boolean"},
		{name: "confirmMsg", type: "string"},
		{name: "confirm", type: "boolean"},
		{name: "updater", type: "boolean",  defaultValue: false},
		{name: "popup", type: "boolean",  defaultValue: false},
		{name: "popupSettings", type: "token"},
		{name: "permissions", type: "permissionType", defaultValue: "*"}
	],

	defaultDefinition : {
		attributes: {
			name: 'i:action',
			url: '#'
		}
	},
	
	nodeTypes : [
		{name: afStudio.ModelNode.HANDLER, hasMany: true}
	],
	
	/**
	 * @override
	 * @return {String} node's string presentation
	 */
    toString : function() {
		var tpl = new Ext.XTemplate(
			'[model.Node: "{tag}", ID: "{id}", properties: {[this.toJson(values.properties.map)]}]',
			{
        		compiled: true,
        		disableFormats: true,
        		toJson: function(o) {
        			return Ext.encode({'name': o.name.value, 'url': o.url.value});
        		}
    		});
    	
        return tpl.apply(this);
    }
    //eo toString
});