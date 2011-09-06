/**
 * <u>i:link</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Link = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.LINK,
	
	_content : null,
	
	properties : [
        {name: 'name', type: 'QName', required: true},
        {name: 'action', type: 'combinedUriType', required: true},
        {name: 'text', type: 'token', required: true},
      	{name: 'type', type: 'token', readOnly: true, defaultValue: 'link'},
 		{name: 'permissions', type: 'permissionType', defaultValue: '*'}        
	]
});