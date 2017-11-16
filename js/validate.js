(function() {

    mapboxgl.accessToken = 'pk.eyJ1IjoiZHJpbWFjdXMxODIiLCJhIjoiWGQ5TFJuayJ9.6sQHpjf_UDLXtEsz8MnjXw';
    var map = new mapboxgl.Map({
        container: 'map',
        // style: 'style.json',
        style: 'mapbox://styles/mapbox/streets-v9',
        minZoom: 8, //restrict map zoom
        maxZoom: 18,
        zoom: 11,
        center: [30.598258248737466, 50.46690715898018],
        hash: true
    });

    map.on('load', function () {
        d3.json("data/crossings.geojson", function(err, geojson) {
            if (err) throw err;


            map.addLayer({
                'id': 'crossings',
                'type': 'circle',
                'source': {
                    type: 'geojson',
                    data: geojson
                },
                'paint': {
                    'circle-color': "#aa1111",
                    "circle-opacity": 0.2,
                    'circle-radius': 5,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#cc0000"
                }
            });
            var popup = new mapboxgl.Popup({
                closeButton: false
            });

            window.ppos = 0;

            d3.select("#next").on("click", function(){
                var f = geojson.features[ppos];

                var c = f.geometry.coordinates;
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

                d3.select("#osm").text(f.properties.osm_id);
                //
                // var popup = new mapboxgl.Popup()
                //     .setLngLat(feature.geometry.coordinates)
                //     .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'> <h5> Detail: </h5>' +
                //         '<ul class=\'list-group\'>' +
                //         '<li class=\'list-group-item\'> osm: ' + feature.properties['osm_id'] + ' </li></ul></div>')
                //     .addTo(map);

                console.log("" + window.ppos + " / " + geojson.features.length);
                window.ppos++;

                console.log(f);

                popup.setLngLat(c)
                    .setText("aa")
                    .addTo(map);

                map.flyTo({
                    // These options control the ending camera position: centered at
                    // the target, at zoom level 9, and north up.
                    center: c,
                    // zoom: 9,
                    // bearing: 0,

                    // These options control the flight curve, making it move
                    // slowly and zoom out almost completely before starting
                    // to pan.
                    speed: 1, // make the flying slow
                    // curve: 1, // change the speed at which it zooms out

                    // This can be any easing function: it takes a number between
                    // 0 and 1 and returns another number between 0 and 1.
                    easing: function (t) {
                        return t;
                    }
                });
            });

            d3.select("#prev").on("click", function(){

                window.ppos--;
            });


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


        var popup = new mapboxgl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML('<div id=\'popup\' class=\'popup\' style=\'z-index: 10;\'> <h5> Detail: </h5>' +
                '<ul class=\'list-group\'>' +
                '<li class=\'list-group-item\'> osm: ' + feature.properties['osm_id'] + ' </li></ul></div>')
            .addTo(map);
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


