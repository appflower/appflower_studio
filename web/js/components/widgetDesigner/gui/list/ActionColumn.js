Ext.ns('afStudio.wd.list');

/**
 * List View action column.
 * 
 * @class afStudio.wd.list.ActionColumn
 * @extends Ext.grid.ActionColumn
 * @author Nikolai Babinski
 */
afStudio.wd.list.ActionColumn = Ext.extend(Ext.grid.ActionColumn, {
	
	/**
	 * Action Column. 
	 * @constructor
	 * @param {Object} cfg
	 */
    constructor : function(cfg) {    	
    	afStudio.wd.list.ActionColumn.superclass.constructor.call(this, cfg);
    	
        var me = this,
            items = cfg.items || (me.items = [me]),
            l = items.length,
            i,
            item;
    	
        me.renderer = function(v, meta) {
            v = Ext.isFunction(cfg.renderer) ? (cfg.renderer.apply(this, arguments) || '') : '';
            
            meta.css += ' x-action-col-cell';
            for (i = 0, len = items.length; i < len; i++) {
                item = items[i];
                v += '<img width="16" alt="' + item.altText + '" src="' + (item.icon ? item.icon : (Ext.isEmpty(item.iconCls) ? '' : Ext.BLANK_IMAGE_URL)) +
                    '" class="x-action-col-icon x-action-col-' + String(i) + ' ' + (item.iconCls || '') +
                    ' ' + (Ext.isFunction(item.getClass) ? item.getClass.apply(item.scope||this.scope||this, arguments) : '') + '"' +
                    ((item.tooltip) ? ' ext:qtip="' + item.tooltip + '"' : '') + ' />';
            }
            return v;
        };
    }
});

Ext.apply(Ext.grid.Column.types, {
	listactioncolumn : afStudio.wd.list.ActionColumn	
});