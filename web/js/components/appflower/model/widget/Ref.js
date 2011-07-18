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
	]
});