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
            .defer(d3.csv, "data/fast_3th.csv")
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
                    'id': 'fast-heat',
                    'type': 'circle',
                    'source': {
                        type: 'geojson',
                        data: fast
                    },

                    "paint": {
                        'circle-color': "#ffbb22",
                        'circle-radius': {
                            base: 1,
                            stops: [
                                [10, 1],
                                [16, 5]
                            ]
                        },
                        "circle-opacity": {
                            base: 1,
                            stops: [
                                [10, 0.1],
                                [16, 0.3]
                            ]
                        },
                    }
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
                        'circle-color': "#EF5223",
                        "circle-opacity": 0.8,
                        'circle-radius': {
                            base: 1,
                            stops: [
                                [10, 2],
                                [16, 10]
                            ]
                        },
                        // "circle-stroke-dasharray": [0.1, 1.8],
                        // "circle-stroke-width": 0.5,
                        // "circle-stroke-color": "#EF5223",
                        // "circle-blur": 0.8,
                    }
                });

                map.addLayer({
                    'id': 'crossings-hover',
                    'type': 'circle',
                    'source': {
                        type: 'geojson',
                        data: crossings
                    },
                    'paint': {
                        'circle-color': "#EF5223",
                        "circle-opacity": 0.8,
                        'circle-radius': {
                            base: 1,
                            stops: [
                                [10, 8],
                                [16, 20]
                            ]
                        }
                        // "circle-stroke-dasharray": [0.1, 1.8],
                        // "circle-stroke-width": 0.5,
                        // "circle-stroke-color": "#EF5223",
                        // "circle-blur": 0.8,
                    },
                    filter: ["==", "osm_id", ""]
                });


            });
    });

    map.on('click', "crossings", function(e) {
        map.setFilter("crossings-hover", ["==", "osm_id", e.features[0].properties.osm_id]);

        var features = e.features;

        // if the features have no info, return nothing
        if (!features.length) {
            return;
        }

        var feature = features[0];

        var c = feature.geometry.coordinates;
        console.log(feature);
        
        var html = iframe({
            src: embed_str([c[0], c[1] - 0.00015]),
            width: "100%",
            height: "100%"
        });

        // d3.select(".map-popup-content").selectAll("*").remove();

        var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(html)
            .addTo(map);
    });

    map.on('mousemove', "crossings", function(e) {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', "crossings", function(e) {
        map.getCanvas().style.cursor = '';
    });


    function embed_str(c) {
        return "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDjcBDKy_BzLLd5Uzh_Ihlmyk3uE6GGMBM" +
            "&location=" + c[1] + "," + c[0] +
        "&heading=0&pitch=0&fov=80";
    }

    function iframe(p) {
        return "<iframe frameborder='0' style='border:0' allowfullscreen='true' width='{width}' height='{height}' src='{src}'></iframe>"
            .replace("{width}", p.width)
            .replace("{height}", p.height)
            .replace("{src}", p.src) + "<div class='popup-overlay'></div>"
    }

})();


