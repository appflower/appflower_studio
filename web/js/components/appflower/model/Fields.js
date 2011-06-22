Ext.ns('afStudio.model');

afStudio.model.Fields = Ext.extend(afStudio.model.Node, {

	tag : 'i:fields',
	
	properties : [
      	{name: "resetable",  	required: false, value: "true"},
      	{name: "resetlabel",  	required: false, value: "Reset"},
      	{name: "submitlabel",  	required: false, value: "Submit"}, 	
      	{name: "tree",  		required: false, value: "false"},
      	{name: "selectable",  	required: false, value: "true"},
      	{name: "exportable",  	required: false, value: "true"},
      	{name: "select",  		required: false, value: "false"},
      	{name: "pager",  required: false, value: "true"},
      	{name: "url", required: false, value: "n/a"},
      	{name: "action", required: false, value: "n/a"},
      	{name: "multipart",  required: false, value: "false"},
      	{name: "remoteSort",  value: "false"},
      	{name: "submit",  required: false, value: "true"},
      	{name: "classic",  required: false, value: "false"},
      	{name: "iconCls",  required: false},
      	{name: "icon",  required: false, value: "/images/famfamfam/accept.png"},
      	{name: "bodyStyle",  required: false},
      	{name: "border",  required: false, value: "true"},
      	{name: "portal",  required: false, value: "true"},
      	{name: "parsable",  fixed: "true"},
      	{name: "permissions",  required: false, value: "*"},
      	{name: "label",  required: false, value: "Save Selection"},
      	{name: "redirect", required: false},
      	{name: "expandButton",  required: false},
      	{name: "remoteLoad",  required: false},
      	{name: "labelWidth", required: false, value: "75"},
      	{name: "remoteFilter",  required: false},
      	{name: "plugin",  required: false},
		{name: "pagerTemplate",  required: false}
	]
	
});