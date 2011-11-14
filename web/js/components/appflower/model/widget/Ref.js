/**
 * <u>i:ref</u> model node.
 * 
 * <ul>
 * 	<li>i:grouping</li>
 * 		<ul>
 * 			<li>i:set</li>
 *   		  <ul>
 * 			    <li>i:ref</li>
 * 		      </ul>
 * 		</ul>
 * </ul>
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Ref = Ext.extend(afStudio.model.TypedNode, {

	tag : afStudio.ModelNode.REF,
	
	_content : null,
	
	properties : [
      	{name: 'to', type: "QName", required: true},
      	{name: 'break', type: 'boolean', defaultValue: false},
      	{name: 'group', type: 'boolean', defaultValue: false},
      	{name: 'title', type: 'token'},
      	{name: 'tip', type: 'token'},
      	{name: 'json', type: 'token'}  
	],
	
	wizardProperties : [
      	{name: 'as', type: 'token'}
	],
	
	/**
	 * @override 
	 */
	onBeforeModelPropertyChanged : function(node, p, v) {
		var tree = this.getOwnerTree();
		
		//"to" property
		if (tree && p == "to") {
			var N = afStudio.ModelNode,
				r = tree.root,
				fs = r.getImmediateModelNode(N.FIELDS),
				gr = r.getImmediateModelNode(N.GROUPING);
			
			if (!Ext.isEmpty(v)) {
				var fields = fs.filterChildrenBy(function(n){
					return n.tag == N.FIELD && n.getPropertyValue('name') == v;
				});
				
				//field with specified name doesn't exists
				if (Ext.isEmpty(fields)) {
					afStudio.Msg.warning(String.format('Widget Designer - {0} node', N.REF), 
						String.format('Incorrect <u>to</u> property. <br/> Field with <u>name</u> = <b>{0}</b> does not exists.', v));
					
					return false;
				}
				
				//field should be associated only with one reference
				var ref = gr.findChild(N.REF, "to", v, true);
				if (ref) {
					afStudio.Msg.warning(String.format('Widget Designer - {0} node', N.REF), 
						String.format('Field <b>{0}</b> is already associated with another ref node. <br /> Please use another field name.', v));
					
					return false;
				}
			}
		}
		
		return true;
	}
	//eo onBeforeModelPropertyChanged
});