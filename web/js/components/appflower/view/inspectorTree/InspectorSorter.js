Ext.ns('afStudio.view.inspector');

afStudio.view.inspector.sorter = {};
S = afStudio.view.inspector.sorter;
N = afStudio.ModelNode;

S[N.TITLE] = 1;
S[N.CONFIRM] = 4;
S[N.PARAMS] = 5;
S[N.ROW_ACTIONS] = 8; 
S[N.FIELDS] = 12;
S[N.ACTIONS] = 16;
S[N.MORE_ACTIONS] = 20;
S[N.DATA_SOURCE] = 6; 
S[N.DATA_STORE] = 6;
S[N.GROUPING] = 28;
S[N.DESCRIPTION] = 32;
S[N.ALTERNATE_DESCRIPTIONS] = 34;
S[N.MENU] = 2;
S[N.SCRIPTS] = 3; 
S[N.FIELD] = 100;
S[N.COLUMN] = 100;
S[N.BUTTON] = 101;
S[N.LINK] = 102;
S[N.RADIO_GROUP] = 103; 
S[N.ACTION] = 110;
S[N.IF] = 111;
S[N.SET] = 104;
S[N.REF] = 105;
S[N.PARAM] = 130;
S[N.AREA] = 10;
S[N.EXTRA_HELP] = 36; 
S[N.OPTIONS] = 5;
S[N.CLASS] = 108;
S[N.METHOD] = 109;
//i:field children	
S[N.VALUE] = 140;
S[N.TOOLTIP] = 142;
S[N.HELP] = 144;
S[N.VALIDATOR] = 146;
S[N.HANDLER] = 148;
S[N.WINDOW] = 150;
S[N.TRIGGER] = 152;


delete N;
delete S;

/**
 * InspectorTree sorter.
 * 
 * @class afStudio.view.inspector.InspectorSorter
 * @extends Ext.tree.TreeSorter
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.InspectorSorter = Ext.extend(Ext.tree.TreeSorter, {

	constructor : function(tree, config) {
		afStudio.view.inspector.InspectorSorter.superclass.constructor.apply(this, [tree, config]);
		
		var desc = this.dir && this.dir.toLowerCase() == 'desc',
			sortType = this.sortType;
		
	    this.sortFn = function(n1, n2) {
	        var m1 = n1.modelNode,
	            m2 = n2.modelNode;
	            
	        var v1 = sortType(m1.tag),
	            v2 = sortType(m2.tag);
	        
	        if (v1 < v2) {
	            return desc ? 1 : -1;
	        } else if (v1 > v2) {
	            return desc ? -1 : 1;
	        }
	        return 0;
	    };
	},	
	
	/**
	 * @protected
	 * @param {String} node The model node's tag name
	 * @return {Number}
	 */
	sortType : function(node) {
		var nodeValue = afStudio.view.inspector.sorter[node];
		return Ext.isDefined(nodeValue) ? nodeValue : 500;
	}
});