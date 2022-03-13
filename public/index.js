// Setting Up MAP on our Website

mapboxgl.accessToken =
  "pk.eyJ1IjoicGhpbGljYSIsImEiOiJja3Z0N2xqdGMwYXR1MndqdGRla2F3OXZ4In0.llFTILdFUxQE4UBGwJn3AQ";
var map = new mapboxgl.Map({
  container: "map",
  center: [38.763611, 9.005401],
  zoom: 15,
  style: "mapbox://styles/mapbox/streets-v11",
});

const nav = new mapboxgl.NavigationControl();
map.addControl(nav, "bottom-right");

// Add Directions to the map

var directions = new MapboxDirections({
  accessToken:
    "pk.eyJ1IjoicGhpbGljYSIsImEiOiJja3Z0N2xqdGMwYXR1MndqdGRla2F3OXZ4In0.llFTILdFUxQE4UBGwJn3AQ",
  unit: "metric",
  profile: "mapbox/driving",
});
map.addControl(directions, "bottom-right");

// Controls in the Page

// variables

var lat = 0;
var long = 0;
var Car_type = null;
var balance = 0;
var seats = 0;
var setEndingPoint = 0;
var setStartingPoint = 0;
var duration = 0;
var distance_value = 0;

var Select_car = document.getElementById("Select_car");
var Create_trip = document.getElementById("Create_Trip");
var Confirm_ride = document.getElementById("Confirm_ride");
var sideNav = document.getElementById("sideNav");
var touring = document.getElementById("touring");
var menuBtn = document.getElementById("sideMenu");

sideNav.style.right = "-270px";
// view Profile page

menuBtn.addEventListener("click", function () {
  if (sideNav.style.right == "-270px") {
    sideNav.style.right = "0";
    touring.style.display = "none";
  } else {
    sideNav.style.right = "-270px";
    touring.style.display = "block";
    touring.style.transition = ".5s";
  }
});

// Create trip page side bar showing

const create_trip_btn = document.getElementById("create_trip_btn");
create_trip_btn.addEventListener("click", () => {
  create_trip_btn.style.visibility = "hidden";
  trip_process.style.visibility = "visible";
});

// Function to continue to the next Select Car page

function PostLocations() {
  Create_trip.style.visibility = "hidden";
  touring.style.display = "none";
  Select_car.style.visibility = "visible";
  startingPoint = document.getElementById("start").value;
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${startingPoint}.json?access_token=pk.eyJ1IjoiYWJ1ZGFoMjkiLCJhIjoiY2t4a2NoOWViMGYwazJ3b2I3bTBobmRqbiJ9.bKDO1EQ2K2pPW43EoorFbg`;
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      setStartingPoint = data.features[0].place_name;
      FirstGeometryFirst = data.features[0].geometry.coordinates[0];
      FirstGeometrySecond = data.features[0].geometry.coordinates[1];
      lat = FirstGeometryFirst;
      long = FirstGeometrySecond;

      // Getting the location of the Destination/End point

      endingPoint = document.getElementById("end").value;

      const url_2 = `https://api.mapbox.com/geocoding/v5/mapbox.places/${endingPoint}.json?access_token=pk.eyJ1IjoiYWJ1ZGFoMjkiLCJhIjoiY2t4a2NoOWViMGYwazJ3b2I3bTBobmRqbiJ9.bKDO1EQ2K2pPW43EoorFbg`;

      fetch(url_2)
        .then((resp) => resp.json())
        .then((data) => {
          setEndingPoint = data.features[0].place_name;
          SecondGeometryFirst = data.features[0].geometry.coordinates[0];
          SecondGeometrySecond = data.features[0].geometry.coordinates[1];

          // Get The distances and other infos of the two points.

          const url_3 = `https://api.mapbox.com/directions/v5/mapbox/driving/${FirstGeometryFirst}%2C${FirstGeometrySecond}%3B${SecondGeometryFirst}%2C${SecondGeometrySecond}?alternatives=true&geometries=geojson&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiYWJ1ZGFoMjkiLCJhIjoiY2t4a2NoOWViMGYwazJ3b2I3bTBobmRqbiJ9.bKDO1EQ2K2pPW43EoorFbg`;
          fetch(url_3)
            .then((resp) => resp.json())
            .then((data) => {
              //Distance Calculation for the path by KM

              distance = data.routes[0].distance;
              distance_value = Math.round(distance * 0.001 * 100) / 100;

              //calculate the duration it takes by hour and minute

              duration_data = data.routes[0].duration;
              if (duration_data >= 3600) {
                duration =
                  Math.round((duration_data / 3600) * 100) / 100 + "hr";
              } else {
                duration = Math.trunc(duration_data / 60) + "min";
              }

              //Number of seats

              const btn = document.querySelector(".order-2");
              const radioButtons = document.querySelectorAll(
                'input[name="seatNumber"]'
              );
              for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                  seats = radioButton.value;
                  break;
                }
              }
              // set Confirm page infos

              document.getElementById("distance").value = distance_value;
              document.getElementById("duration").innerHTML = duration;
              document.getElementById("startselect").innerHTML =
                setStartingPoint;
              document.getElementById("endselect").innerHTML = setEndingPoint;
              document.getElementById("pick_up_info").value = setStartingPoint;
              document.getElementById("drop_off_info").value = setEndingPoint;
              document.getElementById("seats_info").value = seats;
              document.getElementById("duration_info").value = duration;

              // user_name:username,
              // pick_place:pick_up_info,
              // drop_place:drop_off_info,
              // seat_number:seat_info,
              // car_type:car_type_info,
              // paid_money:balance_info,
              // driver_name:String,
              // trip_time:String
            });
        });
    });

  /// btn for calculating the balance using the sedan car or any car

  const btn_sedan = document.getElementById("sedan_car");
  btn_sedan.addEventListener("click", () => {
    Car_type = "any car";
    const distance = document.getElementById("distance").value;
    balance = (distance * 3).toFixed(2) + "Birr";
    document.getElementById("balance").innerHTML = balance;
    document.getElementById("car_type_info").value = Car_type;
    document.getElementById("balance_info").value = balance;
  });

  const btn_eng = document.getElementById("eng_car");
  btn_eng.addEventListener("click", () => {
    Car_type = "Any car + Eng speaker";
    const distance = document.getElementById("distance").value;
    balance = (distance * 4).toFixed(2) + "Birr";
    document.getElementById("balance").innerHTML = balance;
    document.getElementById("car_type_info").value = Car_type;
    document.getElementById("balance_info").value = balance;
  });

  const btn_minivan = document.getElementById("minivan_car");
  btn_minivan.addEventListener("click", () => {
    Car_type = "Mini Van car";
    distance = document.getElementById("distance").value;
    balance = (distance * 3.5).toFixed(2) + "Birr";
    document.getElementById("balance").innerHTML = balance;
    document.getElementById("car_type_info").value = Car_type;
    document.getElementById("balance_info").value = balance;
  });
}

// to select Driver

function DriverSelected() {
  const driver_name = document.getElementById("driver").innerText;
  document.getElementById("Driver_Name").value = driver_name;
}

// Function to continue to the Confirm page

function ToConfirmPage() {
  map.flyTo({ center: [lat, long] });
  Select_car.style.visibility = "hidden";
  Confirm_ride.style.visibility = "visible";
  Create_trip.style.visibility = "hidden";
  touring.style.display = "none";

  // Data for the Created Drivers

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          DriverName: "Esrael Sisay",
          DriverPhoto: 1,
          PlateNo: "A53231",
          PhoneNo: "0912234112",
        },
        geometry: {
          type: "Point",
          coordinates: [38.72496, 9.03382],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Sisay Lema",
          DriverPhoto: 2,
          PlateNo: "A66231",
          PhoneNo: "0945234112",
        },
        geometry: {
          type: "Point",
          coordinates: [38.73221, 9.03396],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Tolera kebede",
          DriverPhoto: 3,
          PlateNo: "B21231",
          PhoneNo: "0991234131",
        },
        geometry: {
          type: "Point",
          coordinates: [38.83981, 9.03712],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Siifan Teshale",
          DriverPhoto: 4,
          PlateNo: "B54231",
          PhoneNo: "0932234131",
        },
        geometry: {
          type: "Point",
          coordinates: [36.54612, 9.08817],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Sayido Ahmed",
          DriverPhoto: 5,
          PlateNo: "A21231",
          PhoneNo: "0934234131",
        },
        geometry: {
          type: "Point",
          coordinates: [38.76179, 9.0607],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Chala keba",
          DriverPhoto: 6,
          PlateNo: "A52231",
          PhoneNo: "0923234131",
        },
        geometry: {
          type: "Point",
          coordinates: [38.74915, 9.03611],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Naftanan Hunde",
          DriverPhoto: 7,
          PlateNo: "B11231",
          PhoneNo: "0991234131",
        },
        geometry: {
          type: "Point",
          coordinates: [38.75101, 9.05405],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Dawud Abate",
          DriverPhoto: 8,
          PlateNo: "B54231",
          PhoneNo: "0943234131",
        },
        geometry: {
          type: "Point",
          coordinates: [38.74814, 9.06059],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Yosef Edilu",
          DriverPhoto: 9,
          PlateNo: "A51231",
          PhoneNo: "0919234131",
        },
        geometry: {
          type: "Point",
          coordinates: [38.75863, 9.00724],
        },
      },
      {
        type: "Feature",
        properties: {
          DriverName: "Abiy kasa",
          DriverPhoto: 10,
          PlateNo: "A23231",
          PhoneNo: "0971234131",
        },
        geometry: {
          type: "Point",
          coordinates: [38.72981, 9.01959],
        },
      },
    ],
  };

  // add markers to map

  for (const feature of geojson.features) {
    // create a HTML element for each feature

    const DriverPhoto = feature.properties.DriverPhoto;
    const el = document.createElement("div");
    el.className = "marker";

    // make a marker for each feature and add to the map
    new mapboxgl.Marker(el)
      .setLngLat(feature.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({
          offset: 25,
        }) // add popups
          .setHTML(
            `<h3 id='driver' ><img class="profile" src="./Images/Drivers/Driver ${DriverPhoto}.jpg" width="20%">${feature.properties.DriverName}</h3><p>Phone No. ${feature.properties.PhoneNo}</p><p>Plate No. ${feature.properties.PlateNo}</p>
                    <button class="select_driver_btn" onClick="DriverSelected()" >Select</button>`
          )
      )
      .addTo(map);
  }

  // Get Current Date and Time

  // var today = new Date();
  // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  // var dateTime = date+' '+time;

  console.log(dateTime);
  console.log(lat);
  console.log(long);
  console.log(Car_type);
  console.log(balance);
  console.log(seats);
  console.log(setEndingPoint);
  console.log(setStartingPoint);
  console.log(duration);
  console.log(distance_value);
}

//payment function
