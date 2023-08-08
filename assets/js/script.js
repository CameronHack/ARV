let flightDataArray = [];
let drivingDataArray = [];

let drivingOptions = '';

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



    fetch('http://dev.virtualearth.net/REST/V1/Routes?wp.0=1086_Church_St,Abington,PA19001&wp.1=1407_Edgewood_Ave,Roslyn,PA19001&optmz=timeWithTraffic&distanceUnit=mi&key=AuK56x9YJioKqH6RY_xyTqLk6mx6eSnlwDmhJObeAmjjPlXOszBeN6id5zaWKSd2' + drivingOptions) 
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




// 'http://dev.virtualearth.net/REST/V1/Routes?wp.0=1086_Church_St,Abington,PA19001&wp.1=1407_Edgewood_Ave,Roslyn,PA19001&optmz=timeWithTraffic&distanceUnit=mi&key=AuK56x9YJioKqH6RY_xyTqLk6mx6eSnlwDmhJObeAmjjPlXOszBeN6id5zaWKSd2'




///array for driving data

//drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].instruction.text

//create module that pulls from user's initial starting point and creates driving route

//pull in input for user's home address

//pull in input for airport based on user's flight ICAO #

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
        
        console.log(test);
        if ((drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].hints !== undefined)) {
            console.log('yes');
            let newHintItem = document.createElement("p");
            newHintItem.textContent = "Hint: " + drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems.length-1].hints[0].text;
            newSubheading.appendChild(newHintItem);
        };
        newListItem.appendChild(newSubheading); 
        drivingList.appendChild(newListItem); 
        
        //add 
        
//drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i]
    }
}


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

