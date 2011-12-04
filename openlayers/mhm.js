var map;

function init() {
    map = new OpenLayers.Map({
        div: "map",
        projection: new OpenLayers.Projection("EPSG:900913"),
        units: "m",
        maxResolution: 156543.0339,
        maxExtent: new OpenLayers.Bounds(
            -20037508.34, -20037508.34, 20037508.34, 20037508.34
        )
    });
    
    var osm = new OpenLayers.Layer.OSM();
    var token = "Lfprs6BjycggmYjye9fG"    // Replace this with your myHeatmap API token
    var set_id = "20"                     // Replace this with the set id for your overlay data
    var mhm = new OpenLayers.Layer.mHm( "My Heatmap", set_id, token, {} );
    
    map.addLayers([osm, mhm]);

    map.addControl(new OpenLayers.Control.LayerSwitcher());

    map.setCenter(
        new OpenLayers.LonLat(-95, 39).transform(
            new OpenLayers.Projection("EPSG:4326"),
            map.getProjectionObject()
        ), 
        4
    );
}