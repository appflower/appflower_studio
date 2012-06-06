Ext.ns('afStudio.theme');

/**
 * BaseEditor for all other Editors
 * @author radu
 * @author Nikolai Babinski
 */
afStudio.theme.BaseEditor = Ext.extend(Ext.Panel, {
    /**
     * @cfg {String} helper (required)
     * The editor helper file's name.
     */

    //private override
    anchor: '100% 100%',
    layout: 'fit',

    /**
	 * ExtJS template method.
     * @override
	 * @private
	 */
	initComponent : function() {
		this.checkHelperFileExist();
        
		this.createRegions();

        Ext.apply(this, Ext.apply(this.initialConfig,
        {
            border: false,
            items: [
                this.centerPanel
            ]
        }));

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
			items: this.codeEditor
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
	}
});