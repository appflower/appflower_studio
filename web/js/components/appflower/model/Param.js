/**
 * <u>i:param</u> model node.
 * 
 * <ul>
 * 	<li>i:params</li>
 * 		<ul>
 * 			<li>i:param</li>
 *          <li>i:param</li>
 *          <li>...</li>
 *      </ul>    
 * </ul> 
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.Param = Ext.extend(afStudio.model.Node, {

	tag : afStudio.ModelNode.PARAM,

	_content : {name: '_content', required: true},
	
	defaultDefinition : {
		attributes: {
			name: 'i:param'
		}
	},	
	
	properties : [
		{name: 'name', type: 'token', required: true}
	]
});