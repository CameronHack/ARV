let flightDataArray = [];
let drivingDataArray = [];
let tempVar1 = document.querySelector('#temp-var-1');
let tempVar2 = document.querySelector('#flight-number')
let tempVar3 = document.querySelector('#flight-status')
let tempVar4 = document.querySelector('#flight-info-items');

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
            tempVar2.textContent = `${flightDataArray[0].response.airline_name} Flight ${flightDataArray[0].response.flight_iata}` 
            tempVar3.textContent = `Status: ${flightDataArray[0].response.status}`
            let depLi = document.createElement('li')
            if (flightDataArray[0].response.dep_terminal === null) {
                flightDataArray[0].response.dep_terminal = 'Not available'
            }
            depLi.innerHTML = `${flightDataArray[0].response.dep_iata} <br>
            ${flightDataArray[0].response.dep_city} <br>
            Terminal: ${flightDataArray[0].response.dep_terminal} <br>
            left from gate: ${flightDataArray[0].response.dep_gate} <br>
            at ${moment(flightDataArray[0].response.dep_time).format('hh:mma')}
            `
            let arrLi = document.createElement('li')
            if (flightDataArray[0].response.arr_terminal === null) {
                flightDataArray[0].response.arr_terminal = 'Not available'
            }
            arrLi.innerHTML = `${flightDataArray[0].response.arr_iata}<br>
            ${flightDataArray[0].response.arr_city}<br>
            Terminal: ${flightDataArray[0].response.arr_terminal}<br>
            arrives at gate: ${flightDataArray[0].response.arr_gate}<br>
            at ${moment(flightDataArray[0].response.arr_time).format('hh:mma')}
            `
            tempVar4.appendChild(depLi)
            tempVar4.appendChild(arrLi)


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

// input field variables
const inputArea = document.querySelector('#input-area');
const yourAddressInput = document.querySelector('#your-address');
const flightIdInput = document.querySelector('#flight-id');
let userAddress;
let userFlightId;

// input area event listener to grab address and flight id values
inputArea.addEventListener("click", function(e){

    if(e.target.matches("button")) {

        console.log(yourAddressInput.value)
        console.log(flightIdInput.value)

        userAddress = yourAddressInput.value
        userFlightId = flightIdInput.value

    }

})
