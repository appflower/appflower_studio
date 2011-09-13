Ext.namespace('afStudio.notification');

/**
 * Notification windows positions & heights manager.
 * @type {Object} 
 */
afStudio.notification.NotificationMgr = {
    positions: [],
    heights: []
};

/**
 * NotificationWindow
 * 
 * @class afStudio.notification.NotificationWindow
 * @extends Ext.Window
 */
afStudio.notification.NotificationWindow = Ext.extend(Ext.Window, {
	
	/**
	 * Template method.
	 * @override
	 * @private
	 */
	initComponent : function() {
		Ext.apply(this, 
			Ext.apply(this.initialConfig, {
				closeAction: 'close',
				plain: false,
				shadow: false,
				draggable: false,
				bodyStyle: 'text-align: left; padding: 10px;',
				resizable: false
			})
		);		
		
		if (this.autoDestroy) {
			this.task = new Ext.util.DelayedTask(this.close, this);
		} else {
			this.closable = true;
		}
		
		afStudio.notification.NotificationWindow.superclass.initComponent.call(this);
    },
    
	setMessage : function(msg) {
		this.body.update(msg);
	},
	
	/**
	 * @override
	 * @private
	 */
	afterShow : function() {
		afStudio.notification.NotificationWindow.superclass.afterShow.call(this);
		
		this.on('move', function() {
			afStudio.notification.NotificationMgr.positions.remove(this.pos);
			if (this.autoDestroy) {
				this.task.cancel();
			}
		}, this);
		
		if (this.autoDestroy) {
			this.task.delay(this.hideDelay || 5000);
		}
	},
	
	/**
	 * @override
	 * @private
	 */
	animShow : function() {
		var notificationMgr = afStudio.notification.NotificationMgr,
			h = 0;
			
		this.pos = 0;
		
		while (notificationMgr.positions.indexOf(this.pos) > -1) {
			h += notificationMgr.heights[this.pos];
			this.pos++;
		}		
		notificationMgr.positions.push(this.pos);		
		notificationMgr.heights[this.pos] = this.getSize().height + 10;
		
		this.el.alignTo(this.animateTarget || document, "br-br", [-5, -5 - (h)]);
		
		this.el.slideIn('b', {
			duration: .7,
			callback: this.afterShow,
			scope: this
		});
	},
	//eo animShow 
	
	/**
	 * @override
	 * @private
	 */
	animHide : function() {
		afStudio.notification.NotificationMgr.positions.remove(this.pos);
		
		if (this.el) {
			this.el.ghost("b", {
				duration: 1,
				remove: false
			});
		}
	} 
	
	/**
	 * @override
	 * @private
	 */
	,onDestroy : function() {
		afStudio.notification.NotificationMgr.positions.remove(this.pos);
		afStudio.notification.NotificationWindow.superclass.onDestroy.call(this);
	}
});

/**
 * MessageBox
 * 
 * @sigleton
 * @author Nikolai Babinski
 */
afStudio.notification.MessageBox = function() {
	
	/**
	 * Creates and shows notification window.
	 * @private
	 * @param {Object} config The notification window {@link afStudio.notification.NotificationWindow} configuration object
	 * @return {afStudio.notification.NotificationWindow} notification window
	 */
	var showNotification = function(config) {
		
		config = Ext.apply({
	    	width: 340,
	    	animateTarget: Ext.getBody(),
	    	autoScroll: true,
			autoDestroy: false,
			notificationType: 'INFO'
	    }, config || {})
		
	    var win = new afStudio.notification.NotificationWindow(config);
	    
	    switch (win.notificationType) {
	    	case 'ERROR':
		    	win.iconCls = 'icon-notification-error';
		    	win.bodyStyle += 'background-color: #fddcdc;';
			break;
	    	case 'WARNING':
		    	win.iconCls = 'icon-notification-warning';
		    	win.bodyStyle += 'background-color: #fefcc7;';
			break;
	    	case 'INFO':
		    	win.iconCls = 'icon-notification-info';
		    	win.bodyStyle += 'background-color: #fff;';	    	
			break;
	    }
	    
	    win.bodyStyle += 'padding-bottom: 20px;';	    
	    win.show();
	    
	    return win;
	};	
	
	return {
		
		/**
		 * The amount of time notification window is shown (defaults to 10 seconds). 
		 * When time is over such window types: INFO, WARNING are closed.
		 * @property DURATION
		 * @type Number
		 */
		DURATION : 10000, 
		
		/**
		 * INFO window type
		 * @constant INFO
		 */
		INFO : 'INFO',
		
		/**
		 * WARNING window type
		 * @constant WARNING
		 */		
		WARNING : 'WARNING',
		
		/**
		 * ERROR window type
		 * @constant ERROR
		 */		
		ERROR : 'ERROR',
		
		notify : function(type, title, message, config) {
			config = config || {};
			
			var msgWin = showNotification(Ext.apply(config, {
				notificationType: type,
				title: title,
				html: message
			}));
			
			if (type != this.ERROR) {
				msgWin.close.defer(this.DURATION, msgWin);
			}
		},
		
		info : function() {
			var t, m;
			if (arguments.length == 1) {
				t = 'Notification';
				m = arguments[0];
			} else {
				t = arguments[0];
				m = arguments[1]
			}
			this.notify(this.INFO, t, m);
		},
		
		warning : function() {
			var t, m;
			if (arguments.length == 1) {
				t = 'Warning';
				m = arguments[0];
			} else {
				t = arguments[0];
				m = arguments[1]
			}
			this.notify(this.WARNING, t, m);			
		},
		
		error : function() {
			var t, m;
			if (arguments.length == 1) {
				t = 'Error';
				m = arguments[0];
			} else {
				t = arguments[0];
				m = arguments[1]
			}
			this.notify(this.ERROR, t, m);			
		}		
	};
	
}();

/**
 * Shorthand for {@link afStudio.notification.MessageBox}
 */
afStudio.Msg = afStudio.notification.MessageBox;