Ext.ns('afStudio.models');

/**
 * Responsible for editor creation
 * 
 * @class afStudio.models.TypeBuilder
 * @singleton
 * @author Nikolay
 */
afStudio.models.TypeBuilder = (function() {
	
	return {
		
		invalidFieldName : 'Field name must contains only characters, digits or "_" and starts from "_" or character'
		
		/**
		 * Creates editor depends on data type
		 * @param {String} dataType The data type
		 * @return {Ext.Editor}
		 */
		,createEditor : function(dataType, size, defaultValue) {
			var editor = null;
			
			//if data type contains size - cut it (i.e. varchar(128) - varchar)
			if (dataType) {
				var s = dataType.indexOf("(");
				if (s != -1) {
					dataType = dataType.substring(0, s);
				}
			}
			
			switch(dataType) {
				case 'boolean':
					editor = new Ext.grid.GridEditor(
						new Ext.form.ComboBox({
							typeAhead: true,
							triggerAction: 'all',
							lazyRender: true,
							editable: false,
							mode: 'local',
							valueField: 'field',
							displayField: 'field',
							store : [[true, 'true'], [false, 'false']]
			    		})
		    		);
				break;
				
				case 'char': case 'varchar': case 'longvarchar': case 'timestamp':				
					editor =  new Ext.grid.GridEditor(
						new Ext.form.TextField({
							maxLength: size ? size : Number.MAX_VALUE
						})
					);
				break;
				
				case 'bigint': case 'numeric': case 'decimal': case 'integer': case 'smallint':			
					editor =  new Ext.grid.GridEditor(
						new Ext.form.NumberField({
							allowDecimals: false,
							maxLength: size ? size : Number.MAX_VALUE
						})
					);
				break;
				
				case 'tinyint':
					editor =  new Ext.grid.GridEditor(
						new Ext.form.NumberField({
							autoCreate: {tag: 'input', type: 'text', size: '20', autocomplete: 'off', maxlength: 3},
							maxValue: 255,
							allowDecimals: false,
							maxLength: size ? size : 3
						})
					);
				break;
				
				case 'real': case 'float': case 'double':
					editor =  new Ext.grid.GridEditor(
						new Ext.form.NumberField({
							maxLength: size ? size : Number.MAX_VALUE
						})
					);
				break;
					
				case 'date':
					editor =  new Ext.grid.GridEditor(
						new Ext.form.DateField()
					);
				break;
				
				case 'time':
					editor =  new Ext.grid.GridEditor(
						new Ext.form.TimeField()
					);
				break;
				
				case 'binary': case 'varbinary': case 'longvarbinary': case 'blob': case 'clob':
					editor =  new Ext.grid.GridEditor(
						new Ext.form.DisplayField()
					);
				break;
			}
			
			if (editor) {
				//apply default value
				editor.on('beforecomplete', function(editor, v, sv) {
					if (dataType == 'boolean') {
						defaultValue = defaultValue ? true : false;						
					}
					v = v ? v : defaultValue;
					editor.setValue(v);
				});				
			}
			
			return editor ? editor : null;	
		}//eo createEditor
		
	}
})();