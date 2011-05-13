Ext.ns('afStudio.wd.list');

/**
 * Mixin class dedicated for {@link afStudio.wd.list.SimpleListView}
 * 
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.list.ListMetaProcessor = (function() {
	
	return {
	
		/**
		 * Adds new action to the view's action bar.
		 * @param {Object} a The action object being added
		 * @param {Ext.Toolbar} aBar The action toolbar 
		 */
		addIAction : function(a, aBar) {			
			var action = {
				name: a.name,
				text: a.text ? a.text : a.name,
				tooltip: a.tooltip ? a.tooltip : null,
				style: a.style ? a.style : null
			};
			
			var icon = a.iconCls ? 'iconCls' : (a.icon ? 'icon' : null);
			if (icon) {
				action[icon] = a[icon];
			}
			
			aBar.insertButton(0, action);			
		}//eo addIAction
		
		/**
		 * Meta-data processing Controller.
		 * 
		 * @param {Object} e The meta-change event object:
		 * <ul>
		 * <li><b>node</b>: WI node, the holder of meta data</li>
		 * <li><b>name</b>: The name of updating property</li>
		 * <li><b>value</b>: The new property value</li>
		 * <li><b>oldValue</b>: The old property value</li>
		 * </ul>
		 */
		,processMeta : function(e) {
			var mf = e.node.attributes.metaField;		
			
			if (Ext.isDefined(mf)) {
				var t = mf;
				if (t.indexOf('i:') != -1) {
				    t =  'I' + t.replace(/^i:(\w+)/i, "$1").ucfirst();
				} else {
				    t = t.ucfirst();
				}			
				t = String.format('process{0}Tag', t);
				
				this[t](e);
			}
		}//eo processMeta
		
		/**
		 * Handles <u>i:fields</u> tag changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processIFieldsTag : function(t) {
			var bbar  = this.getBottomToolbar(),
				aBar  = this.getTopToolbar().getComponent('actions'),
				aMore = aBar.getComponent('more');
			
			switch (t.name) {
				case 'exportable':
					var bExport = aMore.menu.getComponent('exports');
					t.value ? bExport.show() : bExport.hide();
					this.updateMoreActionVisibilityState();
					this.updateActionBarVisibilityState();
				break;
				
				case 'selectable':
					var	bSel   = aMore.menu.getComponent('sel-all'),
						bDesel = aMore.menu.getComponent('desel-all');					
					t.value ? (bSel.enable(), bDesel.enable()) : (bSel.disable(), bDesel.disable());
					this.updateMoreActionVisibilityState();
					this.updateActionBarVisibilityState();				
				break;
				
				case 'expandButton':
					var	bExpView = aBar.getComponent('expanded-view');
					t.value ? bExpView.show() : bExpView.hide();
					this.updateMoreActionVisibilityState();
					this.updateActionBarVisibilityState();					
				break;
				
				case 'pager':
					if (t.value === false) {
						bbar.hide();	
					} else {
						bbar.show();
					}
					this.doLayout();
				break;
			}					
		}//eo processIFieldsTag
		
		/**
		 * Handles <u>i:column</u> tag changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processIColumnTag : function(t) {
			var cm = this.getColumnModel();
			
			switch (t.name) {
				case 'label':
					var nodeName = t.node.getProperty('name').data.value,
						clms     = cm.getColumnsBy(function(c) {						
										return c.name == nodeName;
								   });
					if (clms[0]) {
						cm.setColumnHeader(cm.getIndexById(clms[0].id), t.value);
					}
				break;
				
				case 'name':
					var clms = cm.getColumnsBy(function(c) {						
						return c.name == t.oldValue;
					});
					if (clms[0]) {
						clms[0].name = t.value;
					}
				break;
			}		
		}//eo processIColumnTag
		
		/**
		 * Handles <u>root</u> node changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processRootTag : function(t) {	
			switch (t.name) {
				case 'i:title':
					this.setTitle(t.value);
				break;
				
				case 'i:description':
					var descCmp = this.getTopToolbar().getComponent('desc');
					descCmp.get(0).setText(t.value);
					if (Ext.util.Format.trim(t.value)) {
						descCmp.show();	
					} else {
						descCmp.hide();
					}
					this.doLayout();
				break;
			}
		}//eo processRootTag
		
		/**
		 * Handles <u>i:action</u> tag changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processIActionTag : function(t) {
			var aBar     = this.getTopToolbar().getComponent('actions'),
				aNum     = aBar.items.getCount() - 3,
				nodeName = t.node.getProperty('name').data.value,
				action;
				
			if (t.name == 'name') {
				nodeName = t.oldValue;
			}
			
			aBar.items.each(function(a, idx, len) {
				if (idx < aNum) {
					if (a.name == nodeName) {
						action = a;
						return false;
					}
				} else {
					return false;
				}
			});
							
			switch (t.name) {
				case 'name':
					action.name = t.value;
					if (Ext.isEmpty(action.text)) {
						action.setText(action.name);
					}
					break;				
				case 'text':
					action.setText(t.value);
					break;				
				case 'iconCls':
					action.setIconClass(t.value);
					break;				
				case 'icon':
					action.setIcon(t.value);
					break;				
				case 'tooltip':
					action.setTooltip(t.value);
					break;				
				case 'style':						
					action.el.dom.removeAttribute('style', '');
					action.el.applyStyles(t.value);
					break;				
			}
		}//eo processIActionTag
	};	
})();


