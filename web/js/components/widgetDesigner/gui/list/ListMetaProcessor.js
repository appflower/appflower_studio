Ext.ns('afStudio.wd.list');

/**
 * Mixin class dedicated for {@link afStudio.wd.list.SimpleListView}.
 * Responsible for visual reflection of view's metadata changes.  
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.list.ListMetaProcessor = (function() {
	
	return {
	
		/**
		 * Creates <i:action> object.
		 * @param {Object} a The action config object.
		 * @return {Object} action 
		 */
		createIAction : function(a) {
			var action = {
				name: a.name,
				text: a.text ? a.text : a.name,
				iconCls: a.iconCls ? a.iconCls : null,
				icon: a.icon ? a.icon : null,
				tooltip: a.tooltip ? a.tooltip : null,
				style: a.style ? a.style : null
			};			
						
			return action;		
		}//eo createIAction
		
		/**
		 * Adds new action to the view's action bar.
		 * @param {Object} a The action object being added
		 */
		,addIAction : function(a) {
		    var aBar   = this.getTopToolbar().getComponent('actions'),
				action = this.createIAction(a);
			
			aBar.insertButton(0, action);			
		}//eo addIAction
		
		/**
		 * Deletes action.
		 * @param {String} actionName The action name
		 * @param {Object} aBar The action container bar/menu.
		 */
		,deleteIAction : function(actionName, aBar) {			
			aBar.items.each(function(a) {
				if (a.name == actionName) {
					a.destroy();
					return false;
				}
			});
			this.updateActionBarVisibilityState();
		}//eo deleteIAction
		
		/**
		 * Adds action to i:moreactions.
		 * @param {Object} a The action object.
		 */
		,addMoreAction : function(a) {
		    var aBar   = this.getTopToolbar().getComponent('actions'),
		    	aMore  = aBar.getComponent('more'),		    	
				action = this.createIAction(a);
				
			aMore.menu.add(action);
		}//eo addMoreAction
		
		/**
		 * Adds rowaction.
		 * @param {Object} a The row action configuration object.
		 */
		,addIRowaction : function(a) {
			var cm = this.getColumnModel(),
				 s = this.getStore(),
			  aClm = cm.getColumnById('action-column');
			
			if (!aClm) {
				aClm = this.createRowActionColumn(a);
				cm.config.push(aClm);
			} else {
				cm.config.pop();
				var actions = aClm.items;
				a = this.createRowAction(a);
				actions.push(a);
				aClm = this.createRowActionColumn(actions);
				cm.config.push(aClm);
			}
			cm = new Ext.grid.ColumnModel(cm.config);
			
			this.reconfigure(s, cm);			
		}//eo addIRowaction
		
		/**
		 * Deletes rowaction.
		 * @param {String} actionName The rowaction name.
		 */
		,deleteIRowaction : function(actionName) {
			var cm = this.getColumnModel(),
				 s = this.getStore(),
			  aClm = cm.getColumnById('action-column');

			var actions = [];
			Ext.iterate(aClm.items, function(a, idx) {
				if (a.name != actionName) {
					actions.push(a);
				}
			});
			
			cm.config.pop();
			if (actions.length > 0) {
				aClm = this.createRowActionColumn(actions);
				cm.config.push(aClm);
			}
			cm = new Ext.grid.ColumnModel(cm.config);			
			this.reconfigure(s, cm);				
		}//eo deleteIRowaction
		
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
//				case 'select':
				
				case 'exportable':
					var bExport = aMore.menu.getComponent('exports');
					t.value ? bExport.show() : bExport.hide();
					this.updateActionBarVisibilityState();
				break;
				
				case 'selectable':
					var	bSel   = aMore.menu.getComponent('sel-all'),
						bDesel = aMore.menu.getComponent('desel-all');					
					t.value ? (bSel.enable(), bDesel.enable()) : (bSel.disable(), bDesel.disable());
					this.updateActionBarVisibilityState();
				break;
				
				case 'expandButton':
					var	bExpView = aBar.getComponent('expanded-view');
					t.value ? bExpView.show() : bExpView.hide();
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
			var cm = this.getColumnModel(),
				nodeName = t.node.getProperty('name').data.value;			
			
			if (t.name == 'name') {
				nodeName = t.oldValue;
			}
			
			var column = cm.getColumnsBy(function(c){return c.name == nodeName;})[0],			
				clmIndex = cm.getIndexById(column.id);
				
			switch (t.name) {
				case 'label':
					cm.setColumnHeader(clmIndex, t.value);					
				break;
				
				case 'name':
					column.name = t.value;
				break;
				
				case 'hidden':
					cm.setHidden(clmIndex, t.value);
				break;
				
				case 'hideable':
					column.hideable = t.value;
					cm.setConfig(cm.config, true);
				break;
				
				case 'resizable':
					column.fixed = !t.value;
					cm.setConfig(cm.config, true);				
				break;
				
				case 'width':
					var w = parseInt(t.value);
					if (Ext.isNumber(w)) {
						column.width = w;
						cm.setConfig(cm.config);
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
			var aBar = this.getTopToolbar().getComponent('actions');
			this.processActions(t, aBar);
		}//eo processIActionTag

		/**
		 * Handles <u>i:moreaction</u> tag changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processIMoreactionTag : function(t) {
			var aBar  = this.getTopToolbar().getComponent('actions'),
				aMore = aBar.getComponent('more');
			this.processActions(t, aMore.menu);
		}//eo processIMoreactionTag
		
		/**
		 * Processes actions and more-actions.
		 * @param {Object} t The meta-change event object.
		 * @param {Object} aBar The action container.
		 */
		,processActions : function(t, aBar) {
			var	nodeName = t.node.getProperty('name').data.value,
				action;		
				
			if (t.name == 'name') {
				nodeName = t.oldValue;
			}
			
			aBar.items.each(function(a) {
				if (a.name == nodeName) {
					action = a;
					return false;
				}
			});
							
			switch (t.name) {
				case 'name':
					action.name = t.value;
					var textV = Ext.util.Format.trim(t.node.getPropertyValue('text'));
					if (Ext.isEmpty(textV)) {
						action.setText(t.value);
					}
				break;
				
				case 'text':
					var textV = Ext.util.Format.trim(t.value);
					textV = textV ? textV : action.name;
					action.setText(textV);
				break;
				
				case 'iconCls':
					action.setIconClass(t.value);
				break;
				
				case 'icon':
					if (aBar.getXType() == 'menu') {
						action.icon = t.value;
						try {
							action.el.child('img').set({src: t.value});
						}catch(e){}
					} else {
						action.setIcon(t.value);						
					}					
				break;
				
				case 'tooltip':
					if (aBar.getXType() == 'menu') {
						//menu items has no tooltips
					} else {
						action.setTooltip(t.value);						
					}	
				break;
				
				case 'style':						
					action.el.dom.removeAttribute('style', '');
					action.el.applyStyles(t.value);
				break;
			}
		}//eo processActions		
		
		/**
		 * Handles <u>i:rowaction</u> tag changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */		
		,processIRowactionTag : function(t) {			
			var cm = this.getColumnModel(),
				 s = this.getStore(),
			  aClm = cm.getColumnById('action-column'),
			  nodeName = t.node.getProperty('name').data.value;			  
			
			if (t.name == 'name') {
				nodeName = t.oldValue;
			}
			
			var action;
			Ext.iterate(aClm.items, function(a) {
				if (a.name == nodeName) {
					action = a;	
				}
			});
			
			if (action) {
				switch (t.name) {
					case 'name':
						action.name = t.value;
						var tooltipV = Ext.util.Format.trim(t.node.getPropertyValue('tooltip'));
						if (Ext.isEmpty(tooltipV)) {
							action.tooltip = t.value;
						}
					break;
					
					case 'text':
						action.altText = t.value;
					break;
					
					case 'iconCls':
						action.iconCls = t.value;
					break;
					
					case 'icon':
						action.icon = t.value;
					break;
					
					case 'tooltip':
						var tooltipV = Ext.util.Format.trim(t.value);
						tooltipV = tooltipV ? tooltipV : action.name;					
						action.tooltip = tooltipV;
					break;				
				}
				cm.config.pop();
				aClm = this.createRowActionColumn(aClm.items);
				cm.config.push(aClm);
				cm = new Ext.grid.ColumnModel(cm.config);			
				this.reconfigure(s, cm);				
			}
		}//eo processIRowactionTag
	};	
})();