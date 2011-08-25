/**
 * ModelErrorWindow - widget's errors lister.
 * 
 * @class afStudio.wd.ModelErrorWindow
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.wd.ModelErrorWindow = Ext.extend(Ext.Window, {
	
	/**
	 * Widget model's errors
	 * @cfg {Object} (Required) modelErrors
	 */
	
	layout : 'fit',
	
	/**
	 * Widget's errors container tree.
	 * @property tree
	 * @type {Ext.ux.tree.TreeGrid}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var self = this;
		
	    var tree = new Ext.ux.tree.TreeGrid({
	        enableHdMenu: false,
	        enableSort: false,
	        root: new Ext.tree.AsyncTreeNode({
	        	children: []
	        }),
	        loader: {
	        	baseAttrs: {
	        		expanded: true
	        	}
	        },
	        columns: [{
	            header: 'Node',
	            dataIndex: 'node',
	            width: 200
	        },{
	            header: 'Errors',
	            width: 360,
	            dataIndex: 'error',
	            tpl: new Ext.XTemplate('<tpl for=".">{[this.getError(values.error)]}</tpl>', 
	            {
	                getError: function(errors) {
	                	var s = '';
	                	if (errors) {
	                		Ext.each(errors, function(err){
	                			Ext.iterate(err, function(k, v){
			                		s += String.format('<b>{0}</b> : {1}', k, v);
	                			});
	                			s += '<br />';
	                		});
	                	} else {
	                		s = '---';
	                	}
	                	
	                	return s;
	                }
	            })
	        }]
	    });
	    
	    this.tree = tree;
		
		return {
			title: 'Widget Designer',
			closeAction: 'hide',
			frame: true,
			width: 600,
			height: 320,
			iconCls: 'icon-notification-error',
			closable: false,
            resizable: true,
            items: tree,
            buttonAlign: 'center',
			buttons: [
			{
				text: 'Close', 
				scope: self,
				handler: self.closeWindow 
			}]
		}
	},
	//eo _beforeInitComponent
	
	/**
	 * Template method.
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.wd.ModelErrorWindow.superclass.initComponent.apply(this, arguments);
	},
	
	/**
	 * @private
	 */
	initEvents : function() {
		afStudio.wd.ModelErrorWindow.superclass.initEvents.call(this);
		
		this.on({
			scope: this,
			show: this.onShowWindow
		});		
	},

	/**
	 * Closes/Hides the window
	 */
	closeWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	},
	
	/**
	 * <u>show</u> event listener.
	 */
	onShowWindow : function() {
		var t = this.tree,
			l = t.getLoader(),
			r = t.getRootNode();
		
		r.attributes = this.modelErrors;	
			
		l.load(r);
	}
});