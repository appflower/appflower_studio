/**
 * <u>i:source</u> model node.
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Source = Ext.extend(afStudio.model.Node, {

	tag: afStudio.ModelNode.SOURCE,
	
	_content : null,
	
	properties : [
        {name: 'name', type: 'token', required: true}
	]
});