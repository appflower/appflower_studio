/**
 * <u>i:fields</u> model node.
 * 
 * @class afStudio.model.Fields
 * @extends afStudio.model.Node
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Fields = Ext.extend(afStudio.model.TypedNode, {

	id : afStudio.ModelNode.FIELDS,
	
	tag : afStudio.ModelNode.FIELDS,
	
	properties : [
      	{name: "classic", type: 'boolean', defaultValue: "false"},
      	{name: "bodyStyle", type: 'token'},
      	{name: "redirect", type: 'internalUriType'},
      	{name: "remoteLoad", type: 'boolean'},
      	{name: "plugin", type: 'token'}
	],
	
	listProperties : [
		{name: "action", type: 'internalUriType', defaultValue: "n/a"},
      	{name: "tree", type: 'boolean', defaultValue: false},
      	{name: "selectable", type: 'boolean', defaultValue: true},
      	{name: "exportable", type: 'boolean', defaultValue: true},
      	{name: "expandButton",  type: 'boolean'},
      	{name: "select", type: 'boolean', defaultValue: false},
      	{name: "pager", type: 'boolean', defaultValue: true},
      	{name: "remoteSort", type: 'boolean', defaultValue: false},
      	{name: "iconCls", type: 'token'},
      	{name: "icon", type: 'token', defaultValue: '/images/famfamfam/accept.png'},
      	{name: "remoteFilter", type: 'boolean'},
		{name: "pagerTemplate", type: 'token'}
	],
	
	editProperties : [
		{name: "url", type: 'internalUriType', required: false},
      	{name: "resetable", type: 'boolean', defaultValue: true},
      	{name: "resetlabel", type: 'token', defaultValue: "Reset"},
      	{name: "submitlabel", type: 'token', defaultValue: "Submit"},
      	{name: "multipart", type: 'boolean', defaultValue: false},
      	{name: "submit", type: 'boolean', defaultValue: true},
      	{name: "border", type: 'boolean', defaultValue: true},
      	{name: "labelWidth", type: 'positiveInteger', defaultValue: 75}
	],
	
	listNodeTypes : [
		{name: afStudio.ModelNode.COLUMN, required: true, hasMany: true, unique: 'name'}
	],
	
	editNodeTypes : [
		{name: afStudio.ModelNode.FIELD, required: true, hasMany: true, unique: 'name'},
		{name: afStudio.ModelNode.BUTTON, hasMany: true, unique: 'name'},
		{name: afStudio.ModelNode.LINK, hasMany: true, unique: 'name'},
		{name: afStudio.ModelNode.RADIO_GROUP, hasMany: true, unique: 'name'},
		{name: afStudio.ModelNode.IF}
	]
});