/**
 * InspectorPalette is the palette of instruments dedicated for browsing/building/manipulating of widget's data. 
 * 
 * @class afStudio.wi.InspectorPalette
 * @extends afStudio.view.InspectorPalette
 * @author Nikolai Babinski
 */
afStudio.wd.InspectorPalette = Ext.extend(afStudio.view.InspectorPalette, {
	/**
	 * @cfg {String} layout (sets to 'accordion') 
	 */
	layout : 'accordion',
    
	title: 'Widget Inspector'
});

/**
 * @type 'wd.inspectorPalette'
 */
Ext.reg('wd.inspectorPalette', afStudio.wd.InspectorPalette);