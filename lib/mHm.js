/**
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */

/**
 * Class: OpenLayers.Layer.mHm
 * Create a layer for accessing tiles from services that conform with the 
 *     myHeatmap API
 *     (http://myheatmap.github.com)
 *
 * Example:
 * (code)
 *     var layer = OpenLayers.Layer.mHm(
 *
 *         // required properties
 *         "myHeatmap Layer", // name for display in LayerSwitcher
 *         "123",             // data set id
 *         "asdf123",         // api token
 *
 *         // optional properties
 *         {
 *             // Color scale:
 *             // 
 *             color_scale: "0000ff:0|00ff00:50|ff0000:100",
 *             width: 3
 *         }
 *
 *     );
 * (end)
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.mHm = OpenLayers.Class(OpenLayers.Layer.Grid, {

    /**
     * APIProperty: isBaseLayer
     * {Boolean} Make this layer a base layer.  Default is true.  Set false to
     *     use the layer as an overlay.
     */
    isBaseLayer: false,

    /**
     * APIProperty: tileOrigin
     * {<OpenLayers.LonLat>} Optional origin for aligning the grid of tiles.
     *     If provided, requests for tiles at all resolutions will be aligned
     *     with this location (no tiles shall overlap this location).  If
     *     not provided, the grid of tiles will be aligned with the bottom-left
     *     corner of the map's <maxExtent>.  Default is ``null``.
     *
     */
    tileOrigin: null,

    /**
     * APIProperty: serverResolutions
     * {Array} A list of all resolutions available on the server.  Only set this
     *     property if the map resolutions differs from the server.
     */
    serverResolutions: null,

    /**
     * APIProperty: zoomOffset
     * {Number} If your cache has more zoom levels than you want to provide
     *     access to with this layer, supply a zoomOffset.  This zoom offset
     *     is added to the current map zoom level to determine the level
     *     for a requested tile.  For example, if you supply a zoomOffset
     *     of 3, when the map is at the zoom 0, tiles will be requested from
     *     level 3 of your cache.  Default is 0 (assumes cache level and map
     *     zoom are equivalent).  Using <zoomOffset> is an alternative to
     *     setting <serverResolutions> if you only want to expose a subset
     *     of the server resolutions.
     */
    zoomOffset: 0,
    
    /**
     * Constructor: OpenLayers.Layer.mHm
     * 
     * Parameters:
     * name - {String} Title to be displayed in a <OpenLayers.Control.LayerSwitcher>
     * setid - {String} Data set id from myHeatmap API
     * token - {String} Authentication token for the myHeatmap API
     * options - {Object} Additional properties to be set on the layer
     */
    initialize: function(name, setid, token, options) {
        var newArguments = [];
        var url = "http://api.myheatmap.com/sets/" + encodeURIComponent(setid);
        options["token"] = token;
        newArguments.push( name, url, {}, options );
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
    },

    /**
     * APIMethod:destroy
     */
    destroy: function() {
        // for now, nothing special to do here. 
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);  
    },

    
    /**
     * APIMethod: clone
     * Create a complete copy of this layer.
     *
     * Parameters:
     * obj - {Object} Should only be provided by subclasses that call this
     *     method.
     * 
     * Returns:
     * {<OpenLayers.Layer.mHm>} An exact clone of this <OpenLayers.Layer.mHm>
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.mHm(this.name,
                                           this.url,
                                           this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * Method: getURL
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * 
     * Returns:
     * {String} A string with the layer's url and parameters and also the 
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters
     */
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        var res = this.map.getResolution();
        var tileWidth = res * this.tileSize.w;
        var tileHeight = res * this.tileSize.h;
        var x = Math.round((bounds.left - this.tileOrigin.lon) / tileWidth);
        var y = Math.round((bounds.bottom - this.tileOrigin.lat) / tileHeight);
        var z = this.serverResolutions != null ?
            OpenLayers.Util.indexOf(this.serverResolutions, res) :
            this.map.getZoom() + this.zoomOffset;
        var path = "/tile?token=" + encodeURIComponent(this.token);
        var path = path + "&z=" + z + "&x=" + x +"&y=" + y; 
        var url = this.url;
        if (OpenLayers.Util.isArray(url)) {
            url = this.selectUrl(path, url);
        }
        return url + path;
    },

    /** 
     * Method: setMap
     * When the layer is added to a map, then we can fetch our origin 
     *    (if we don't have one.) 
     * 
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) { 
            this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
                                                this.map.maxExtent.bottom);
        }                                       
    },

    CLASS_NAME: "OpenLayers.Layer.mHm"
});
