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
      	{name: "url", 			required: false, value: "n/a"},
      	{name: "action", 		required: false, value: "n/a"},
      	{name: "classic",  		required: false, value: "false"},
      	{name: "bodyStyle",  	required: false},
      	{name: "redirect", 		required: false},
      	{name: "expandButton",  required: false},
      	{name: "remoteLoad",  	required: false},
      	{name: "plugin",  		required: false}
	],
	
	listProperties : [
      	{name: "tree",  		required: false, value: false},
      	{name: "selectable",  	required: false, value: true},
      	{name: "exportable",  	required: false, value: true},
      	{name: "select",  		required: false, value: false},
      	{name: "pager",  		required: false, value: "true"},
      	{name: "remoteSort",  	value: "false"},
      	{name: "iconCls",  		required: false},
      	{name: "icon",  		required: false, value: "/images/famfamfam/accept.png"},
      	{name: "remoteFilter",  required: false},
		{name: "pagerTemplate", required: false}
	],
	
	editProperties : [
      	{name: "resetable",  	required: false, value: true},
      	{name: "resetlabel",  	required: false, value: "Reset"},
      	{name: "submitlabel",  	required: false, value: "Submit"},
      	{name: "multipart",  	required: false, value: "false"},
      	{name: "submit",  		required: false, value: "true"},
      	{name: "border",  		required: false, value: "true"},
      	{name: "label",  		required: false, value: "Save Selection"},
      	{name: "labelWidth", 	required: false, value: "75"}
	],
	
	listNodeTypes : [
		afStudio.ModelNode.COLUMN
	],
	
	editNodeTypes : [
		afStudio.ModelNode.FIELD,
		afStudio.ModelNode.BUTTON,
		afStudio.ModelNode.LINK,
		afStudio.ModelNode.RADIO_GROUP,
		afStudio.ModelNode.IF
	]	
});