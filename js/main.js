(function() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'style.json',
        // style: 'mapbox://styles/mapbox/light-v9',
        minZoom: 8, //restrict map zoom
        maxZoom: 18,
        zoom: 11,
        center: [30.598258248737466, 50.46690715898018],
        hash: true
    });

    map.on('load', function (){
        d3.queue()
            .defer(d3.json, "data/crossings.geojson")
            // .defer(d3.csv, "data/fast.csv")
            .await(function(err, crossings, fast_csv) {
                if (err) throw err;

                // var fast = {
                //     "type": "FeatureCollection",
                //     "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}}
                // };
                //
                // fast.features = fast_csv.map(function (row) {
                //     return { geometry: {type: "Point", coordinates: [+row.X, +row.Y]}}
                // });

                // map.addLayer({
                //     'id': 'fast-heat',
                //     'type': 'heatmap',
                //     'source': {
                //         type: 'geojson',
                //         data: fast
                //     },
                //     // 'source-layer': 'sf2010',
                //     // 'paint': {
                //     //     'circle-color': "#cc5620",
                //     //     "circle-opacity": 0.2,
                //     //     'circle-radius': 5,
                //     //     "circle-stroke-width": 1,
                //     //     "circle-stroke-color": "#cc5620"
                //     //
                //     // }
                // }, "place_other");

                map.addLayer({
                    'id': 'crossings',
                    'type': 'circle',
                    'source': {
                        type: 'geojson',
                        data: crossings
                    },
                    // 'source-layer': 'sf2010',
                    'paint': {
                        'circle-color': "#cc5620",
                        "circle-opacity": 0.6,
                        'circle-radius': 7,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#cc5620",
                        "circle-blur": 1,
    
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

    // d3.json("data/crossings.geojson", function(err, geojson) {
    //
    //     if (err) throw err;
    //
    //     geojson.features.forEach(function (f) {
    //         // f.geometry.coordinates[1] -= 0.00015;
    //     });
    //
    //     var data = geojson.features.map(function(f) {
    //         return f.geometry.coordinates;
    //     });
    //
    //     // <iframe width="600" height="450" frameborder="0" style="border:0"
    //     // src="https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDjcBDKy_BzLLd5Uzh_Ihlmyk3uE6GGMBM
    //     // &location=50.522135, 30.483661
    //     // &heading=0
    //     // &pitch=0
    //     // &fov=35
    //     // " allowfullscreen></iframe>
    //
    //     // data.slice(0, 25).forEach(function(c, i) {
    //     //     setTimeout(function() {
    //     //         d3.select("#main-container")
    //     //             .append("iframe")
    //     //             .attr("width", 600)
    //     //             .attr("height", 450)
    //     //             .attr("frameborder", 0)
    //     //             .attr("style", "border:0")
    //     //             .attr("allowfullscreen", true)
    //     //             .attr("src", embed_str(c));
    //     //         }, i*1000);
    //     // });
    //
    //     var points_layer = L.geoJSON(geojson, {
    //         style: function (feature) {
    //             return {
    //                 radius: 3,
    //                 fillColor: "red" ,
    //                 color: "#000",
    //                 weight: 1,
    //                 opacity: 1,
    //                 fillOpacity: 0.5,
    //                 stroke: 0
    //             };
    //         },
    //
    //         pointToLayer: function (feature, latlng) {
    //             return L.circleMarker(latlng);
    //         }
    //     });
    //
    //     points_layer.on("click", function(e) {
    //         var c = e.layer.feature.geometry.coordinates;
    //         console.log(c);
    //         d3.select(".map-popup-content")
    //             .selectAll("*").remove();
    //
    //         d3.select(".map-popup-content")
    //             .append("iframe")
    //             .attr("width", 600)
    //             .attr("height", 450)
    //             .attr("frameborder", 0)
    //             .attr("style", "border:0")
    //             .attr("allowfullscreen", true)
    //             .attr("src", embed_str([c[0], c[1] - 0.00015]));
    //
    //     });
    //
    //     points_layer.addTo(map);
    // });


    function embed_str(c) {
        return "https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDjcBDKy_BzLLd5Uzh_Ihlmyk3uE6GGMBM" +
            "&location=" + c[1] + "," + c[0] +
        "&heading=0&pitch=0&fov=80";
    }

})();


