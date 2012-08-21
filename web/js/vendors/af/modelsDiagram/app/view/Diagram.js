/**
 * Diagram component, lists models diagram.
 *
 * @author Pavel Konovalov
 * @author Nikolai Babinski
 */
Ext.define('Af.md.view.Diagram', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.md-diagram',

    requires: [
        'Ext.draw.Component',
        'Ext.window.Window',
        'Ext.draw.Sprite'
    ],

    //private overrides
    title: 'Models Diagram',

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
        this.canvas = Ext.create('Ext.draw.Component', {});

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

    //Load default dataset
    loadData: function() {
        var me = this;

        Ext.Ajax.request({
            url: Af.md.Url.structure,
            scope: me,
            success: function(xhr){
                // process server response
                var response = Ext.decode(xhr.responseText);

                //Create entities
                this.createEntities(response.data);
            }
        });
    },

    /**
     * Create instance of the dragable element
     */
    createEntities: function(data) {
        var item, cfg, html, coords;

        for (var schema in data) {
            if (data.hasOwnProperty(schema) && data[schema].propel) {

                var schemaData = data[schema].propel;

                console.log(schema, schemaData);

                //Go through all tables
                for(var key in schemaData){

                    if ('_attributes' != key) {

                        console.log('key', key);

                        html = [];

                        //Go throug all fields
                        for (var k in schemaData[key]) {
                            var p = schemaData[key][k];

                            if (p && '_attributes' != k && '_indexes' != k && 'x' != k && 'y' != k) {
                                html[html.length] = [p.phpName ? p.phpName : k, '(', p.type, ')'].join('');
                            }
                        }

                        //Get coords
                        coords = this.getXYCoords(schemaData[key]);

                        //Create config object
                        cfg = {
                            id: schemaData[key]['_attributes']['id'],
                            //create indexes
                            indexes: schemaData[key]['_indexes'],
                            key: key, title: key,
                            bodyStyle: 'padding: 5px',
                            y: coords.y, x: coords.x,
                            autoScroll: true,
                            constrain: true, closable: false, draggable: true,
                            listeners: {
                                scope: this,
                                boxready: this.addWindowDragHandler
                            },
                            html: html.join('<br>')
                        };

                        //Create dragable window
                        item = Ext.create('Ext.window.Window', cfg);

                        //Add element to the main elements container
                        this.entities[this.entities.length] = item;
                    }
                }
            }
        }

        console.log('entities', this.entities);


        //Show entities and create connections
        this.createConnectionSprites(this);
    },

    /**
     * Handler for the "afterrender" event
     * Add listener to the onMove event for each window
     * @param {Ext.Panel} cmp
     */
    addWindowDragHandler: function(cmp){
        var fn = function(e){
            this.redrawConnections(e.comp);
        }

        cmp.dd.addListener('drag', fn, this);
    },

    /**
     * Redraws all connections specified for selected component
     * @param {Ext.Panel} cmp
     */
    redrawConnections: function(cmp){
        if(this.connections && this.connections){
            for(var i = 0, l = this.connections.length; i<l; i++){

                var o1 = o2 = p = null;

                //Check if
                if(cmp.getId() == this.connections[i].parentId){
                    o1 = cmp.ghostPanel;
                    o2 = Ext.getCmp(this.connections[i].childId);
                }

                if(cmp.getId() == this.connections[i].childId){
                    o1 = cmp.ghostPanel;
                    o2 = Ext.getCmp(this.connections[i].parentId);
                }

                if(o1 && o2){
                    p = this.getPath(o1, o2);
                    this.connections[i].setAttributes({path: p}, true);
                }
            }
        }
    },

    /**
     * Creates connections between sprites
     */
    createConnectionSprite: function(parentId, childId){
        var s = Ext.create('Ext.draw.Sprite', {
                parentId: parentId,
                childId: childId,
                type: "path", path: this.getPath(Ext.getCmp(parentId), Ext.getCmp(childId)), stroke:"#000", fill:"#fff"}
        );

        console.log('create connection sprite');

        console.log(this.getPath(Ext.getCmp(parentId), Ext.getCmp(childId)));
        //Keep sprite
        this.connections[this.connections.length] = s;

        //Add sprite to surface
        this.canvas.surface.add(s);

        //Show sprite
        s.show(true);
    },

    /**
     * Creates elements and adds connections between them
     * @param {cmp}
        */
    createConnectionSprites: function(cmp){
        var indexes, childId;

        //Show entities
        for(var i = 0, l = this.entities.length; i<l; i++){
            cmp.add(this.entities[i]);
            this.entities[i].show();
        }

        //Show CONNECTION lines
        for(var i = 0, l = this.entities.length; i<l; i++){
            //Create connections
            indexes = this.entities[i]['indexes'];
            if(Ext.isDefined(indexes)){

                for(var key in indexes){
                    for(var j = 0, k = indexes[key].length; j<k; j++){
                        //get name of the which should be connected
                        childId = indexes[key][j].split('_');
                        childId = childId[0];

                        //Create lines
                        this.createConnectionSprite(this.entities[i].id, childId);
                    }
                }
            }
        }
    },

    /**
     * Generates new path between two objects
     * @param {Ext.Panel} obj1
     * @param {Ext.Panel} obj2
     *
     * @return {String} SVG path
     */
    getPath: function(obj1, obj2){
        console.log(obj1);
//		console.log(obj2);
        var d = {},
            dis = [],
            p = [
                {x: obj1.x + obj1.width / 2, y: obj1.y - 1},
                {x: obj1.x + obj1.width / 2, y: obj1.y + obj1.height + 1},
                {x: obj1.x - 1, y: obj1.y + obj1.height / 2},
                {x: obj1.x + obj1.width + 1, y: obj1.y + obj1.height / 2},
                {x: obj2.x + obj2.width / 2, y: obj2.y - 1},
                {x: obj2.x + obj2.width / 2, y: obj2.y + obj2.height + 1},
                {x: obj2.x - 1, y: obj2.y + obj2.height / 2},
                {x: obj2.x + obj2.width + 1, y: obj2.y + obj2.height / 2}
            ];

        console.log(p);

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
     */
    getRandomInt: function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

});