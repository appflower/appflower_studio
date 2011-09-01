/**
 * Ace editor https://github.com/ajaxorg/ace extension.
 * 
 * @class Ext.ux.AceComponent
 * @extends Ext.BoxComponent
 * @author Nikolai Babinski
 */
Ext.ux.AceComponent = Ext.extend(Ext.BoxComponent, {

	/**
	 * @cfg {String} code The code text to be used by the editor
	 */
	/**
	 * @cfg {String} theme The ace editor theme (defaults to "twilight").
	 */
	theme : 'twilight',
	
	
	initComponent : function() {
		Ext.ux.AceComponent.superclass.initComponent.apply(this, arguments);
	},

	/**
	 * @override
	 * @private
	 */
	afterRender : function() {
		Ext.ux.AceComponent.superclass.afterRender.call(this);
		
		//init ace editor, small delay for init. of containers layout 
		this.initAce.defer(10, this);
	},

    /** 
     * Called after the component is resized.
     * @override
     * @protected
     * @param {Number} adjWidth The box-adjusted width that was set
     * @param {Number} adjHeight The box-adjusted height that was set
     * @param {Number} rawWidth The width that was originally specified
     * @param {Number} rawHeight The height that was originally specified
     */
    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight) {
		if (this.editor) {
			this.editor.resize();
		}
    },

	/**
	 * Initialises ace editor.
	 * @protected
	 */
	initAce : function() {
	    var editor = ace.edit(this.el.dom);
	    editor.setTheme("ace/theme/twilight");
	   
	    //TODO conf language supporting
	    var JavaScriptMode = require("ace/mode/javascript").Mode;
	    editor.getSession().setMode(new JavaScriptMode());
	    
	    /**
	     * The ace editor (read-only).  
	     * @property editor
	     * @type {Object} Ace editor
	     */
	    this.editor = editor;
	    
	    if (this.code) {
	    	this.editor.getSession().setValue(this.code);
	    }
	    
	}
	//eo initAce
});