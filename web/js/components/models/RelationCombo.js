Ext.ns('afStudio.models');

N = afStudio.models;

/**
 * RelationCombo
 * @class afStudio.models.RelationCombo
 * @extends Ext.form.ComboBox
 * @author Nick
 */
N.RelationCombo = Ext.extend(Ext.form.ComboBox, {
	/**
	 * @cfg {String} relationUrl required
	 * store Url 
	 */	
	
	/**
	 * Initializes component
	 * @return {Object} The configuration object
	 */
	_beforeInitComponent : function() {
		var _this = this;
		
		var cbStore = new Ext.data.JsonStore({
			url: _this.relationUrl,
			baseParams: {
				xaction: 'readrelation'
			},
			root: 'data',
			fields: ['id', 'value']
		});
		
		return {
			maskRe: /[\w\.]/,
			triggerClass: 'x-form-relation-trigger',
			typeAhead: true,
			lazyRender: true,
			queryParam: 'query',
			mode: 'remote',
			minChars: 1,
			editable: true,
			forceSelection : true,
			store: cbStore,
			valueField: 'id',
			displayField: 'value',
			hiddenName: 'relation',
			name: 'relation'
		}
		
	}//eo _beforeInitComponent
	
	//private
	,initComponent : function() {
		Ext.apply(this, Ext.applyIf(this.initialConfig, this._beforeInitComponent()));
		afStudio.models.RelationCombo.superclass.initComponent.apply(this, arguments);
	}
	
	/**
	 * overridden
	 * @private
	 */
	,initEvents : function() {
		afStudio.models.RelationCombo.superclass.initEvents.apply(this, arguments);
		
		this.keyNav.down = function(e){
            if(!this.isExpanded()){
                //this.onTriggerClick();
            }else{
                this.inKeyMode = true;
                this.selectNext();
            }
            return false;
        };
        
        //handles enter press
        this.keyNav.enter = function(e) {        	
        	 var rawValue =	this.getRawValue(),
  			        index = this.view.getSelectedIndexes()[0],
            		    s = this.store,
            		    r = s.getAt(index);
            //model wasn't selected		    
			if (rawValue.indexOf('.') == -1) {		
	        	if (r) {
	            	this.setRawValue(r.get(this.initialConfig.displayField) + '.');
	            	this.doQuery(r.get(this.initialConfig.displayField) + '.');	
	        	}
			} else {	
				this.onViewClick();
			}
        }
	}
	
	//private
	,createRelationPicker : function() {
		var _this = this;
		this.relationPicker = new afStudio.models.RelationPicker({
			closable: true,
			closeAction: 'hide',
			listeners: {
				relationpicked : function(relation) {
					var cell = _this.fieldsGrid.getSelectionModel().getSelectedCell();
//					var c = _this.fieldsGrid.getView().getCell(cell[0], cell[1]);
//					console.log(c);
//					Ext.get(c).update('go');
//					_this.fieldsGrid.getView().getCell(cell[0], cell[1]).firstChild.innerHTML = relation;					
					_this.fieldsGrid.startEditing(cell[0], cell[1]);
					if (relation) {_this.setValue(relation);}
					_this.fieldsGrid.stopEditing();					
				}
			}
  		});
	}
	
	/**
     * @method onTriggerClick
     * @hide
     */
    // private
    ,onTriggerClick : function(e) {
        if (this.readOnly || this.disabled) {
            return;
        }
        if (this.isExpanded()) {
            this.collapse();
            this.el.focus();
        }
        //use relationPicker
		if (!this.relationPicker) {
			this.createRelationPicker();
		}		
		this.fieldsGrid.stopEditing();
		this.relationPicker.show();
    }
	
});

Ext.reg('relationcombo', N.RelationCombo);

delete N;