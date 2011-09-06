/**
 * <u>i:window</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Window = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.WINDOW,
	
	_content : null,
	
	properties : [
        {name: 'title', type: 'token', required: true},
        {name: 'component', type: 'internalUriType', required: true},
        {name: 'className', type: 'token', required: true},
        {name: 'methodName', type: 'token', required: true},
        {name: 'width', type: 'positiveInteger', defaultValue: 500},
        {name: 'iconCls', type: 'token'}
	]
});