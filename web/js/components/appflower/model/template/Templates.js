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
		
		this.extendStructure([
			afStudio.ModelNode.CONFIRM,
			afStudio.ModelNode.ACTIONS
		]);
	}
});

/**
 * Base structural template for List, Edit, Show view types.
 * @class N.WidgetViewTemplate
 * @extends N.WidgetTemplate
 */
N.WidgetViewTemplate = Ext.extend(N.WidgetTemplate, {
	
	constructor : function() {		
		afStudio.model.template.WidgetViewTemplate.superclass.constructor.call(this);
		
		this.extendStructure([
			{name: afStudio.ModelNode.DATA_SOURCE},
			{name: afStudio.ModelNode.FIELDS, required: true},
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

		//list view hasn't i:grouping node
		this.removeNode(afStudio.ModelNode.GROUPING);
	
		//i:title is not required
		this.setNode(afStudio.ModelNode.TITLE, {required: false});
		
		this.extendStructure([
			afStudio.ModelNode.PARAMS,
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
		
		this.extendStructure([
			afStudio.ModelNode.DATA_STORE,
			{name: afStudio.ModelNode.AREA, required: true},
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

		this.extendStructure([
			{name: afStudio.ModelNode.PARAMS, required: true},
			afStudio.ModelNode.OPTIONS,
			afStudio.ModelNode.MORE_ACTIONS
		]);			
	}
});

delete N;