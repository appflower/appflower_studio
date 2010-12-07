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
	 * store's url 
	 */	

	/**
	 * @cfg {afStudio.models.FieldsGrid} (optional) fieldsGrid  
	 * The reference to hosting {@link Ext.grid.EditorGridPanel}.
	 * If this config property isn't specified relationcombo is working 
	 * as a common combobox. 
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
		
		_this.relationPicker = new afStudio.models.RelationPicker({
			modelsUrl: '/appFlowerStudio/models',
			fieldsUrl: '/appFlowerStudio/models',
			closable: true,
			closeAction: 'hide',
			listeners: {
				relationpicked : function(relation) {					
					if (_this.fieldsGrid) {						
						var cell = _this.fieldsGrid.getSelectionModel().getSelectedCell();
						_this.fieldsGrid.startEditing(cell[0], cell[1]);
						if (relation) {
							_this.setValue(relation);
						}
						_this.fieldsGrid.stopEditing();
					} else {
						_this.setValue(relation);
					}
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
		if (this.fieldsGrid) {
			this.fieldsGrid.stopEditing();
		}
		var _this = this;
		this.relationPicker.show(null, function() {
			this.initialRelationPick(_this.getRawValue() || _this.getValue());
		});
    }
	
});

Ext.reg('relationcombo', N.RelationCombo);

delete N;