(function() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'style3.json',
        // style: 'mapbox://styles/mapbox/streets-v8',
        minZoom: 8, //restrict map zoom
        maxZoom: 18,
        zoom: 11,
        center: [30.598258248737466, 50.46690715898018],
        hash: true
    });

    map.on('load', function (){
        d3.queue()
            .defer(d3.json, "data/crossings_kyiv.geojson")
            .defer(d3.csv, "data/fast.csv")
            .await(function(err, crossings, fast_csv) {
                if (err) throw err;
        
                var fast = {
                    "type": "FeatureCollection",
                    "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}}
                };
        
                fast.features = fast_csv.map(function (row) {
                    return { geometry: {type: "Point", coordinates: [+row.X, +row.Y]}}
                });
        
                map.addLayer({
                    'id': 'crossings',
                    'type': 'circle',
                    'source': {
                        type: 'geojson',
                        data: crossings
                    },
                    // 'source-layer': 'sf2010',
                    'paint': {
                        'circle-color': "#ff0000",
                        "circle-opacity": 0.8,
                        'circle-radius': 10,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#f44141",
                        "circle-blur": 0.8,
        
                    }
                }, "place_other");
        
                map.addLayer({
                    'id': 'fast-heat',
                    'type': 'circle',
                    'source': {
                        type: 'geojson',
                        data: fast
                    },
        
                    "paint": {
                        'circle-color': "#f4d142",
                        'circle-radius': 5,
                        "circle-opacity": 0.1,
                    }
                }, "place_other");
        
            });
    });

    map.on('click', function(e) {
        var features = map.queryRenderedFeatures(e.point, {layers: ['crossings']} );

        // if the features have no info, return nothing
        if (!features.length) {
            return;
        }

        var feature = features[0];

        var c = feature.geometry.coordinates;
        console.log(c);

        d3.select(".map-popup-content")
            .selectAll("*").remove();

        d3.select(".map-popup-content")
            .append("iframe")
            .attr("width", 600)
            .attr("height", 450)
            .attr("frameborder", 0)
            .attr("style", "border:0")
            .attr("allowfullscreen", true)
            .attr("src", embed_str([c[0], c[1] - 0.00015]));


        // var popup = new mapboxgl.Popup()
        //     .setLngLat(feature.geometry.coordinates)
        //     .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'> <h5> Detail: </h5>' +
        //         '<ul class=\'list-group\'>' +
        //         '<li class=\'list-group-item\'> osm: ' + feature.properties['osm_id'] + ' </li></ul></div>')
        //     .addTo(map);
    });

    map.on('mousemove', function(e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['crossings'] });
        map.getCanvas().style.cursor = features.length ? 'pointer' : '';
    });


    function embed_str(c) {
        return "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDjcBDKy_BzLLd5Uzh_Ihlmyk3uE6GGMBM" +
            "&location=" + c[1] + "," + c[0] +
        "&heading=0&pitch=0&fov=80";
    }

})();


