Ext.namespace('afStudio.layoutDesigner.view');

/**
 * ViewMessageBox an auxiliary panel for showing messages regarding to each separate view.
 * 
 * @class afStudio.layoutDesigner.view.ViewMessageBox
 * @extends Ext.Panel
 * @author Nikolai
 */
afStudio.layoutDesigner.view.ViewMessageBox = Ext.extend(Ext.Panel, {
	
	/**
	 * @cfg {Boolean} floating set to <b>true</b>
	 * To enable floating panel functionality.
	 * <b>important</b> it should be <u>true</u>.  
	 */
	floating : true,
	
	/**
	 * @cfg {String} style
	 */
	style : 'z-index: 10; text-align: center; font-size: 20px;',
	
	/**
	 * @cfg {Number} width (defaults to 600)
	 */
	width : 600,
	
	/**
	 * @cfg {Mixed} (required) viewContainer
     * The container to which this message-box is mapped.
	 */
	
	/**
	 * @cfg {String} viewMessage (required)
     * The message to show.
	 */
    
	/**
	 * @property messageHolder
	 * @type {Ext.Container}
	 */
	
	/**
	 * Initializes component
	 * @private
	 * @return {Object} The configuration object
	 */
	_beforeInitComponent : function() {
		var me = this;

		return {
			items: {
				ref: 'messageHolder',
				xtype: 'container',
				style: 'padding: 20px',
				html: this.viewMessage
			}
		};
	},
	
	/**
	 * Ext template method.
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, this._beforeInitComponent())
		);
        
		afStudio.layoutDesigner.view.ViewMessageBox.superclass.initComponent.apply(this, arguments);
	},

    /**
     * @template
     */
    initEvents : function() {
        afStudio.layoutDesigner.view.ViewMessageBox.superclass.initEvents.call(this);

        var me = this;

        me.on({
            scope: me,

            afterrender: me.onAfterRender
        });

        me.mon(me.viewContainer, 'afterlayout', me.onContainerAfterLayout, me);
    },

    /**
     * Updates the position of the message-box,
     * placing it in the center of the owner container {@link #viewContainer}
     * @protected
     */
    updatePosition : function() {
        var box = this.viewContainer.getBox(),
            x = Ext.util.Format.round(box.width / 2, 0) - this.getWidth() / 2,
            y = Ext.util.Format.round(box.height / 2, 0) - this.getHeight();

        this.setPosition(x, y);
    },

	/**
	 * *afterrender* event listener.
	 */
	onAfterRender : function() {
        this.updatePosition();
	},

    /**
     * Owner container's {@link #viewContainer} *afterlayout* event listener.
     */
    onContainerAfterLayout : function() {
        this.updatePosition();
    }

});