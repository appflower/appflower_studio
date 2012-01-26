Ext.ns('afStudio.theme.desktop');

/**
 * Desktop layout start menu editor window.
 * 
 * @class afStudio.theme.desktop.StartMenuEditor
 * @extends Ext.Window
 * @author Nikolai Babinski
 */
afStudio.theme.desktop.StartMenuEditor = Ext.extend(Ext.Window, { 

    /**
     * @property mainCt The main menu controller
     * @type {MenuController}
     */
    /**
     * @property toolsCt The tools menu controller
     * @type {MenuController}
     */
    /**
     * @property errorWin The error window reference
     * @type {afStudio.view.ModelErrorWindow}
     */
    
    /**
     * @property menuAttr Menu meta-data attributes
     * @type {Object}
     */
    
    /**
     * Ext template method.
     * @override
     * @private
     */
    initComponent : function() {
        this.createRegions();
        
        var config = {
            title: 'StartMenu Editor', 
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
     * Method that is called immediately before the <code>show</code> event is fired.
     * @override
     * @protected
     */
    onShow : function() {
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'getHelper',
                key: 'menu'
            },
            scope: this,
            mask: {ctn: this.eastPanel},
            run: function(response) {
                this.menuAttr = response.data.attributes;
                this.initMainMenu(response.data.main);
                this.initToolsMenu(response.data.tools);
                this.initView();
            }
        });
    },

    /**
     * Cleanup resources. 
     * Destroys main menu {@link #mainCt} and tools {@link #toolsCt} controllers, 
     * error window {@link #errorWin} etc.
     * @override
     * @private
     */
    onDestroy : function() {
        Ext.destroy(this.mainCt, this.toolsCt, this.errorWin);
        this.mainCt = this.toolsCt = this.errorWin = null;
        
        this.eastPanel = this.centerPanel = this.menuAttr = null;
        
        afStudio.theme.desktop.StartMenuEditor.superclass.onDestroy.call(this);
    },
    
    /**
     * Init editor's layout.
     * @private
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
        });
    },
    //eo createRegions
    
    /**
     * Instantiates live menu view.
     * @protected
     */
    initView : function() {
        var view = new afStudio.theme.desktop.menu.view.StartMenuView({
            title: this.menuAttr.title || '',
            iconCls: this.menuAttr.iconCls,
            icon: this.menuAttr.icon,
            items: []
        });
        
        this.mainCt.registerView('menu', view);
        this.toolsCt.registerView('tools', view);

        this.centerPanel.add(view);
        this.centerPanel.doLayout();
        view.show(this.centerPanel.body, 'c-c?');
    },
    
    /**
     * Init main menu.
     * @protected
     * @param {Object} definition The main menu definition object
     */
    initMainMenu : function(definition) {
        var mm = {
            attributes: {
                type: 'main',
                title: this.menuAttr.title,
                iconCls: this.menuAttr.iconCls,
                icon: this.menuAttr.icon
            }
        };
        mm.children = definition;

        this.mainCt = new afStudio.theme.desktop.menu.controller.MenuController({
            viewDefinition: mm,
            listeners: {
                scope: this,
                
                ready: function(controller) {
                    var ip = new afStudio.view.InspectorPalette({
                        controller: controller
                    });
                    this.eastPanel.mainMenu.add(ip);
                    this.eastPanel.mainMenu.doLayout();    
                }
            }
        });
        
        this.mainCt.run();
        
        afStudio.Logger.info('@menu main controller', this.mainCt);
    },
    
    /**
     * Init tools menu.
     * @protected
     * @param {Object} definition The tools menu definition object
     */
    initToolsMenu : function(definition) {
        var tm = {
            attributes: {
                type: 'tools'
            }                        
        };
        
        tm.children = definition;
        
        this.toolsCt = new afStudio.theme.desktop.menu.controller.MenuController({
            viewDefinition: tm,
            listeners: {
                scope: this,
                
                ready: function(controller) {
                    var ip = new afStudio.view.InspectorPalette({
                        controller: controller
                    });
                    this.eastPanel.toolMenu.add(ip);
                    this.eastPanel.toolMenu.doLayout();    
                }
            }
            
        });
        
        this.toolsCt.run();
        
        afStudio.Logger.info('@menu tools controller', this.toolsCt);
    },
    
    /**
     * Validates menu model and shows errors if any exists returning false otherwise returns true.
     * @protected
     * @return {Boolean}
     */
    validate : function() {
        var mainValid = this.mainCt.validateModel(),
            toolsValid = this.toolsCt.validateModel(),
            errors = [];
            
        if (mainValid !== true) {
            errors.push({
                node: 'MAIN',
                error: null,
                children: mainValid.children
            });
        }
        if (toolsValid !== true) {
            errors.push({
                node: 'TOOLS',
                error: null,
                children: toolsValid.children
            });
        }
        
        if (errors.length > 0) {
            errors = {children: errors};
            
            if (!this.errorWin) {
                this.errorWin = new afStudio.view.ModelErrorWindow({
                    title: 'Desktop start menu'
                });
            }
            this.errorWin.modelErrors = errors;
            this.errorWin.show();
            
            return false;
        }
        
        return true;
    },
    //eo validate
    
    /**
     * Saves menu.
     */
    save : function() {
        if (this.validate() == false) {
            return;
        }
        
        var data = {};
        
        var main = this.mainCt.root.fetchNodeDefinition(),
            tools = this.toolsCt.root.fetchNodeDefinition();
        
        afStudio.Logger.info('@menu main definition', main, Ext.encode(main));            
        afStudio.Logger.info('@menu tools definition', tools, Ext.encode(tools));
        
        data.attributes = main.attributes;
        
        if (main.children) {
            data.main = main.children; 
        }
        if (tools.children) {
            data.tools = tools.children; 
        }
        
        afStudio.Logger.info('@menu', data, Ext.encode(data));
        
        afStudio.xhr.executeAction({
            url: afStudioWSUrls.project,
            params: {
                cmd: 'saveHelper',
                key: 'menu',
                content: Ext.encode(data)
            },
            mask: {ctn: this, msg: 'saving...'}
        });
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