//A global map variable has been declared.
var map;
//initial function called when google maps key loads
function initMap() {
  //  a constructor to create a new map JS object. You can use the coordinates
  //the coordinates of my city are given as center
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 30.7333,
      lng: 76.7794
    },
    zoom: 13
  });
  largeInfowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();
  //call for our knockout view model
  ko.applyBindings(ViewModel());
}
//function called if map does not load
function googleError() {
        $("#map").html("Sorry! Map has problem Loading");
}

//array containing all the information
locations =  [{
        title: 'Cafe Coffee Day',
        loc: {
            lat: 29.970413,
            lng: 76.836580
        },
        f_id: '52a0826a498eb76b5bd8e672',
        show: true,
        selected: false
    },
    {
        title: 'Pizza Hut',
        loc: {
            lat: 29.970437,
            lng: 76.837735
        },
        f_id: '5721c6c4498e78e3bf6e189b',
        show: true,
        selected: false
    },
    {
        title: 'Hotel Pearl Mark',
        loc: {
            lat: 29.968667,
            lng: 76.841214
        },
        f_id: '559ebd95498eba17e2ff2deb',
        show: true,
        selected: false
    },
    {
        title: 'Hotel Saffron',
        loc: {
            lat: 29.974434,
            lng: 76.873841
        },
        f_id: '4f6afa93e4b08d2f3e5f9191',
        show: true,
        selected: false
    },
    {
        title: 'Hotel Kimaya',
        loc: {
            lat: 29.971583,
            lng: 76.840418
        },
        f_id: '52a0a782498e1167e7290eb9',
        show: true,
        selected: false
    },
    {
        title: 'amul-scooping parlour',
        loc: {
            lat: 29.973150,
            lng: 76.854274
        },
        f_id: '4f6b39af7bebf48a255e71f1',
        show: true,
        selected: false
    }
];
//knockout viewmodel
var ViewModel = function() {
  selectedloc = ko.observable(''); //knockout variable to store input value of drop down list
  var self = this;
  self.error = ko.observable(''); //knockout variable to store value if foursquare api does not load.
  self.markers = []; //markers array has been created
  /* This function populates the infowindow when the marker is clicked. We'll only allow
       one infowindow which will open at the marker that is clicked, and populate based
       on that markers position.*/
  self.populateInfoWindow = function(marker, infowindow) {
    //ajax call for foursquare api
        markers.forEach(function(info) {
            $.getJSON({ //ajax file is called
                url: "https://api.foursquare.com/v2/venues/" + info.id + '?client_id=OCOENKHAZZJTCSIZJN2ZCMUEJE01GLSCVBV3PAVGR5KVL2TA&client_secret=0TN5PQPW1CBY2ZGWCPF3GYGPZ500RDUEIE5IPPI4D1W42IVM&v=20170101', //this the foursquare key and secret id with version
                success: function(data) {
                    var result = data.response.venue;
                    info.likes = result.hasOwnProperty('likes') ? result.likes.summary : "Not Available";
                    var markerinfo = '<h2>' + marker.title + '</h2>' + "<h3>Likes:" + marker.likes;
                    infwindo.setContent(markerinfo);
                    infwindo.open(map, marker);
                    infwindo.addListener('closeclick', function() {
                        infwindo.marker = 0;
                    });
                },
                error: function(error) { //displays the error when foursquare link does not work
                    window.alert('Error Loading Foursquare Link');
                }
            });
        });
    }
  /*This function takes in a COLOR, and then creates a new marker
   icon of that color. The icon will be 21 px wide by 34 high, have an origin
   of 0, 0 and be anchored at 10, 34).*/
    function makeMarkerIcon(markerColor) { // the changes the marker apperance when clicked or moved
        var markerImg = new google.maps.MarkerImage(
            'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
            '|40|_|%E2%80%A2',
            new google.maps.Size(20, 32),
            new google.maps.Point(0, 0),
            new google.maps.Point(11, 35),
            new google.maps.Size(20, 32));
        return markerImg;
    }
  // default colour for marker
  var defaultIcon = makeMarkerIcon('0091ff');
  //when marker is clicked colour changes
  var highlightedIcon = makeMarkerIcon('FFFF24');
  //Create al markers
  for (i = 0; i < locations.length; i++) {
    // Get all the information from the location array.
    var position = locations[i].location;
    var title = locations[i].title;
    var description = locations[i].description;
    var id = locations[i].id;
    var selected = locations[i].selected;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: id,
      show: ko.observable(true),
      selected: ko.observable(selected),
      description: description
    });
    // Push the marker to our array of markers.
    self.markers.push(marker);
    // Extend boundaries of map or each marker
    bounds.extend(marker.position);
    //  onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfowindow);
      bounds.extend(this.position);
    });
    // onclick event to change marker colour
    marker.addListener('click', function() {
      for (var i = 0; i < self.markers.length; i++) {
        if (self.markers[i].id != this.id) {
          self.markers[i].setIcon(defaultIcon);
        } else {
          self.markers[i].setIcon(highlightedIcon);
        }
      }
    });
  }
  map.fitBounds(bounds); // `bounds` is a `LatLngBounds` object
  //used for filteration,when a user clicks on a particular item this function is invoked
  self.change = function(data, event) {
    for (var i = 0; i < self.markers.length; i++) {
      if (self.markers[i].title == data.title) {
        self.populateInfoWindow(markers[i], largeInfowindow);
        markers[i].setIcon(highlightedIcon);
        bounds.extend(self.markers[i].position);
      } else {
        markers[i].setIcon(defaultIcon);
      }
    }
  };

  self.test = function(viewModel, event) {
    if (this.selectedloc().length === 0) {
            this.search(true);
        } else { //will work for the text enetered in the serach box
            for (i = 0; i < markers.length; i++) {
                if (markers[i].title.toLowerCase().indexOf(this.enteredText().toLowerCase()) >= 0) {
                    markers[i].show(true);
                    markers[i].selected(true);
                    markers[i].setVisible(true);
                } else {
                    self.markers[i].show(false);
                    self.markers[i].setVisible(false);
                    self.markers[j].selected(true);
                }
            }
        }
        largeInfowindow.close();
    };
    this.search = function(elem) {
        for (i = 0; i < self.markers.length; i++) {
            markers[i].show(elem);
            self.markers[i].selected(true);
            markers[i].setVisible(elem);
        }
    };
