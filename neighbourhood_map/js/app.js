//A global map variable
var map;
//loads the google map and calls view model
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 31.1048,
            lng: 77.1734
        },
        zoom: 13,
        styles: styles,
    });
    largeInfowindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();
    ko.applyBindings(ViewModel());
}

//locations to be marked on the map
var locations = [{
        title: 'Manali',
        location: {
            lat: 32.2396,
            lng: 77.1887
        },
        id: "4c299f76783d9c74558a8f6b",
        display: true
    },
    {
        title: 'Dharamshala',
        location: {
            lat: 32.2190,
            lng: 76.3234
        },
        id: "4ca092156c479521313f8e0c",
        display: true
    },
    {
        title: 'Shimla',
        location: {
            lat: 31.1048,
            lng: 77.1734
        },
        id: "4de083e945dd3eae87712d65",
        display: true
    },
    {
        title: 'Mandi',
        location: {
            lat: 31.5892,
            lng: 76.9182
        },
        id: "537effcf498e0519011651ae",
        display: true
    },
    {
        title: 'Kalpa',
        location: {
            lat: 31.5377,
            lng: 78.2754
        },
        id: "4db38f1dfa8c350240d1f0c9",
        display: true
    },
];
//style array to style the map
var styles = [{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#aee2e0"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#abce83"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
            "color": "#769E72"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#7B8758"
        }]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#EBF4A4"
        }]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
                "visibility": "simplified"
            },
            {
                "color": "#8dab68"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
            "visibility": "simplified"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#5B5B3F"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
            "color": "#ABCE83"
        }]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
            "color": "#A4C67D"
        }]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
            "color": "#9BBF72"
        }]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [{
            "color": "#EBF4A4"
        }]
    },
    {
        "featureType": "transit",
        "stylers": [{
            "visibility": "off"
        }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
                "visibility": "on"
            },
            {
                "color": "#87ae79"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
                "color": "#7f2200"
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.stroke",
        "stylers": [{
                "color": "#ffffff"
            },
            {
                "visibility": "on"
            },
            {
                "weight": 4.1
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "labels.text.fill",
        "stylers": [{
            "color": "#495421"
        }]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "labels",
        "stylers": [{
            "visibility": "off"
        }]
    }
];

//ko.js viewModel
var ViewModel = function() {
    var self = this;
    loc = ko.observable(''); //stores search box input
    self.error = ko.observable('');
    self.markers = []; //array to store markers
    /*this function designs the maker,postion,size and color
     */
    function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(21, 34),
            new google.maps.Point(0, 0),
            new google.maps.Point(10, 34),
            new google.maps.Size(21, 34));
        return markerImage;
    }
    // default colour for marker
    var defaultIcon = makeMarkerIcon('90ee90');
    //defines and create marker markers
    for (i = 0; i < locations.length; i++) {
        // Get all the info about location to be marked.
        var position = locations[i].location;
        var title = locations[i].title;
        var description = locations[i].description;
        var id = locations[i].id;
        var display = locations[i].display;
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: id,
            display: ko.observable(display),
            description: description
        });
        self.markers.push(marker);
        // Extend boundaries of map or each marker
        bounds.extend(marker.position);
        // opens the infowindow for each marker clicked.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
            //applies bounds
            bounds.extend(this.position);
        });
        // animates the marker when it is clicked
        marker.addListener('click', function() {
            for (var i = 0; i < self.markers.length; i++) {
                if (self.markers[i].title == this.title && self.markers[i].id == this.id) {
                    self.animateMarker(markers[i]);
                }
            }

        });
    }
    /* calls the infoWindow for marker clicked , sets its content as fetched by ajax call via foursquare*/
    self.populateInfoWindow = function(marker, infowindow) {
        var FsUrl = "https://api.foursquare.com/v2/venues/";
        var Client_id = "?client_id=TZLRTAXA5WLITQIQLU0RRC0RAC2QCS4ZI33GPOFHVJ1Z51I4";
        var Client_secret = "&client_secret=0OJ2LJS5XAYMJ2YRHSWOHTJZNU2EZ33Y4PE5WDR34ZJGMCA5";
        var Version = "&v=20170506";
        //ajax call
        $.ajax({
            url: FsUrl + marker.id + Client_id + Client_secret + Version,
            dataType: "json",
            success: function(data) {
                var json = data.response.venue;
                marker.info = '<p>' + '<b>' + json.name + " , " + json.location.state + " , " + json.location.country + '</b>' + '</p>';
                if (infowindow.marker != marker) {
                    infowindow.marker = marker;
                    infowindow.setContent(marker.info + '<img src="' + json.photos.groups[0].items[0].prefix + '200x100' + json.photos.groups[0].items[0].suffix + '">');
                    infowindow.open(map, marker);
                    infowindow.addListener('closeclick', function() {
                        infowindow.marker = null;
                    });
                }
            },
            //if foursquare doesnt load
            error: function(e) {
                self.error("Data Could'nt Load");
            }
        });
    };
    map.fitBounds(bounds);
    //this function responds to search queries and shows the selected marker
    self.test = function(viewModel, event) {
        if (loc().length === 0) {
            for (var i = 0; i < self.markers.length; i++) {
                self.markers[i].setVisible(true);
                self.markers[i].display(true);
            }
        } else {
            for (var j = 0; j < self.markers.length; j++) {
                if (self.markers[j].title.toLowerCase().indexOf(loc().toLowerCase()) >= 0) {
                    self.markers[j].setVisible(true);
                    self.markers[j].display(true);
                } else {
                    self.markers[j].setVisible(false);
                    self.markers[j].display(false);
                }
            }
        }
        largeInfowindow.close();
    };
    //used for filteration,when a user clicks on a particular item this function is invoked
    self.animateMarker = function(data) {
        for (var i = 0; i < self.markers.length; i++) {
            if (self.markers[i].title == data.title && self.markers[i].id == data.id) {
                //animation onclick
                markers[i].setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function() {
                    data.setAnimation(null);
                }, 1100);
                self.populateInfoWindow(markers[i], largeInfowindow);
            } else {
                markers[i].setAnimation(null);
            }
        }

    };
};
//error function if map couldnt load
function noLoad() {
    $("#map").text("MAP COULD'NT LOAD");
}