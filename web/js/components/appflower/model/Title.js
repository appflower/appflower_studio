/**
 * <u>i:title</u> model node.
 */
afStudio.model.Title = Ext.extend(afStudio.model.Node, {
	
	id : afStudio.ModelNode.TITLE,
	
	tag : afStudio.ModelNode.TITLE,
	
	_content : {name: '_content', required: true}
});