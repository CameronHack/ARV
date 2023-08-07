let flightDataArray = [];
let drivingDataArray = [];
let tempVar1 = document.querySelector('#temp-var-1');
let tempVar2 = document.querySelector('#flight-info')
let tempVar3 = document.querySelector('#flight-info-items');

//live flights for experimentation are available at :
//https://flightaware.com/live/
//click any plain to be taken to the flight specific info and use the icao # in the parameter below. ICAO # is 3 letter airline code + 3-5 digit flight code. Usually first thing that pops up under the name of the aircraft at the top of the page. 

// airline name, iata number, status, dep city, dep airport code, dep terminal, dep gate, dep time, arr city, arr airport code, arr terminal, arr gate, arr time

function fetchFlightData() {
    fetch(`https://airlabs.co/api/v9/flight?flight_iata=${tempVar1.value}&api_key=d8da3920-43a6-4206-b47b-26ea2c037a69`) 
        .then(function (response) {
            return response.json();
        })
        .then(function (flightData) {
                flightDataArray = [flightData];
                localStorage.setItem("flightDataArray", JSON.stringify(flightDataArray));
                console.log(flightDataArray[0].response.airline_name)
            console.log(flightDataArray[0].response.flight_iata)
            console.log(flightDataArray[0].response.status)
            console.log(flightDataArray[0].response.dep_city)
            console.log(flightDataArray[0].response.dep_iata)
            console.log(flightDataArray[0].response.dep_terminal)
            console.log(flightDataArray[0].response.dep_gate)
            console.log(flightDataArray[0].response.dep_time)
            console.log(flightDataArray[0].response.arr_city)
            console.log(flightDataArray[0].response.arr_iata)
            console.log(flightDataArray[0].response.arr_terminal)
            console.log(flightDataArray[0].response.arr_gate)
            console.log(flightDataArray[0].response.arr_time)
            tempVar2.textContent = `${flightDataArray[0].response.airline_name}`
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