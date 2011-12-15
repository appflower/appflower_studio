Ext.ns('afStudio.view');

/**
 * @class afStudio.view.ModelErrorWindow
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.view.ModelErrorWindow = Ext.extend(Ext.Window, {
	
	/**
	 * @cfg {Object} (required) modelErrors The error object
	 */
	
	/**
     * The errors container tree.
	 * @property tree 
	 * @type {Ext.ux.tree.TreeGrid}
	 */
	
    layout : 'fit',
    
    title : '&#160;',
    
    closeAction : 'hide',
    
    frame : true,
    
    width : 600,
    
    height : 320,
    
    iconCls : 'icon-notification-error',
    
    closable : false,
    
    resizable : true,
    
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object 
	 */
	_beforeInitComponent : function() {
		var self = this;
		
	    this.tree = new Ext.ux.tree.TreeGrid({
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
	    
		return {
            items: this.tree,
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
	 * Ext template method.
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);				
		afStudio.view.ModelErrorWindow.superclass.initComponent.apply(this, arguments);
	},

    /**
     * Method that is called immediately before the <code>show</code> event is fired.
     * @override
     * @protected
     */
    onShow : function() {
        var t = this.tree,
            l = t.getLoader(),
            r = t.getRootNode();
        
        r.attributes = this.modelErrors;    
            
        l.load(r);
    },
    
	/**
	 * Closes/hides this window.
     * @protected
	 */
	closeWindow : function() {
		if (this.closeAction == 'hide') {
			this.hide();
		} else {
			this.close();
		}
	}
});