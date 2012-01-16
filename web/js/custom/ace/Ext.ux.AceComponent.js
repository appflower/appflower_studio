/**
 * Ace editor https://github.com/ajaxorg/ace extension.
 * 
 * ACE editor's global name is <b>ace</b>, be aware to not override it! 
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
	 * @cfg {String} fileUrl The url to get file content
	 */
	fileUrl : afStudioWSUrls.getFilecontentUrl,
	
	/**
	 * @cfg {String} file The file path to be shown in ace editor (defaults to null).
	 */
	file : null,

	/**
	 * @cfg {String} fileParam The file path parameter holder (defaults to "file"). 
	 */
	fileParam : 'file',
	
	/**
	 * @cfg {String} loadingText The loading editor's mask text (defaults to "loading...").
	 */
	loadingText : 'loading...',
	
	/**
	 * The loading parameters being send with file path to the server to get 
	 * file content (defaults to empty object <i>{}</i>).
	 * @cfg {Object} loadingParams
	 */
	loadingParams : {},
	
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
    
    /**
     * Sets file loading content url.
     * @param {String} url
     */
    setFileUrl : function(url) {
    	this.fileUrl = url;
    },
    
    /**
     * Sets file path.
     * @param {String} file The file path being set
     * @param {Boolean} reload (optional) The flag responsible for reloading editor's content (defaults to false) 
     */
    setFile : function(file, reload) {
		this.file = file;
		if (reload == true) {
			this.loadFile(this.file);
		}
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
     * Sets editor's mode. If passed mode is not available the "default plain" text mode is used.
     * Modes {@link Ext.ux.AceComponent.modes}.
     * @param {String} mode The mode being set
     */
    setMode : function(mode) {
    	var aceMode = (Ext.ux.AceComponent.modes.indexOf(mode) != -1) 
    					? ace.require("ace/mode/" + mode).Mode
    					: ace.require("ace/mode/textile").Mode;
	    
	    this.editor.getSession().setMode(new aceMode());
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
     * Masks editor.
     * @protected
     */
    maskEditor : function() {
    	this.el.mask(this.loadingText ? this.loadingText : null);
    },
    
    /**
     * Removes editor's mask
     * @protected
     */
    unmaskEditor : function() {
    	var el = this.el;
    	if (el.isMasked()) {
    		el.unmask();
    	}
    },
    
    /**
     * Loads file content into the editor.
     * @param {String} file The file path which content being loaded 
     */
    loadFile : function(file) {
    	var parameters = Ext.apply({}, this.loadingParams);
    	parameters[this.fileParam] = file;
    	
    	this.maskEditor();
    	
		Ext.Ajax.request({
			url: this.fileUrl,
			method:'GET',
    		params: parameters,
			scope: this,
			success: function(response, opt) {
				this.unmaskEditor();
				var r = Ext.decode(response.responseText);
				
				if (r.success) {
					//sets file property
					this.file = file;
					//binary data
					if (r.data == null) {
						this.setCode('');
						return;
					}
	    			this.setMode(this.getModeByFileExtension(file));
	    			this.setCode(r.data);
				} else {
					this.setCode('');
					
					var message  = String.format('File "{0}" loading failure. <br/> {1}', file, r.message ? r.message : ''),
						msgTitle = "Ace editor";
						
					Ext.Msg.alert(msgTitle, message);	
				}
			},	
			failure: function(response, opt) {
				this.unmaskEditor();
				var message  = String.format('File "{0}" loading failure. <br/> status code: {1} <br /> Message: {2}', file, xhr.status, xhr.statusText || '(none)'),
					msgTitle = "Ace editor";
					
				Ext.Msg.alert(msgTitle, message);	
			}
        });    
	},
	//eo loadFile
    
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
	   
	    if (!this.file) {
			this.setMode(this.mode);
	    }
		
	    if (this.code && !this.file) {
	    	this.setCode(this.code);
	    }
	    
	    if (this.file) {
	    	this.loadFile(this.file);
	    }
	},
	//eo initAce
	
	/**
	 * Resolves mode by file extension.
	 * @param {String} file The file being examined
	 * @return {String} mode
	 * @protected
	 */
	getModeByFileExtension : function(file) {
 		var ext = /\.(\w+)$/.exec(file);
 		ext = ext ? ext[1] : null;
		
 		var mode = 'textile';
 		
	  	switch (ext) {
	  		case 'php': case 'phtml':
	  			mode = 'php';
	  		break;
	  			
	  		case 'js':
	  			mode = 'javascript';
  			break;
	  			
	  		case 'css':
	  			mode = 'css';
  			break;
	  			
	  		case 'html': case 'htm':
	  			mode = 'html';
  			break;
  			
	  		case 'json':
	  			mode = 'json';
  			break;
  			
	  		case 'md':
	  			mode = 'markdown';
  			break;
  			
	  		case 'xml':
	  			mode = 'xml';
  			break;
            
	  		case 'sql':
	  			mode = 'sql';
  			break;
	  	}		
		
		return mode;
	}
	//eo getModeByFileExtension
});

/**
 * Available modes.
 * @type Array 
 */
Ext.ux.AceComponent.modes = ['textile', 'php', 'javascript', 'xml', 'css', 'html', 'json', 'markdown', 'sql'];

/**
 * Available themes.
 * @type Array
 */
Ext.ux.AceComponent.themes = ['twilight'];

/**
 * Registers type.
 * @type ace
 */
Ext.reg('ace', Ext.ux.AceComponent);