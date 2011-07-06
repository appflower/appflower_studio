Ext.ns('afStudio.model.template');

N = afStudio.model.template;

/**
 * Base structural template for widget views.
 * @class N.WidgetTemplate
 * @extends N.BaseTemplate
 */
N.WidgetTemplate = Ext.extend(N.BaseTemplate, {
	
	constructor : function() {
		afStudio.model.template.WidgetTemplate.superclass.constructor.call(this);
		
		this.structure = this.structure.concat([
			afStudio.ModelNode.CONFIRM,
			afStudio.ModelNode.ACTIONS
		]);
	}
});

/**
 * Base structural template for List, Edit, Show widget views.
 * @class N.WidgetViewTemplate
 * @extends N.WidgetTemplate
 */
N.WidgetViewTemplate = Ext.extend(N.WidgetTemplate, {
	
	constructor : function() {		
		afStudio.model.template.WidgetViewTemplate.superclass.constructor.call(this);
		
		this.structure = this.structure.concat([
			afStudio.ModelNode.SCRIPTS,
			afStudio.ModelNode.DATA_SOURCE,
			afStudio.ModelNode.FIELDS,
			afStudio.ModelNode.DESCRIPTION,
			afStudio.ModelNode.ALTERNATE_DESCRIPTIONS,
			afStudio.ModelNode.GROUPING
		]);
	}	
});

N.EditTemplate = Ext.extend(N.WidgetViewTemplate, {});

N.ShowTemplate = Ext.extend(N.WidgetViewTemplate, {});

/**
 * List widget view structural template.
 * @class N.ListTemplate
 * @extends N.WidgetViewTemplate
 */
N.ListTemplate = Ext.extend(N.WidgetViewTemplate, {
	
	constructor : function() {		
		afStudio.model.template.ListTemplate.superclass.constructor.call(this);
		
		//remove i:grouping node, List View has no it.
		var gidx = this.structure.indexOf(afStudio.ModelNode.GROUPING);
		this.structure.splice(gidx, 1);
		
		this.structure = this.structure.concat([
			afStudio.ModelNode.PARAMS,
			afStudio.ModelNode.PROXY,
			afStudio.ModelNode.ROW_ACTIONS,
			afStudio.ModelNode.MORE_ACTIONS
		]);
	}	
});

/**
 * Wizard widget view structural template.
 * @class N.WizardTemplate
 * @extends N.WidgetTemplate
 */
N.WizardTemplate = Ext.extend(N.WidgetTemplate, {
	
	constructor : function() {		
		afStudio.model.template.WizardTemplate.superclass.constructor.call(this);
		
		this.structure = this.structure.concat([
			afStudio.ModelNode.DATA_STORE,
			afStudio.ModelNode.AREA,
			afStudio.ModelNode.WIDGET_CATEGORIES,
			afStudio.ModelNode.EXTRA_HELP
		]);
	}
});

/**
 * Html widget view structural template.
 * @class N.HtmlTemplate
 * @extends N.WidgetTemplate
 */
N.HtmlTemplate = Ext.extend(N.WidgetTemplate, {
	
	constructor : function() {		
		afStudio.model.template.HtmlTemplate.superclass.constructor.call(this);
		
		this.structure = this.structure.concat([
			afStudio.ModelNode.PARAMS,
			afStudio.ModelNode.OPTIONS,
			afStudio.ModelNode.MORE_ACTIONS
		]);
	}
});

delete N;