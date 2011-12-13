Ext.ns('afStudio.theme.desktop');

/**
 * Desktop layout start menu editor window.
 * 
 * @class afStudio.StartMenuEditor
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.StartMenuEditor = Ext.extend(Ext.Window, { 

    /**
     * Template method
     * @override
     * @private
     */
    initComponent : function() {
        this.createRegions();
        
        var config = {
            title: 'Start Menu Editor', 
            layout: 'border',
            width: 813,
            height: 550, 
            modal: true, 
            closable: true,
            draggable: true, 
            resizable: false,
            bodyBorder: false, 
            border: false,
            items: [
                this.centerPanel,
                this.eastPanel
            ],
            buttonAlign: 'center',
            buttons: [
            {
                text: 'Cancel',
                scope: this,
                handler: this.cancel
            }]
        };
                
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        
        afStudio.theme.desktop.StartMenuEditor.superclass.initComponent.apply(this, arguments); 
    },
    
    /**
     * @override
     * @private
     */
    onShow : function() {
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'getHelper',
                key: 'menu'
            },
            scope: this,
            showNoteOnSuccess: false,
            run: function(response) {
                console.log('response', response);
                
                var mm = {
                    attributes: {
                        type: 'main'
                    }                        
                };
                mm.children = response.data.main;

                var mainCt = new afStudio.theme.desktop.menu.controller.MenuController({
                    viewDefinition: mm,
                    listeners: {
                        scope: this,
                        
                        ready: function(controller) {
                            var ip = new afStudio.view.InspectorPalette({
                                xtype: 'wd.inspectorPalette',
                                controller: controller
                            });
                            this.eastPanel.mainMenu.add(ip);
                            this.eastPanel.mainMenu.doLayout();    
                        }
                    }
                });
                
                mainCt.run();
                
                afStudio.Logger.info('@menu main ctrl', mainCt);
                
                //-----------------
                
                var tm = {
                    attributes: {
                        type: 'tools'
                    }                        
                };
                
                tm.children = response.data.tools;
                
                var toolsCt = new afStudio.theme.desktop.menu.controller.MenuController({
                    viewDefinition: tm,
	                listeners: {
                        scope: this,
                        
	                    ready: function(controller) {
                            var ip = new afStudio.view.InspectorPalette({
                                xtype: 'wd.inspectorPalette',
                                controller: controller
                            });
                            this.eastPanel.toolMenu.add(ip);
                            this.eastPanel.toolMenu.doLayout();    
	                    }
	                }
                    
                });
                
                toolsCt.run();
                
                afStudio.Logger.info('@menu tools ctrl', toolsCt);
            }
        });
        
    },
    
    /**
     * Init editor's layout.
     */
    createRegions : function() {
        this.eastPanel = new Ext.TabPanel({
            region: 'east',
            width: 350,
            minWidth: 300,
            split: true,
            activeTab: 0,
            defaults: {
              layout: 'fit'  
            },
            items: [
            {
                title: 'Main',
                ref: 'mainMenu'
            },{
                title: 'Tools',
                ref: 'toolMenu'
            }]
        });
        
        this.centerPanel = new Ext.Panel({
            region: 'center',
            layout: 'fit',  
            items: [],
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
        })
    },
    
    /**
     * Saves menu.
     */
    save : function() {
    },
    
    /**
     * Closes active window.
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

/**
 * shortcut
 */
afStudio.theme.StartMenuEditor = afStudio.theme.desktop.StartMenuEditor;