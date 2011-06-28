Ext.ns('afStudio.model.template');

N = afStudio.model.template;

N.WidgetTemplate = Ext.extend(N.BaseTemplate, {
	
	constructor : function() {
		this.structure = this.structure.concat([		
			afStudio.ModelNode.CONFIRM,
			afStudio.ModelNode.ACTIONS
		]);
		
		afStudio.model.template.BaseTemplate.superclass.constructor.call(this);		
	}	
});

N.WidgetViewTemplate = Ext.extend(N.WidgetTemplate, {
	
	constructor : function() {
		this.structure = this.structure.concat([
			afStudio.ModelNode.SCRIPTS,
			afStudio.ModelNode.DATA_SOURCE,
			afStudio.ModelNode.FIELDS,
			afStudio.ModelNode.DESCRIPTION,
			afStudio.ModelNode.ALTERNATE_DESCRIPTIONS,
			afStudio.ModelNode.GROUPING
		]);
		
		afStudio.model.template.WidgetTemplate.superclass.constructor.call(this);
	}	
});

N.ListTemplate = Ext.extend(N.BaseTemplate, {

	constructor : function() {
		afStudio.model.template.BaseTemplate.superclass.constructor.call(this);
		
		this.structure = this.structure.concat([		
			afStudio.ModelNode.FIELDS,
			afStudio.ModelNode.ACTIONS
		]);
	}	
});

delete N;