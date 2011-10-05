Ext.ns('afStudio.log');

/**
 * Simple browser's console wrapper.
 * 
 * @class afStudio.log.Console
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.log.Console = (function(){
	
	return {
		
		debug : function() {
			console.debug.apply(console, arguments);	
		},
		
		info : function() {
			console.log.apply(console, arguments);
		},
		
		error : function() {
			console.error.apply(console, arguments);
		}
	}
	
})();