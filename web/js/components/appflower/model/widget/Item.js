/**
 * <u>i:item</u> model node.
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Item = Ext.extend(afStudio.model.Node, {

	tag: afStudio.ModelNode.ITEM,
	
	_content : null,
	
	properties : [
        {name: 'value', type: 'token', required: true}
	]
});