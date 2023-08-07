let flightDataArray = [];
let drivingDataArray = [];

//live flights for experimentation are available at :
//https://flightaware.com/live/
//click any plain to be taken to the flight specific info and use the icao # in the parameter below. ICAO # is 3 letter airline code + 3-5 digit flight code. Usually first thing that pops up under the name of the aircraft at the top of the page. 

function fetchFlightData() {
    fetch('https://airlabs.co/api/v9/flight?flight_iata=SY1776&api_key=d8da3920-43a6-4206-b47b-26ea2c037a69') 
        .then(function (response) {
            return response.json();
        })
        .then(function (flightData) {
                flightDataArray = [flightData];
                localStorage.setItem("flightDataArray", JSON.stringify(flightDataArray));
        })
        };

        
let submitButton = document.querySelector("#submit-button");
submitButton.addEventListener("click", function() {
    fetchFlightData();
});



let logButton = document.querySelector("#log-button");
logButton.addEventListener("click", function() {
    let loggedData = JSON.parse(localStorage.getItem("flightDataArray"))
    console.log(loggedData);
});


//you can enter 2 locations under the wp.0 and wp.1 parameters below. Acceptable location type are available at: 
//https://learn.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/location-and-area-types

function fetchDrivingData() {
    fetch('http://dev.virtualearth.net/REST/V1/Routes?wp.0=1086_Church_St,Abington,PA19001&wp.1=1407_Edgewood_Ave,Roslyn,PA19001&optmz=timeWithTraffic&key=AuK56x9YJioKqH6RY_xyTqLk6mx6eSnlwDmhJObeAmjjPlXOszBeN6id5zaWKSd2') 
        .then(function (response) {
            return response.json();
        })
        .then(function (drivingData) {
                drivingDataArray = [drivingData];
                localStorage.setItem("drivingDataArray", JSON.stringify(drivingDataArray));
        })
        };

        
let submitButton2 = document.querySelector("#submit-button-two");
submitButton2.addEventListener("click", function() {
    fetchDrivingData();
    
    
});



let logButton2 = document.querySelector("#log-button-two");
logButton2.addEventListener("click", function() {
    let loggedData2 = JSON.parse(localStorage.getItem("drivingDataArray"))
    console.log(loggedData2);
});



///array for driving data

//drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].instruction.text

//create module that pulls from user's initial starting point and creates driving route

//pull in input for user's home address

//pull in input for airport based on user's flight ingo