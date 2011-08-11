Ext.ns('afStudio.data');

//shorthand to types namespace
T = afStudio.data.type;

/**
 * afStudio.data.Types object, lists all available data types.
 * 
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.data.Types = (function() {
	
	return {
		
		/**
		 * Returns type by its name.
		 * @param {String} name The type name.
		 * @return {Object} type
		 */
		getType : function(name) {
			return this[name.toUpperCase()];
		},		
		
		AUTO : new T.Auto,
		
		STRING : new T.String,
		
		INTEGER : new T.Integer,
		
		FLOAT : new T.Float,
		
		BOOLEAN : new T.Boolean,
		
		DATE : new T.Date,
		
		VARTYPE : new T.VarType,
		
		POSITIVEINTEGER : new T.PositiveInteger,
								
		PERMISSIONTYPE : new T.PermissionType,
		
		ANYURI : new T.AnyURI,
		
		INTERNALURITYPE : new T.InternalUriType,
		
		ABSOLUTEURITYPE : new T.AbsoluteUriType,
		
		COMBINEDURITYPE : new T.CombinedUriType,
		
		VIEWTYPE : new T.ViewType,
		
		VALUETYPE : new T.ValueType,
		
		FETCHTYPE : new T.FetchType,
		
		ALIGNTYPE : new T.AlignType,
		
		SORTTYPE : new T.SortType,
		
		HANDLERTYPE : new T.HandlerType,
		
		DBNAMETYPE : new T.DbNameType,
		
		ARRAYTYPE : new T.ArrayType
	}
})();

//aliases
afStudio.data.Types.INT = afStudio.data.Types.INTEGER;
afStudio.data.Types.DOUBLE = afStudio.data.Types.FLOAT;

//TODO should be properly derived from String type
afStudio.data.Types.TOKEN = afStudio.data.Types.STRING;
afStudio.data.Types.QNAME = afStudio.data.Types.STRING;

delete T;