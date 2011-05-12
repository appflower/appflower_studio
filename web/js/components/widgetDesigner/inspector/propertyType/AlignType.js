/**
 * <i:column> <b>align</b> attribute representation
 * @class afStudio.wi.AlignType
 * @extends afStudio.wi.PropertyTypeChoice
 */
afStudio.wi.AlignType = Ext.extend(afStudio.wi.PropertyTypeChoice, {
  
	id : 'align' 
	
	,label : 'Align'
	
	,defaultValue : 'left'
    
    ,constructor : function() {
        afStudio.wi.AlignType.superclass.constructor.call(this, arguments);
        
        this.setChoices({
           'left':    'left',
           'center':  'center',
           'right':   'right'
        });
    }//eo constructor
});