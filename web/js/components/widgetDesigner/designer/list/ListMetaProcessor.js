Ext.ns('afStudio.wd.list');

afStudio.wd.list.ListMetaProcessor = (function() {
	
	return {
	
		/**
		 * Processes meta data changes.
		 * 
		 * @param {Object} e The meta-change event object:
		 * <ul>
		 * <li><b>node</b>: WI node, the holder of meta data</li>
		 * <li><b>name</b>: The name of updating property</li>
		 * <li><b>value</b>: The new property value</li>
		 * <li><b>oldValue</b>: The old property value</li>
		 * </ul>
		 */
		processMeta : function(e) {
			var mf = e.node.attributes.metaField;		
//			console.log('meta \t', e.node, e.name, e.value, e.oldValue);
			
			if (Ext.isDefined(mf)) {
				var t = mf;
				if (t.indexOf('i:') != -1) {
				    t =  'I' + t.replace(/^i:(\w+)/i, "$1").ucfirst();
				} else {
				    t = t.ucfirst();
				}			
				t = String.format('process{0}Tag', t);
				
				this[t](e);
			}
		}//eo processMeta
		
		/**
		 * Handles <u>i:fields</u> tag changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processIFieldsTag : function(t) {
			var bbar = this.getBottomToolbar();
			switch (t.name) {
				case 'pager':
					if (t.value === false) {
						bbar.hide();	
					} else {
						bbar.show();
					}
					this.doLayout();
				break;					
			}					
		}//eo processIFieldsTag
		
		/**
		 * Handles <u>i:column</u> tag changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processIColumnTag : function(t) {
			var cm = this.getColumnModel();
			
			switch (t.name) {
				case 'label':
					var nodeName = t.node.getProperty('name').data.value,
						clms     = cm.getColumnsBy(function(c) {						
										return c.name == nodeName;
								   });
					if (clms[0]) {	
						cm.setColumnHeader(cm.getIndexById(clms[0].id), t.value);
					}
				break;
				
				case 'name':
					var clms = cm.getColumnsBy(function(c) {						
						return c.name == t.oldValue;
					});
					if (clms[0]) {
						clms[0].name = t.value;
					}
				break;
			}		
		}//eo processIColumnTag
		
		/**
		 * Handles <u>root</u> node changes.
		 * @param {Object} t The meta-change event object. For more infomation look at {@link #processMeta}
		 */
		,processRootTag : function(t) {		
			switch (t.name) {
				case 'i:title':
					this.setTitle(t.value);
				break;
				
				case 'i:description':
					var descCmp = this.getTopToolbar().getComponent('desc');
					descCmp.get(0).setText(t.value);
					if (Ext.util.Format.trim(t.value)) {
						descCmp.show();	
					} else {
						descCmp.hide();
					}
					this.doLayout();
				break;
			}
		}//eo processRootTag			
		
	};
	
})();


