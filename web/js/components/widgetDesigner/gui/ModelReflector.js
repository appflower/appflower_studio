Ext.ns('afStudio.wd');

/**
 * @mixin ModelReflector provides base model changes <u>reflection</u> functionality for a view. 
 * 
 * @dependency {afStudio.wd.ModelInterface} model interface mixin
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.ModelReflector = (function() {
	
	return {

		/**
		 * @constant {String} EXEC_ADD
		 */
		EXEC_ADD : 'add',

		/**
		 * @constant {String} EXEC_INSERT
		 */
		EXEC_INSERT : 'insert',
		
		/**
		 * @constant {String} EXEC_REMOVE
		 */
		EXEC_REMOVE : 'remove',

		/**
		 * @constant {String} EXEC_UPDATE
		 */
		EXEC_UPDATE : 'update',
		
		/**
		 * Returns executor token.
		 * @param {String} s
		 * @return {String} token 
		 */
		getExecutorToken : function(s) {
			return s.replace(/^i:(\w+)/i, '$1').ucfirst();
		},
		
		/**
		 * This method should be overridden in descendant mixin classes to provide special functionality.
		 * @abstract
		 * @return {String} line
		 */
		correctExecutorLine : function(line, type, node, property) {
			return line;
		},
		
		/**
		 * Returns executor method.
		 * @param {String} type The executor type
		 * @param {Node} node The model node
		 * @param {String} (Optional) property The node's property name
		 * @return {Function} executor or null if executor is not exist
		 */
		getExecutor : function(type, node, property) {
			var line = this.getExecutorToken(node.tag);
			
			line = this.correctExecutorLine(line, type, node, property);
			
			var exec = String.format('execute{0}{1}{2}', type.ucfirst(), line, property ? property.ucfirst() : '');
				
			afStudio.Logger.info('@executor', exec);
				
			return Ext.isFunction(this[exec]) ? this[exec].createDelegate(this) : null;
		}
		
	};
})();