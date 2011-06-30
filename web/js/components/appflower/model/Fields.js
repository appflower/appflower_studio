/**
 * <u>i:fields</u> model node.
 * 
 * @class afStudio.model.Fields
 * @extends afStudio.model.Node
 * @author Nikolai Babinski
 */
afStudio.model.Fields = Ext.extend(afStudio.model.TypedNode, {

	id : afStudio.ModelNode.FIELDS,
	
	tag : afStudio.ModelNode.FIELDS,
	
	properties : [
      	{name: "url", type: 'internalUriType', 'default': "n/a"},
      	{name: "action", type: 'internalUriType', 'default': "n/a"},
      	{name: "classic", type: 'boolean', 'default': "false"},
      	{name: "bodyStyle", type: 'token'},
      	{name: "redirect", type: 'internalUriType'},
      	{name: "expandButton",  type: 'boolean'},
      	{name: "remoteLoad", type: 'boolean'},
      	{name: "plugin", type: 'token'}
	],
	
	listProperties : [
      	{name: "tree", type: 'boolean', 'default': false},
      	{name: "selectable", type: 'boolean', 'default': true},
      	{name: "exportable", type: 'boolean', 'default': true},
      	{name: "select", type: 'boolean', 'default': false},
      	{name: "pager", type: 'boolean', 'default': true},
      	{name: "remoteSort", type: 'boolean', 'default': false},
      	{name: "iconCls", type: 'token'},
      	{name: "icon", type: 'token', 'default': '/images/famfamfam/accept.png'},
      	{name: "remoteFilter", type: 'boolean'},
		{name: "pagerTemplate", type: 'token'}
	],
	
	editProperties : [
      	{name: "resetable", type: 'boolean', 'default': true},
      	{name: "resetlabel", type: 'token', 'default': "Reset"},
      	{name: "submitlabel", type: 'token', 'default': "Submit"},
      	{name: "multipart", type: 'boolean', 'default': false},
      	{name: "submit", type: 'boolean', 'default': true},
      	{name: "border", type: 'boolean', 'default': true},
      	{name: "label", type: 'token', 'default': "Save Selection"},
      	{name: "labelWidth", type: 'positiveInteger', 'default': 75}
	],
	
	listNodeTypes : [
		{name: afStudio.ModelNode.COLUMN, required: true}
	],
	
	editNodeTypes : [
		{name: afStudio.ModelNode.FIELD, required: true},
		afStudio.ModelNode.BUTTON,
		afStudio.ModelNode.LINK,
		afStudio.ModelNode.RADIO_GROUP,
		afStudio.ModelNode.IF
	]	
});