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
	
	//TODO add node-value type (_content in definition)
	
	properties : [
		{name: 'name', type: 'token', required: true}
	]
});