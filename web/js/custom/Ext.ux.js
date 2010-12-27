
Ext.grid.CheckColumn = function(config){
    Ext.apply(this, config);
    if(!this.id){
        this.id = Ext.id();
    }
    this.renderer = this.renderer.createDelegate(this);
};

Ext.grid.CheckColumn.prototype ={
    init : function(grid){
        this.grid = grid;
        this.grid.on('render', function(){
            var view = this.grid.getView();
            view.mainBody.on('mousedown', this.onMouseDown, this);
        }, this);
    },

    onMouseDown : function(e, t){
        if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
            e.stopEvent();
            var index = this.grid.getView().findRowIndex(t);
            var record = this.grid.store.getAt(index);
            record.set(this.dataIndex, !record.data[this.dataIndex]);
        }
    },

    renderer : function(v, p, record){
        p.css += ' x-grid3-check-col-td'; 
        return '<div class="x-grid3-check-col'+(v?'-on':'')+' x-grid3-cc-'+this.id+'">&#160;</div>';
    }
};

Ext.ux.WidgetFieldDropZone = Ext.extend(Ext.dd.DropZone, {
    constructor: function(){},
    scroller:"div.greenborder",
//  Call the DropZone constructor using the View's scrolling element
//  only after the grid has been rendered.
    init: function(panel) {
        if (panel.rendered) {
            this.panel = panel;
            Ext.ux.WidgetFieldDropZone.superclass.constructor.call(this, this.panel.body);
        } else {
            panel.on('render', this.init, this);
        }
    },

 
    getTargetFromEvent: function(e) {
//      Ascertain whether the mousemove is within a grid cell
        var t = e.getTarget(this.scroller);
        if (t) {
                return {
                    node: t
                };
        }
    },

//  On Node enter, see if it is valid for us to drop the field on that type of column.
    onNodeEnter: function(target, dd, e, dragData) {
    	
    	//this.dropOK = true;
    	//Ext.fly(target.node).addClass('x-drop-target-active');return;
        delete this.dropOK;
        if (!target) {
            return;
        }

//      Check that a field is being dragged.
        var f = dragData.field;
        if (!f) {
            return;
        }
        
        var node = target;        
        this.dropOK = true;
        var el = Ext.fly(node);
        el.addClass('x-drop-target-active');
    },

//  Return the class name to add to the drag proxy. This provides a visual indication
//  of drop allowed or not allowed.
    onNodeOver: function(target, dd, e, dragData) {
        return this.dropOK ? this.dropAllowed : this.dropNotAllowed;
    },

//   nhighlight the target node.
    onNodeOut: function(target, dd, e, dragData) {
        Ext.fly(target.node).removeClass('x-drop-target-active');
    },

//  Process the drop event if we have previously ascertained that a drop is OK.
    onNodeDrop: function(target, dd, e, dragData) {
        if (this.dropOK) {
        	var f = dragData.field;
            if (!f) {
                return false;
            }
            
        	var field = Ext.getCmp(f.id);
        	var container = field.ownerCt;
        	var layoutContainer = container.ownerCt;
        	var node = target.node;
        	var body = Ext.fly(node);
        	var cmp = body.findParent('DIV[class*="x-box-item"]',5);
        	
        	layoutContainer.remove(container,false); 
        	var _panel = Ext.getCmp(cmp.id);
        	_panel.add(container);
        	_panel.doLayout();
        	
            return true;
        }
    }
});

//  A class which makes Fields within a Panel draggable.
//  the dragData delivered to a coooperating DropZone's methods contains
//  the dragged Field in the property "field".
Ext.ux.WidgetFieldDragZone = Ext.extend(Ext.dd.DragZone, {
    constructor: function(){},

//  Call the DRagZone's constructor. The Panel must have been rendered.
    init: function(panel) {
        if (panel.nodeType) {
        	Ext.ux.WidgetFieldDragZone.superclass.init.apply(this, arguments);
        } else {
            if (panel.rendered) {
            	Ext.ux.WidgetFieldDragZone.superclass.constructor.call(this, panel.getEl());
                var i = Ext.fly(panel.getEl()).select('input');
                i.unselectable();
            } else {
                panel.on('afterlayout', this.init, this, {single: true});
            }
        }
    },

    scroll: false,

//  On mousedown, we ascertain whether it is on one of our draggable Fields.
//  If so, we collect data about the draggable object, and return a drag data
//  object which contains our own data, plus a "ddel" property which is a DOM
//  node which provides a "view" of the dragged data.
    getDragData: function(e) {
        var t = e.getTarget('input');
        if (t) {
            e.stopEvent();

//          Ugly code to "detach" the drag gesture from the input field.
//          Without this, Opera never changes the mouseover target from the input field
//          even when dragging outside of the field - it just keeps selecting.
            if (Ext.isOpera) {
                Ext.fly(t).on('mousemove', function(e1){
                    t.style.visibility = 'hidden';
                    (function(){
                        t.style.visibility = '';
                    }).defer(1);
                }, null, {single:true});
            }

//          Get the data we are dragging: the Field
//          create a ddel for the drag proxy to display
            var f = Ext.getCmp(t.id);
            var d = document.createElement('div');
            d.className = 'x-form-text';
            d.appendChild(document.createTextNode(t.value));
            Ext.fly(d).setWidth(f.getEl().getWidth());
            return {
                field: f,
                ddel: d
            };
        }
    },

//  The coordinates to slide the drag proxy back to on failed drop.
    getRepairXY: function() {
        return this.dragData.field.getEl().getXY();
    }
});

