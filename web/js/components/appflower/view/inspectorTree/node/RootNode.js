/**
 * Inspector tree <i>Root</i> node.
 * 
 * @class afStudio.view.inspector.RootNode
 * @extends Ext.tree.ContainerNode
 * @author Nikolai Babinski <niba@appflower.com>
 */
afStudio.view.inspector.RootNode = Ext.extend(afStudio.view.inspector.ContainerNode, {
	
	//TODO should be optimized and refactored to more flexible form 
	//as well as ContainerNode's initContextMenu method. 
	//by @Nick
	/**
	 * Template method.
	 * @override
	 * @protected
	 */
	initContextMenu : function() {
		var I = afStudio.view.inspector;
		
		var me = this,
			model = this.modelNode,
			nodes = model.nodeTypes,
			addText = I.TreeNode.addNodeCxtText,
			deleteText = I.TreeNode.deleteNodeCxtText,
			deleteAllText = I.ContainerNode.deleteAllNodeCxtText,
			mItems = [];
		
		//---
		//root's code snippet which is differs from Container node... the other code is the same - should be refactored
		Ext.iterate(nodes, function(n, idx) {
			var nodeName = n, required = false, hasMany = false;
			if (Ext.isObject(n)) {
				nodeName = n.name;
				required = n.required == true ? true : false;
				hasMany  = n.hasMany == true ? true : false;
			}
			if (!required || required && hasMany) {
				mItems.push({
					text: nodeName,
					node: nodeName,
					controll: 'add'
				});
			}
		});
		//------------
		
		if (mItems.length > 1) {
			mItems = [
			{	
				text: addText,
				iconCls: 'icon-add',
				menu: {
					items: mItems,
					listeners: {
						itemclick: function(item) {
			            	switch (item.controll) {
			            		case 'add':
			            			me.addModelNode(item.node);
			            		break;
			            	}
						}
					}
				}
			}];
		} else {
			mItems[0].itemId = mItems[0].controll;
			delete mItems[0].controll;
			mItems[0].text = String.format('{0} {1}', addText, mItems[0].text);
			mItems[0].iconCls = 'icon-add';
		}
		//---
		
		var menu = new Ext.menu.Menu({
			ignoreParentClicks: true,
			items: mItems,
			listeners: {
				itemclick: function(item) {
	            	var node = me;
	            	switch (item.itemId) {
	            		case 'add':
        					node.addModelNode(item.node);
        				break;
	            	}
				}
			}
		});
		
		this.contextMenu = menu;
	}
	//eo initContextMenu
	
});


/**
 * Adds "RootNode" type to inspector tree nodes {@link afStudio.view.inspector.nodeType} object.
 */
afStudio.view.inspector.nodeType.RootNode = afStudio.view.inspector.RootNode;