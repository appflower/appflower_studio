/**
 * <u>i:by</u> model node.
 * The inner node of <u>i:grouping</u> inside <b>list</b> view type.
 */
afStudio.model.widget.By = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.BY,
	
	properties : [
      	{name: 'ref', type: 'QName', required: true},
		{name: 'callback', type: 'token', required: true}
	]	
});