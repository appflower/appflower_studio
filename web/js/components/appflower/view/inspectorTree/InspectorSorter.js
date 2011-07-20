Ext.ns('afStudio.view.inspector');

afStudio.view.inspector.sorter = {};
N = afStudio.view.inspector.sorter;
NS = afStudio.ModelNode;

N[NS.TITLE] = 1;
N[NS.PARAMS] = 4;
N[NS.ACTIONS] = 8; 
N[NS.FIELDS] = 12;
N[NS.ROW_ACTIONS] = 16; 
N[NS.MORE_ACTIONS] = 20;
N[NS.CONFIRM] = 24;
N[NS.DATA_SOURCE] = 6; 
N[NS.DATA_STORE] = 6;
N[NS.GROUPING] = 28;
N[NS.DESCRIPTION] = 32;
N[NS.ALTERNATE_DESCRIPTIONS] = 34;
N[NS.MENU] = 2;
N[NS.SCRIPTS] = 3; 
N[NS.FIELD] = 100;
N[NS.COLUMN] = 100;
N[NS.BUTTON] = 101;
N[NS.LINK] = 102;
N[NS.RADIO_GROUP] = 103; 
N[NS.ACTION] = 110;
N[NS.IF] = 111;
N[NS.SET] = 104;
N[NS.REF] = 105;
N[NS.PARAM] = 130;
N[NS.AREA] = 10;
N[NS.WIDGET_CATEGORIES] = 
N[NS.EXTRA_HELP] = 36; 
N[NS.OPTIONS] = 5;
N[NS.CLASS] = 108;
N[NS.METHOD] = 109;

delete NS;
delete N;

/**
 * InspectorTree sorter.
 * 
 * @class afStudio.view.inspector.InspectorSorter
 * @extends Ext.tree.TreeSorter
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.InspectorSorter = Ext.extend(Ext.tree.TreeSorter, {
		
	sortType : function(node) {
		var nodeValue = afStudio.view.inspector.sorter[node];
		
		return nodeValue ? nodeValue : 500;
	}
});