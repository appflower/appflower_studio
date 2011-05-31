Ext.namespace('afStudio.notification');

afStudio.notification.NotificationMgr = {
    positions: [],
    heights: []
};

afStudio.notification.NotificationWindow = Ext.extend(Ext.Window, {
	
	// private
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
    }//eo initComponent
    
	,setMessage : function(msg) {
		this.body.update(msg);
	}
	
	// private
	,afterShow : function() {
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
	}//eo afterShow
	
	// private
	,animShow : function() {
		this.pos = 0;
		var h = 0;
		
		while (afStudio.notification.NotificationMgr.positions.indexOf(this.pos) > -1) {
			h += afStudio.notification.NotificationMgr.heights[this.pos];
			this.pos++;
		}		
		afStudio.notification.NotificationMgr.positions.push(this.pos);		
		afStudio.notification.NotificationMgr.heights[this.pos] = this.getSize().height + 10;
		
		this.el.alignTo(this.animateTarget || document, "br-br", [-5, -5 - (h)]);
		
		this.el.slideIn('b', {
			duration: .7,
			callback: this.afterShow,
			scope: this
		});
	}//eo animShow 
	
	// private
	,animHide : function() {
		afStudio.notification.NotificationMgr.positions.remove(this.pos);
		
		if (this.el) {
			this.el.ghost("b", {
				duration: 1,
				remove: false
			});
		}
	}//eo animHide 
	
	// private
	,onDestroy : function() {
		afStudio.notification.NotificationMgr.positions.remove(this.pos);
		afStudio.notification.NotificationWindow.superclass.onDestroy.call(this);
	}//eo onDestroy 
});

afStudio.notification.MessageBox = function() {
	
	var showNotification = function(config) {
	    var win = new afStudio.notification.NotificationWindow(Ext.apply({
	    	width: 300,
	    	animateTarget: Ext.getBody(),
	    	autoScroll: true,
			autoDestroy: false,
			notificationType: 'INFO'
	    }, config));
	    
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
	    
	    win.bodyStyle += 'padding-bottom:20px;';	    
	    win.show();
	    
	    return win;
	};	
	
	return {
		/**
		 * 
		 * @type Number
		 */
		DURATION : 10000 
		
		,INFO : 'INFO'
		
		,WARNING : 'WARNING'
		
		,ERROR : 'ERROR'
		
		,notify : function(type, title, message, config) {
			config = config || {};
			
			var msgWin = showNotification(Ext.apply(config, {
				notificationType: type,
				title: title,
				html: message
			}));
			
			if (type != this.ERROR) {
				msgWin.close.defer(this.DURATION, msgWin);
			}
		}//eo message
		
		,info : function() {
			var t, m;
			if (arguments.length == 1) {
				t = 'Notification';
				m = arguments[0];
			} else {
				t = arguments[0];
				m = arguments[1]
			}
			this.notify(this.INFO, t, m);
		}//eo notify
		
		,warning : function() {
			var t, m;
			if (arguments.length == 1) {
				t = 'Warning';
				m = arguments[0];
			} else {
				t = arguments[0];
				m = arguments[1]
			}
			this.notify(this.WARNING, t, m);			
		}//eo warning
		
		,error : function() {
			var t, m;
			if (arguments.length == 1) {
				t = 'Error';
				m = arguments[0];
			} else {
				t = arguments[0];
				m = arguments[1]
			}
			this.notify(this.ERROR, t, m);			
		}//eo warning		
	};
	
}();

/**
 * Shorthand for {@link afStudio.notification.MessageBox}
 */
afStudio.Msg = afStudio.notification.MessageBox;