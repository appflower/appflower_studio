/**
 * <u>i:column</u> model node.
 * 
 * <ul>
 * 	<li>i:fields</li>
 * 		<ul>
 * 			<li>i:column</li>
 * 			<li>...</li>
 * 			<li>i:column</li>
 * 		</ul>
 * </ul>
 * @class afStudio.model.widget.Column
 * @extends afStudio.model.Node
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.model.widget.Column = Ext.extend(afStudio.model.Node, {

	tag: afStudio.ModelNode.COLUMN,
	
	properties : [
        {name: 'name', type: 'dbNameType', required: true},
        {name: 'label', type: 'token', required: true},
        {name: 'qtip', type: 'boolean', defaultValue: false},
        {name: 'help', type: 'token'},
		{name: 'width', type: 'positiveInteger'},
        {name: 'editable', type: 'boolean', defaultValue: false},
		{name: 'sortable', type: 'boolean', defaultValue: true},
		{name: 'resizable', type: 'boolean', defaultValue: true},
        {name: 'style', type: 'token'},
//      {name: 'isid', type: 'boolean'},
        {name: 'groupField', type: 'boolean'},
        {name: 'sort', type: 'sortType'},
        {name: 'hidden', type: 'boolean', defaultValue: false},
        {name: 'hideable', type: 'boolean', defaultValue: true},
        {name: 'align', type: 'alignType', defaultValue: 'left'},
//      {name: 'assignid', type: 'boolean', fixed="true"},
        {name: 'filter', type: 'arrayType'},        
        {name: 'permissions', type: 'permissionType', defaultValue: '*'},
//      {name: 'type', type: 'token'},
//      {name: 'sortType', type: 'token', defaultValue: 'none'},
//      {name: 'sortIndex', type: 'token'},
//      {name: 'contextMenu', type: 'token'},
        {name: 'link', type: 'boolean',  defaultValue: false},
//      {name: 'edit', type: 'boolean', defaultValue: false},
//		{name: 'action', type: 'token'},
//		{name: 'summaryType', type: 'token'}	
	],
	
	/**
	 * @override
	 * @return {String} node's string presentation
	 */
    toString : function() {
		var tpl = new Ext.XTemplate(
			'[model.Node: "{tag}", ID: "{id}", properties: {[this.toJson(values.properties.map)]}]',
			{
        		compiled: true,
        		disableFormats: true,
        		toJson: function(o) {
        			return Ext.encode({'name': o.name.value, 'label': o.label.value});
        		}
    		});
    	
        return tpl.apply(this);
    }
    //eo toString
});