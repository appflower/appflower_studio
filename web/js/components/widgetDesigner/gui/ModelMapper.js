Ext.ns('afStudio.wd');

/**
 * ModelMapper mixin provides base mapping <u>component <---> model</u> functionality for any view. 
 * Every view component should have <u>modelMapper</u> object property to be able to use model mapper mixin.
 * 
 * @dependency {afStudio.view.ModelMapper}
 *  
 * @singleton
 * @author Nikolai Babinski
 */
afStudio.wd.ModelMapper = (function() {
	
	return {
        //empty for now
	};
})();

/**
 * Extends base mixin {@link afStudio.view.ModelMapper}
 */
Ext.applyIf(afStudio.wd.ModelMapper, afStudio.view.ModelMapper);