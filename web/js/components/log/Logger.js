Ext.ns('afStudio.log');

/**
 * Simple logger.
 * 
 * @class afStudio.log.Logger
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.log.Logger = (function(){

	/**
	 * Logger property, default is console {@link afStudio.log.Console}
	 * @property {Object} logger
	 * @private
	 */
	var logger = afStudio.log.Console;
	
	return {
		
		DEBUG : 'debug',
		
		INFO : 'info',
		
		ERROR : 'error',
		
		OFF : 'off',
		
		/**
		 * The logger mode level. Can be one of the following: "debug", "info", "error", "off".
		 * Default is "debug".
		 * @property mode
		 * @cfg {String}
		 */
		mode : 'debug',
		
		/**
		 * Logs data using established logger.
		 * @param {String} level The log level
		 * @param {Array} data The array of data being logged
		 */
		log : function(level, data) {
			var logLevels = [this.DEBUG, this.INFO, this.ERROR],
				modes = logLevels.concat(this.OFF),
				modeLevel = modes.indexOf(this.mode),
				logLevel = logLevels.indexOf(level);
			
			if (logLevel >= modeLevel && !Ext.isEmpty(data)) {
				logger[level].apply(this, data);
			}
		},
		
		/**
		 * Logging using {@link #DEBUG} level.
		 */
		debug : function() {
			this.log('debug', arguments);
		},
		
		/**
		 * Logging using {@link #INFO} level.
		 */
		info : function() {
			this.log('info', arguments);
		},
		
		/**
		 * Logging using {@link #ERROR} level.
		 */
		error : function() {
			this.log('error', arguments);
		},
		
		/**
		 * Returns logger instance.
		 * @return {Object} logger
		 */
		getLogger : function() {
			return logger;
		},
		
		/**
		 * Sets logger.
		 * @param {Object} loggerObj The logger being set
		 */
		setLogger : function(loggerObj) {
			logger = loggerObj;
		}
	}
	
})();

//shortcut to logger
afStudio.Logger = afStudio.log.Logger;