/**
 * The data type of placeholders. Example: {foo}.
 * Placeholders' value space defined by alphanumeric symbols, underscore "_" and hyphen "-". 
 */				
afStudio.data.type.VarType = Ext.extend(afStudio.data.type.String, {
	type : "varType",
	
	restrictions : {
		pattern: /^\{[\w-]+\}$/
	}
});

afStudio.data.type.PermissionType = Ext.extend(afStudio.data.type.String, {
	type : "permissionType",
	
	restrictions : {
		pattern: /^(\w+|\*)(\s*,\s*\w+)*$/
	}
});

afStudio.data.type.PositiveInteger = Ext.extend(afStudio.data.type.Integer, {
	type : "positiveInteger",
	
	invalidMessage : 'The value must be >= 0',
	
	restrictions : {
		minInclusive: 0
	},
	
	editor : function(cfg) {
		cfg = Ext.apply(cfg || {}, {
			allowNegative: false
		});
		
		return afStudio.data.type.PositiveInteger.superclass.editor.call(this, cfg);		
	}
});

afStudio.data.type.InternalUriType = Ext.extend(afStudio.data.type.String, {
	type : "internalUriType",
	
	invalidMessage : 'The value is not a valid internal URI',
	
	restrictions : {
		// (/[\w\-.]+)*/? - path
		// (\?[\w\-.~%!$&'()*+,;=:@/?]*)? - query
		// (\#[\w\-.~%!$&'()*+,;=:@/?]*)? - fragment
		// ^(/[\w\-.]+)*/?(\?[\w\-.~%!$&'()*+,;=:@/?]*)?(\#[\w\-.~%!$&'()*+,;=:@/?]*)?$
		pattern: new RegExp("^(/[\\w\\-.]+)*/?(\\?[\\w\\-.~%!$&'()*+,;=:@/?]*)?(\\#[\\w\\-.~%!$&'()*+,;=:@/?]*)?$")
	}
});

/**
 * Data type of absolute paths pointing to files, used for image srcs. Nix* kind of syntax is expected.
 * @class afStudio.data.type.AbsoluteUriType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.AbsoluteUriType = Ext.extend(afStudio.data.type.String, {
	type : "absoluteUriType",
	
	restrictions : {
		pattern: /^\/?[\w/-]+\.[a-z]{1,4}$/
	}
});

/**
 * Represents any URL.
 */
afStudio.data.type.AnyURI = Ext.extend(afStudio.data.type.String, {
	type : "anyURI",
	
	restrictions : {
		pattern: RegExp("^((https?|ftp|file):/)?(/[\\w\\-.]+)*/?(\\?[\\w\\-.~%!$&'()*+,;=:@/?]*)?(\\#[\\w\\-.~%!$&'()*+,;=:@/?]*)?$")
	}
});

/**
 * This is the data type for urls. Its value can be an internal symfony URI or any URL.
 * Type union ['internalUriType', 'varType', 'anyURI']. 
 * @class afStudio.data.type.CombinedUriType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.CombinedUriType = Ext.extend(afStudio.data.type.String, {
	type : "combinedUriType",
	
	union : ['internalUriType', 'varType', 'anyURI']
});

/**
 * This data type determines the type of the view.
 * @class afStudio.data.type.ViewType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.ViewType = Ext.extend(afStudio.data.type.String, {
	type : "viewType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration : ['edit', 'list', 'show', 'layout', 'html', 'wizard', 'menu']
	}
});

/**
 * The type of the source of a form field value.
 * @class afStudio.data.type.ValueType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.ValueType = Ext.extend(afStudio.data.type.String, {
	type : "valueType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration : ['orm', 'file', 'static']
	}
});

afStudio.data.type.ValueStructureType = Ext.extend(afStudio.data.type.String, {
	type : "valueStructureType",
	
	union : ['varType'],
	
	//TODO 'static' enum is not used, should be tested AF engine and how this type is used
	restrictions : {
		enumeration : ['class & method', 'source', 'item']
	}
});

afStudio.data.type.FetchType = Ext.extend(afStudio.data.type.String, {
	type : "fetchType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration : ['static', 'instance']
	}
});

afStudio.data.type.AlignType = Ext.extend(afStudio.data.type.String, {
	type : "alignType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration : ['left', 'center', 'right']
	}
});

afStudio.data.type.SortType = Ext.extend(afStudio.data.type.String, {
	type : "sortType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration : ['ASC', 'DESC']
	}
});

afStudio.data.type.HandlerType = Ext.extend(afStudio.data.type.String, {
	type : "handlerType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration : [
			'beforedestroy', 'beforehide', 'beforerender', 'beforeshow', 'beforestaterestore',	'beforestatesave',
			'blur', 'change', 'check', 'destroy', 'disable', 'enable', 'focus', 'hide', 'invalid', 'move', 'render',
			'resize', 'show', 'specialkey',	'staterestore', 'statesave', 'valid', 'click', 'beforeselect', 'collapse',
			'expand', 'keydown', 'keyup', 'keypress', 'select', 'autosize', 'beforequery', 'activate', 'initialize',
			'beforepush', 'beforesync',	'push', 'mouseover', 'mouseout', 'mousedown', 'sync'
		]
	}
});

/**
 * The data type for database column names. It is used by the column's "name" attribute. 				
 * @class afStudio.data.type.DbNameType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.DbNameType = Ext.extend(afStudio.data.type.String, {
	type : "dbNameType",
	
	restrictions : {
		pattern: /^\w+$/
	}
});

afStudio.data.type.ArrayType = Ext.extend(afStudio.data.type.String, {
	type : "arrayType",
	
	restrictions : {
		pattern: /^\[\w+\s*:\s*["'\.\w]+?(\s*,\s*\w+\s*:\s*["'\.\w]+?)*\]$/
	}
});

/**
 * This is the data type of the state of form fields.
 * There are three valid states:
 * <ul>
 * 	<li><b>editable</b>: Normal state, field can be edited and will posted. This is the default</li>
 * 	<li><b>readonly</b>: Field cannot be edited but will still be posted</li>
 * 	<li><b>disabled</b>: Field may not be edited and wont be posted</li>
 * </ul>				
 * @class afStudio.data.type.StateType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.StateType = Ext.extend(afStudio.data.type.String, {
	type : "stateType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration: ['editable', 'readonly', 'disabled']
	}
});

/**
 * This is the data type for buttons. It determines what kind of button will be created.
 * <ul>
 * 	<li><b>normal</b>: A simple button, it will trigger some action or may execute JS.</li>
 * 	<li><b>submit</b>: A submit button, will POST list or edit view.</li>
 * 	<li><b>reset</b>: A reset button</li>
 * </ul>				
 * @class afStudio.data.type.ButtonType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.ButtonType = Ext.extend(afStudio.data.type.String, {
	type : "buttonType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration: ['button', 'reset', 'submit']
	}
});


/**
 * This is the data type of form fields. 
 * It determines what kind of field will be rendered.
 * @class afStudio.data.type.InputType
 * @extends afStudio.data.type.String
 */
afStudio.data.type.InputType = Ext.extend(afStudio.data.type.String, {
	type : "inputType",
	
	union : ['varType'],
	
	restrictions : {
		enumeration: [
			'input', 'textarea', 'checkbox', 'radio', 'password', 'hidden', 
			'file', 'combo', 
			//'extendedCombo', 'extendedDayTimeSelect', 'itemSelectorAutoSuggest', 'remoteComboAutoSuggest' 
			'multicombo', 'doublemulticombo', 'static', 
			'doubletree', 'datetime', 'color', 'date', 'include' 
			//'superBoxSelect'
		]
	}
});

