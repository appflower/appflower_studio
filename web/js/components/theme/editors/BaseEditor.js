Ext.ns('afStudio.theme');

/**
 * BaseEditor for all other Editors
 * @author radu
 */
afStudio.theme.BaseEditor = Ext.extend(Ext.Window, { 
    /**
     * @cfg {String} helper
     */
    
    /**
     * @cfg {String} title
     */

	/**
	 * ExtJS template method.
     * @override
	 * @private
	 */
	initComponent : function() {
		this.checkHelperFileExist();
        
		this.createRegions();
        
		var config = {
			width: 813,
			height: 550, closable: true,
	        draggable: true, 
	        modal: true, resizable: false,
	        bodyBorder: false, border: false,
	        layout: 'border',
	        items: [
	        	this.centerPanel
	        ],
			buttons: [
            {
                text: 'Cancel',
                scope: this,
                handler: this.cancel
            }],
			buttonAlign: 'center'
		};
				
		Ext.apply(this, Ext.apply(this.initialConfig, config));
        
		afStudio.theme.BaseEditor.superclass.initComponent.apply(this, arguments);	
	},
	
	/**
	 * This function creates west and center panels and needful components.
     * @private
	 */
	createRegions : function() {
        //FIXME hardcoded path
		this.codeEditor = new Ext.ux.AceComponent({
			file: 'root/apps/frontend/lib/helper/' + this.helper + 'Helper.php' 
		});
		
		this.centerPanel = new Ext.Panel({
			layout: 'fit', 
			region: 'center', 
			items: this.codeEditor,
			tbar: [
			{    
                text: 'Save', 
                iconCls: 'icon-save',
                scope: this,
                handler: this.save
            },'->',{
                text: 'Theme', 
                iconCls: 'icon-run-run', 
                scope: this,
                handler: this.tdshortcut
            }]
		});
	},
	
    /**
     * Saves file.
     * @author Nikolai Babinski
     */
	save : function() {
        var me = this,
            cp = this.codeEditor;
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.getFilecontentUrl,
            params: {
                file: cp.file,
                code: cp.getCode()                      
            },
            scope: me,
            logMessage: String.format('Helper file [{0}] was saved', cp.file)
        });
	},

    /**
     * @private
     */
	checkHelperFileExist : function() {
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.checkHelperFileUrl,
            params: {
                helper: this.helper
            },
            showNoteOnSuccess: false
        });
	},
	
	/**
	 * Function cancel
	 * Close active wimdow
	 */
	cancel : function() {
		this.close();
	},

    /**
     * Template Designer shortcut
     */
	tdshortcut : function() {
		this.close();
		(new afStudio.theme.ThemeDesigner()).show();
	}
});