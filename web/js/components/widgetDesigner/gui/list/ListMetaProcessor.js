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
		
	};	
})();