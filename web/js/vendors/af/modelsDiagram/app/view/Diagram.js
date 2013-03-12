/**
 * Diagram component, lists models diagram.
 *
 * TODO @nick take out in a mixin or utility class models description meta-data
 *
 * @author Pavel Konovalov
 * @author Nikolai Babinski
 */
Ext.define('Af.md.view.Diagram', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.md-diagram',

    requires: [
        'Ext.draw.Component',
        'Ext.draw.Sprite',
        'Ext.window.Window'
    ],

    layout: 'fit',

    /**
     * Canvas container
     */
    canvas: null,

    /**
     * Container with sprites set
     */
    connections: [],

    /**
     * Container with dragable entities
     */
    entities: [],

    /**
     * @template
     * @protected
     */
    initComponent: function() {
        var me = this;

        //Create canvas element
        this.canvas = Ext.create('Ext.draw.Component');

        //Apply configuration
        Ext.apply(this, {
            items: this.canvas
        });

        me.callParent(arguments);
    },

    /**
     * @template
     * @protected
     */
    onBoxReady: function() {
        this.callParent(arguments);

        this.loadData();
    },

    /**
     * Loads models diagram data.
     */
    loadData: function() {
        var me = this;

        me.el.mask('Diagram loading...');

        Ext.Ajax.request({
            url: Af.md.Url.structure,
            scope: me,
            success: function(xhr) {
                var response;

                me.el.unmask();

                try {
                    response = Ext.decode(xhr.responseText);
                } catch (e) {
                    Ext.Error.raise('[Af.md.view.Diagram->loadData] data is incorrect');
                }

                this.createEntities(response.data);
            },
            failure: function(xhr, opts) {
                me.el.unmask();
                Ext.Error.raise('[Af.md.view.Diagram->loadData] loading data failed');
            }
        });
    },

    /**
     * Create instance of the draggable element
     */
    createEntities: function(data) {
        var item, cfg, coords,
            schema, schemaData;

        for (schema in data) {
            if (data.hasOwnProperty(schema) && data[schema].propel) {

                schemaData = data[schema].propel;

                //Go through all tables
                for (var key in schemaData) {

                    if (key != '_attributes') {
                        var model = schemaData[key],
                            modelName, modelId,
                            field, p,
                            fk = [],
                            html = [];

                        if (model['_attributes'] && model['_attributes'].phpName) {
                            modelName = model['_attributes'].phpName;
                        } else {
                            modelName = key;
                        }

                        modelId = model['_attributes'] && model['_attributes']['id']
                                    ? model['_attributes']['id']
                                    : key;

                        //goes over all model's fields
                        for (field in model) {
                            p = model[field];

                            if (field != '_attributes' && field != '_indexes' && field != 'x' && field != 'y') {
                                if (p && Ext.isObject(p)) {
                                    html[html.length] = [p.phpName ? p.phpName : field, '(', p.type, ')'].join('');

                                    if (p.foreignTable) {
                                        fk.push({
                                            field: field,
                                            foreignTable: p.foreignTable,
                                            foreignReference: p.foreignReference
                                        });
                                    }
                                //propel auto fields (this meta-data should be clarified)
                                } else if (p == null) {
                                    html[html.length] = field;
                                }
                            }
                        }

                        //Get coords
                        coords = this.getXYCoords(model);

                        //TODO @nick create separate class for diagram entity
                        //TODO @nick diagram properties processor adapter
                        //TODO @nick id for entity must be unique, with current structure it can be duplicated
                        //      having several schemas with same model names

                        //Create config object
                        cfg = {
                            title: modelName,
                            id: modelId,
                            fk: fk,
                            modelData: {
                                name: modelName,
                                schema: schema,
                                fk: fk
                            },
                            bodyStyle: 'padding: 5px',
                            y: coords.y,
                            x: coords.x,
                            autoScroll: true,
                            draggable: true,
                            constrain: true,
                            closable: false,
                            listeners: {
                                scope: this,
                                boxready: this.addWindowDragHandler
                            },
                            html: html.join('<br />')
                        };

                        item = Ext.create('Ext.window.Window', cfg);
                        this.entities.push(item);
                    }
                }
            }
        }

        //Show entities and create connections
        this.createConnectionSprites(this);
    },

    /**
     * Handler for the "boxready" event
     * Add listener to the onMove event for each window
     * @param {Ext.window.Window} w
     */
    addWindowDragHandler: function(w){
        var me = this,
            fn = Ext.bind(me.redrawConnections, me, [w]);

        //updating connections on dragging model
        w.dd.on('drag', fn);

        //redraw model connections when its container viewport is resized and model is moved to be visible
        w.on('move', me.redrawConnections);
    },

    /**
     * Redraws all connections specified for selected component
     * @param {Ext.window.Window} w
     * @author Pavel Konovalov
     */
    redrawConnections: function(w) {
        var me = this,
            winId = w.getId();

        //TODO @nick draggable model window must know its connections, we do no need to go through all connections
        if (me.connections) {
            var l = me.connections.length,
                i = 0,
                conn, o1, o2, p;

            for (; i < l; i++) {
                conn = me.connections[i];
                o1 = o2 = p = null;

                //model has connections
                if (winId == conn.parentId || winId == conn.childId) {
                    o1 = w.ghostPanel;
                    o2 = Ext.getCmp((winId == conn.parentId) ? conn.childId : conn.parentId);
                    p = me.getPath(o1, o2);
                    conn.setAttributes({path: p}, true);
                }
            }
        }
    },

    /**
     * Creates connections between sprites
     */
    createConnectionSprite: function(parentId, childId) {
        var me = this,
            path, sprite;

        //TODO @nick it's not good practice find out components based on their ids, especially when id is based on model name
        //inside a schema, id must be unique and components must be fetched from components manager or pool (not based on id)
        path = me.getPath(Ext.getCmp(parentId), Ext.getCmp(childId));

        sprite = Ext.create('Ext.draw.Sprite', {
            parentId: parentId,
            childId: childId,
            type: 'path',
            path: path,
            stroke: "#000",
            fill: "#fff"
        });

        //Keep sprite
        this.connections.push(sprite);

        //Add sprite to surface
        this.canvas.surface.add(sprite);

        //Show sprite
        sprite.show(true);
    },

    /**
     * Creates elements and adds connections between them
     */
    createConnectionSprites: function() {
        var me = this,
            indexes, childId,
            i, j, l = me.entities.length,
            ent, entFk;

        //Show entities
        for (i = 0; i < l; i++) {
            ent = me.entities[i];
            me.add(ent);
            ent.show();
        }

        //initialise models connections if they exist
        for (i = 0; i < l; i++) {
            ent = me.entities[i];
            entFk = ent.fk;

            if (entFk.length > 0) {
                var fkLen = entFk.length,
                    fk;

                for (j = 0; j < fkLen; j++) {
                    fk = entFk[j];
                    me.createConnectionSprite(ent.id, fk.foreignTable);
                }
            }
        }
    },

    /**
     * Generates new path between two objects
     * @param {Ext.Panel} obj1
     * @param {Ext.Panel} obj2
     * @return {String} SVG path
     *
     * @author Pavel Konovalov
     */
    getPath: function(obj1, obj2){
        var d = {},
            dis = [],
            p = [
                {x: obj1.x + obj1.getWidth() / 2, y: obj1.y - 1},
                {x: obj1.x + obj1.getWidth() / 2, y: obj1.y + obj1.getHeight() + 1},
                {x: obj1.x - 1, y: obj1.y + obj1.getHeight() / 2},
                {x: obj1.x + obj1.getWidth() + 1, y: obj1.y + obj1.getHeight() / 2},
                {x: obj2.x + obj2.getWidth() / 2, y: obj2.y - 1},
                {x: obj2.x + obj2.getWidth() / 2, y: obj2.y + obj2.getHeight() + 1},
                {x: obj2.x - 1, y: obj2.y + obj2.getHeight() / 2},
                {x: obj2.x + obj2.getWidth() + 1, y: obj2.y + obj2.getHeight() / 2}
            ];

        for (var i = 0; i < 4; i++) {
            for (var j = 4; j < 8; j++) {
                var dx = Math.abs(p[i].x - p[j].x),
                    dy = Math.abs(p[i].y - p[j].y);
                if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                    dis.push(dx + dy);
                    d[dis[dis.length - 1]] = [i, j];
                }
            }
        }

        if (dis.length == 0) {
            var res = [0, 4];
        } else {
            res = d[Math.min.apply(Math, dis)];
        }
        var x1 = p[res[0]].x,
            y1 = p[res[0]].y,
            x4 = p[res[1]].x,
            y4 = p[res[1]].y;
        dx = Math.max(Math.abs(x1 - x4) / 2, 10);
        dy = Math.max(Math.abs(y1 - y4) / 2, 10);

        var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
            y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
            x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
            y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);

        return ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");
    },

    /**
     * Calculate (x, y) pair
     * @param {Object} cfg
     * @return {Object} (x, y) pair
     *
     * @author Pavel Konovalov
     */
    getXYCoords: function(cfg){
        var x, y;

        y = cfg.y || this.getRandomInt(5, 450-100);//Total height - item height
        x = cfg.x || this.getRandomInt(5, 795-100);//Total width - item width

        return {x: x , y: y};
    },

    /**
     * Gets random int from interval
     * @param {Int} min
     * @param {Int} max
     * @return {Int}
     *
     * @author Pavel Konovalov
     */
    getRandomInt: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});