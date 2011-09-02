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
	
	/**
	 * @cfg {String} mode The code highlighting mode (default to "textile").
	 */
	mode : 'textile',
	
	/**
	 * @cfg {String} fileRootText The file root text
	 */
	fileRootText : 'root',
	
	/**
	 * @cfg {String} fileUrl The url to get file content
	 */
	fileUrl : afStudioWSUrls.getFilecontentUrl,
	
	/**
	 * @cfg {String} file The file to be shown in ace editor (defaults to null).
	 */
	file : null,

	/**
	 * @override
	 * @private
	 */
	afterRender : function() {
		Ext.ux.AceComponent.superclass.afterRender.call(this);
		
		//init ace editor, small delay for init. container's layout 
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

    setFileUrl : function(url) {
    	this.fileUrl = url;
    },
    
    /**
     * Sets code
     * @param {String} code The code being set
     */
    setCode : function(code) {
    	this.editor.getSession().setValue(code);
    },
    
    /**
     * Returns editors code.
     * @return {String} code
     */
    getCode : function() {
    	return this.editor.getSession().getValue();
    },
    
    /**
     * Sets editor's mode.
     * @param {String} mode The mode being set
     */
    setMode : function(mode) {
	    if (Ext.ux.AceComponent.modes.indexOf(mode) != -1) {
		    var aceMode = require("ace/mode/" + mode).Mode;
		    this.editor.getSession().setMode(new aceMode());
	    }
    },
    
    /**
     * Sets theme.
     * @param {String} theme The editor's theme being set
     */
    setTheme : function(theme) {
	    if (Ext.ux.AceComponent.themes.indexOf(theme) != -1) {
	   	 	this.editor.setTheme("ace/theme/" + theme);
	    }
    },
    
    /**
     * Loads file content into the editor.
     * @param {String} file The file path which content being loaded 
     */
    loadFile : function(file) {
    	afStudio.xhr.executeAction({
    		url: this.fileUrl,
    		params: {
    			file: file
    		},
    		showNoteOnSuccess: false,
    		scope: this,
    		run: function(response) {
    			this.setMode('css');
    			this.setCode(response.data);
    		}
    	});
    	
//       Ext.Ajax.request({
//          url: this.fileUrl,
//          scope: this,
//          method:'GET', 
//    		params: {
//    			file: file
//    		},
//          success: function(response, options){
//			var r = Ext.decode(response.responseText);
//			
//				if (r.success) {
//    			this.setMode('css');
//    			this.setCode(r.data);
//					
//				}
//			
//	      },	
//	      failure: function() {
//				Ext.Msg.alert("","The server can't read '"+this.file+"' !");
//			}
//        });    
	},
    
	/**
	 * Initialises ace editor.
	 * @protected
	 */
	initAce : function() {
	    var editor = ace.edit(this.el.dom);
	    
	    /**
	     * The ace editor (read-only).  
	     * @property editor
	     * @type {Object} Ace editor
	     */
	    this.editor = editor;

	    this.setTheme(this.theme);
	   
		this.setMode(this.mode);
		
	    if (this.code) {
	    	this.setCode(this.code);
	    }
	    
	    if (this.file) {
	    	this.loadFile(this.file);
	    }
	}
	//eo initAce
});

/**
 * Available modes.
 * @type Array 
 */
Ext.ux.AceComponent.modes = ['textile', 'javascript', 'css', 'html', 'json', 'markdown', 'php', 'xml'];

/**
 * Available themes.
 * @type Array
 */
Ext.ux.AceComponent.themes = ['twilight'];
