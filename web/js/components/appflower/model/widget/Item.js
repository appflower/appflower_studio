/**
 * <u>i:item</u> model node.
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Item = Ext.extend(afStudio.model.Node, {

	tag: afStudio.ModelNode.ITEM,
	
	_content : {name: '_content', type: 'string', required: true},
	
	properties : [
        {name: 'value', type: 'token', required: true}
	]
});