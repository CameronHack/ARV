let flightDataArray = [];
let drivingDataArray = [];
let tempVar1 = document.querySelector('#temp-var-1');
let flightNumber = document.querySelector('#flight-number')
let flightStatus = document.querySelector('#flight-status')
let flightInfo = document.querySelector('#flight-info-items');
let inputArea = document.querySelector('#input-area');
let yourAddressInput = document.querySelector('#your-address');
let flightIdInput = document.querySelector('#flight-id');
let userAddress;
let userFlightId;

let drivingOptions = '';

//live flights for experimentation are available at :
//https://flightaware.com/live/
//click any plane to be taken to the flight specific info and use the icao # in the parameter below. IATA # is 2 letter airline code + 3-5 digit flight code. Usually first thing that pops up under the name of the aircraft at the top of the page. 

// airline name, iata number, status, dep city, dep airport code, dep terminal, dep gate, dep time, arr city, arr airport code, arr terminal, arr gate, arr time

function fetchFlightData() {
    fetch(`https://airlabs.co/api/v9/flight?flight_iata=${userFlightId}&api_key=d8da3920-43a6-4206-b47b-26ea2c037a69`) 
        .then(function (response) {
            return response.json();
        })
        .then(function (flightData) {
                flightDataArray = [flightData];

                console.log(flightDataArray)
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
            flightNumber.textContent = `${flightDataArray[0].response.airline_name} Flight ${flightDataArray[0].response.flight_iata}` 
            flightStatus.textContent = `Status: ${flightDataArray[0].response.status}`
            let depLi = document.createElement('li')
            if (flightDataArray[0].response.dep_terminal === null) {
                flightDataArray[0].response.dep_terminal = 'Not available'
            }
            if (flightDataArray[0].response.dep_gate === null) {
                flightDataArray[0].response.dep_gate = 'Not available'
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
            if (flightDataArray[0].response.arr_gate === null) {
                flightDataArray[0].response.arr_gate = 'Not available'
            }
            arrLi.innerHTML = `${flightDataArray[0].response.arr_iata}<br>
            ${flightDataArray[0].response.arr_city}<br>
            Terminal: ${flightDataArray[0].response.arr_terminal}<br>
            arrives at gate: ${flightDataArray[0].response.arr_gate}<br>
            at ${moment(flightDataArray[0].response.arr_time).format('hh:mma')}
            `
            flightInfo.appendChild(depLi)
            flightInfo.appendChild(arrLi)



        })
        };

        
let submitButton = document.querySelector("#submit-button");
submitButton.addEventListener("click", function() {
    fetchFlightData();
});



//you can enter 2 locations under the wp.0 and wp.1 parameters below. Acceptable location type are available at: 
//https://learn.microsoft.com/en-us/bingmaps/rest-services/common-parameters-and-types/location-and-area-types

function fetchDrivingData() {
    let drivingListObjs = document.getElementsByClassName("list-class");
    
    if (drivingListObjs.length > 0) {
        drivingListObjs[0].parentElement().remove();
        for (let i = 0; i < drivingListObjs.length; i++) {
            drivingListObjs[i].remove();
        }
    }



    fetch('http://dev.virtualearth.net/REST/V1/Routes?wp.0=1086_Church_St,Abington,PA19001&wp.1=OceanCity,MD&optmz=timeWithTraffic&distanceUnit=mi&key=AuK56x9YJioKqH6RY_xyTqLk6mx6eSnlwDmhJObeAmjjPlXOszBeN6id5zaWKSd2' + drivingOptions) 
        .then(function (response) {
            return response.json();
        })
        .then(function (drivingData) {
                drivingDataArray = [drivingData];
                renderDirections();
        })
        };

        
let submitButton2 = document.querySelector("#submit-button-two");
submitButton2.addEventListener("click", function() {
    fetchDrivingData();
});


drivingOptionsListener = addEventListener("change", function() {

    if ((document.getElementById('avoid-tolls').checked) && !(document.getElementById('avoid-highways').checked)) {
        drivingOptions = '&avoid=tolls';
    } else if (!(document.getElementById('avoid-tolls').checked) && (document.getElementById('avoid-highways').checked)) {
        drivingOptions = '&avoid=highways';
    } else if ((document.getElementById('avoid-tolls').checked) && (document.getElementById('avoid-highways').checked)) {
        drivingOptions = '&avoid=tolls,highways';
    } else {
        drivingOptions = '';
    }
    if (document.getElementsByClassName("list-class").length != 0) {
        fetchDrivingData(); 
    }
} );



//pull in input for user's home address

//options for driving directions


function renderDirections() {
    let directionsContainer = document.querySelector(".driving-directions");
    //create element
    let drivingList = document.createElement("ol");     //ordered list needs styling with numbers
    drivingList.className = "container-class"
    //add text value
    drivingList.value = 'test';
    //append to page
    directionsContainer.appendChild(drivingList); 
    let test = drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems.length;

    for (let i = 0; i < test; i++) {
        
        //create element
        let newListItem = document.createElement("li");
        let newSubheading = document.createElement("div");
        //add text value
        newListItem.className = "list-class"
        newListItem.textContent = drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].instruction.text;
        newSubheading.textContent = (drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].travelDistance).toFixed(2) + 'mi';
        //append to page
        if ((drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].hints !== undefined)) {
            let newHintItem = document.createElement("p");
            newHintItem.textContent = "Hint: " + drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems.length-1].hints[0].text;
            newSubheading.appendChild(newHintItem);
        };
        newListItem.appendChild(newSubheading); 
        drivingList.appendChild(newListItem); 
    }

    //calculate the amount of time it takes to drive to airport
    let drivingSeconds = drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].travelDuration
    let drivingHours = Math.round(drivingSeconds / 3600);
    let drivingMinutes = Math.round(drivingSeconds - drivingHours * 3600);
    drivingMinutes = Math.round(drivingMinutes / 60);

    //display time spent driving
    let drivingDuration = document.createElement("p");
    drivingDuration.textContent = "Total Driving Time: " + drivingHours + " hours, " + drivingMinutes + " minutes"
    directionsContainer.appendChild(drivingDuration);


    //add departure and arrival time and beginning and end of list


//drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i]
}



// input field variables

// input area event listener to grab address and flight id values
inputArea.addEventListener("click", function(e){

    if(e.target.matches("button")) {

        console.log(yourAddressInput.value)
        console.log(flightIdInput.value)

        userAddress = yourAddressInput.value
        userFlightId = flightIdInput.value

        fetchFlightData()

        inputToLocal()
        
    }
    
})


let previousUserFlightId = JSON.parse(localStorage.getItem('previousUserFlightId')) || []
let previousUserAddress = JSON.parse(localStorage.getItem('previousUserAddress')) || []
const flightIdDropdown = document.querySelector('#flight-id-dropdown')

function inputToLocal() {

    console.log('USER ADDRESS: ' + userAddress)
    console.log('USER FLIGHT ID: ' + userFlightId)
    
    if (previousUserFlightId.every(e => e !== userFlightId)){
        previousUserFlightId.push(userFlightId)
        localStorage.setItem('previousUserFlightId', JSON.stringify(previousUserFlightId))
        updatePreviousSearch()
    };

    if (previousUserAddress.every(e => e !== userAddress)){
        previousUserAddress.push(userAddress)
        localStorage.setItem('previousUserAddress', JSON.stringify(previousUserAddress))
        updatePreviousSearch()
    };
}

updatePreviousSearch()

function updatePreviousSearch() {

    flightIdDropdown.innerHTML = '';

    for (let i = 0; i < previousUserFlightId.length; i++) {
    
        const previousSearchLi = document.createElement('li')
    
        previousSearchLi.textContent = previousUserFlightId[i]
        previousSearchLi.setAttribute('class', "dropdown-item")
    
        flightIdDropdown.append(previousSearchLi)
    
    };

    // for (let i = 0; i < previousUserFlightId.length; i++) {
    
    //     const previousSearchLi = document.createElement('li')
    
    //     previousSearchLi.textContent = previousUserFlightId[i]
    //     previousSearchLi.setAttribute('class', "dropdown-item")
    
    //     flightIdDropdown.append(previousSearchLi)
    
    // };
}
