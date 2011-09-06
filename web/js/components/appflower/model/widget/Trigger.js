/**
 * <u>i:trigger</u> model node.
 * 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Trigger = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.TRIGGER,
	
	_content : null,
	
	properties : [
        {name: 'text', type: 'token'},
        {name: 'icon', type: 'absoluteUriType', defaultValue: '/images/famfamfam/cancel.png'},
 		{name: 'permissions', type: 'permissionType', defaultValue: '*'}        
	]
});