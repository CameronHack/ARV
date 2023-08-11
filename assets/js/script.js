let flightDataArray = [];
let drivingDataArray = [];
let flightNumber = document.querySelector('#flight-number')
let flightStatus = document.querySelector('#flight-status')
let flightInfo = document.querySelector('#flight-info-items');
let mapImg = document.querySelector('#map')
let inputArea = document.querySelector('#input-area');
let yourAddressInput = document.querySelector('#your-address');
let flightIdInput = document.querySelector('#flight-id');
let userAddress;
let userFlightId;
let arrivalAirport = '';
let drivingOptions = '';
let drivingArrayLength = '';
let drivingDuration = '';
let drivingListObjs = [];
const previousUserFlightId = JSON.parse(localStorage.getItem('previousUserFlightId')) || [];
const previousUserAddress = JSON.parse(localStorage.getItem('previousUserAddress')) || [];
const flightIdDropdown = document.querySelector('#flight-id-dropdown');
const yourAddressDropdown = document.querySelector('#your-address-dropdown');

let arvInfo = document.querySelector('#arv-info');
let flightContainer = document.querySelector('#flight-container');
let drivingDirections = document.querySelector('#driving-directions');


let dataTempArray = 'temp';


//live flights for experimentation are available at :
//https://flightaware.com/live/
//click any plane to be taken to the flight specific info and use the icao # in the parameter below. IATA # is 2 letter airline code + 3-5 digit flight code. Usually first thing that pops up under the name of the aircraft at the top of the page. 

//Init Scripts
// for appending on page start
updatePreviousSearch();

//Event Listeners
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
        fetchFlightData(); 
    }
} );

// input area event listener to grab address and flight id values
inputArea.addEventListener("click", function(e){

    if(e.target.matches("button")) {

        userAddress = yourAddressInput.value;
        userFlightId = flightIdInput.value;


    const regex = /^[A-Z]{2}[0-9]{1,9}/i;
        if (regex.test(userFlightId) == true)  {

            fetchFlightData();

            inputToLocal();
        arvInfo.classList.add('hidden')
        flightContainer.classList.remove('hidden')
        drivingDirections.classList.remove('hidden')
        } else {
            syntaxErrorModal();
        }
    }
    
});

function syntaxErrorModal() {
    let syntaxModal = new bootstrap.Modal(document.getElementById('syntax-modal'));
    syntaxModal.toggle();
}

function noFlightErrorModal() {
    let noFlightModal = new bootstrap.Modal(document.getElementById('no-flight-modal'));
    noFlightModal.toggle();
}

// dropdown listeners for the li text
flightIdDropdown.addEventListener("click", function(e){

    if(e.target.matches("li")) {
        flightIdInput.value = e.target.textContent;
    };

})

yourAddressDropdown.addEventListener("click", function(e){

    if(e.target.matches("li")) {
        yourAddressInput.value = e.target.textContent;
    };

})


//Functions

// push user input to local storage
function inputToLocal() {
    
    if (previousUserFlightId.every(e => e !== userFlightId) && userFlightId !== ''){
        previousUserFlightId.push(userFlightId);
        localStorage.setItem('previousUserFlightId', JSON.stringify(previousUserFlightId));
        updatePreviousSearch();
    };

    if (previousUserAddress.every(e => e !== userAddress) && userAddress !== ''){
        previousUserAddress.push(userAddress);
        localStorage.setItem('previousUserAddress', JSON.stringify(previousUserAddress));
        updatePreviousSearch();
    };
}

function fetchFlightData() {
    fetch(`https://airlabs.co/api/v9/flight?flight_iata=${userFlightId}&api_key=dbe4e249-ef48-4be4-8830-807c12e0b8a7`) 
        .then(function (response) {
            return response.json();
        })
        .then(function (flightData) {
                flightDataArray = [flightData];


            if ("error" in flightDataArray[0]) {
                noFlightErrorModal();
            } else {



                localStorage.setItem("flightDataArray", JSON.stringify(flightDataArray));
                arrivalAirport = flightDataArray[0].response.arr_name;

                flightNumber.textContent = `${flightDataArray[0].response.airline_name} Flight ${flightDataArray[0].response.flight_iata}` 
                flightStatus.textContent = `Status: ${flightDataArray[0].response.status}`
                
                let depLi = document.createElement('li')
                if (flightDataArray[0].response.dep_terminal === null) {
                    flightDataArray[0].response.dep_terminal = 'Not available'
                }
                if (flightDataArray[0].response.dep_gate === null) {
                    flightDataArray[0].response.dep_gate = 'Not available'
                }
                depLi.innerHTML = `Departure Airport: ${flightDataArray[0].response.dep_iata} <br>
                ${flightDataArray[0].response.dep_name} <br>
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
                arrLi.innerHTML = `Arrival Airport: ${flightDataArray[0].response.arr_iata}<br>
                ${flightDataArray[0].response.arr_name}<br>
                Terminal: ${flightDataArray[0].response.arr_terminal}<br>
                arrives at gate: ${flightDataArray[0].response.arr_gate}<br>
                at ${moment(flightDataArray[0].response.arr_time).format('hh:mma')}
                `
                flightInfo.innerHTML = ''
                flightInfo.appendChild(depLi)
                flightInfo.appendChild(arrLi)


            
                //add loading message
                fetch(`https://dev.virtualearth.net/REST/V1/Routes?wp.0=${userAddress}&wp.1=${arrivalAirport}&optmz=timeWithTraffic&distanceUnit=mi&key=AuK56x9YJioKqH6RY_xyTqLk6mx6eSnlwDmhJObeAmjjPlXOszBeN6id5zaWKSd2` + drivingOptions) 
                .then(function (response) {
                    return response.json();
                })
                .then(function (drivingData) {
                drivingDataArray = [drivingData];
                drivingListObjs = document.getElementsByClassName("list-class");
                let drivingListContainer = document.querySelector("#list-container");
                if (drivingListObjs.length > 0) {                
                    for (let i = 0; i < drivingListObjs.length; i++) {
                        drivingListObjs[0].remove();
                    }
                    if (typeof drivingDuration !== null) { 
                        drivingDuration.remove();
                    }
                    drivingListContainer.remove();
                }
                    if (drivingDataArray[0].resourceSets.length > 0) {
                        renderDirections();
                    } else {
                        renderErrorMessage();
                    }

                let mapScript = document.createElement('script');
                mapScript.setAttribute('type', 'text/javascript');
                mapScript.setAttribute('src', 'https://www.bing.com/api/maps/mapcontrol?callback=GetMap');
                mapScript.setAttribute('async', "");
                mapScript.setAttribute('defer', "");
                document.head.appendChild(mapScript);

                })
            }
        })
};

function GetMap()
    {
        var map = new Microsoft.Maps.Map('#myMap', {
            credentials: 'AuK56x9YJioKqH6RY_xyTqLk6mx6eSnlwDmhJObeAmjjPlXOszBeN6id5zaWKSd2',
            center: new Microsoft.Maps.Location(51.50632, -0.12714),
            mapTypeId: Microsoft.Maps.MapTypeId.aerial,
            disableMapTypeSelectorMouseOver:true,
            disableKeyboardInput:true,
            showDashboard:false,
            liteMode:true,
            zoom: 10
        });

        //Load the directions module.
        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
            //Create an instance of the directions manager.
            directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);
            directionsManager.setRequestOptions({maxRoutes:1, routeDraggable: false})
            directionsManager.setRenderOptions({autoDisplayDisambiguation: false, 
                autoUpdateMapView: true, displayManeuverIcons: false, displayRouteSelector: false, displayStepWarnings: false
            });
            //Create waypoints to route between.
            var firstWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: userAddress });
            directionsManager.addWaypoint(firstWaypoint);

            var secondWaypoint = new Microsoft.Maps.Directions.Waypoint({ address: flightDataArray[0].response.arr_name});
            directionsManager.addWaypoint(secondWaypoint);
            
            //Calculate directions.
            directionsManager.calculateDirections();

            dataTempArray = directionsManager.getCurrentRoute();
        });
    };

function renderDirections() {
    let directionsContainer = document.querySelector(".driving-directions");
    //create element
    let drivingList = document.createElement("ol");   
    drivingList.className = "container-class";
    drivingList.id = "list-container";
    //add text value
    drivingList.value = 'test';
    //append to page
    directionsContainer.appendChild(drivingList); 
    let drivingArrayLength = drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems.length;
    for (let i = 0; i < 3; i++) {
        
        //create element
        let newListItem = document.createElement("li");
        let newSubheading = document.createElement("div");
        //add text value
        newListItem.className = "list-class"
        newListItem.textContent = drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].instruction.text;
        newSubheading.textContent = (drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].travelDistance).toFixed(2) + 'mi';
        //append to page
        if ("hints" in drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i]) {
            let newHintItem = document.createElement("p");
            newHintItem.className = "hint-item";
            newHintItem.textContent = "Hint: " + drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].hints[0].text;
            newSubheading.appendChild(newHintItem);
        };

        //check for warnings
        // drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].warnings[0].text
        if ("warnings" in drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i]) {
            let newWarningItem = document.createElement("p");
            newWarningItem.className = "warning-item";
            newWarningItem.textContent = "Heads Up: " + drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].warnings[0].text;
            newSubheading.appendChild(newWarningItem);
        };

        newListItem.appendChild(newSubheading); 
        drivingList.appendChild(newListItem); 
    }

    let newHideButton = document.createElement("p");
    newHideButton.id = "hide-button";
    newHideButton.textContent = "Click Here to Expand";
    drivingList.appendChild(newHideButton); 


    

    newHideButton.addEventListener("click", function() {

        newHideButton.remove();
        for (let i = 3; i < drivingArrayLength; i++) {
            
            //create element
            let newListItem = document.createElement("li");
            let newSubheading = document.createElement("div");
            //add text value
            newListItem.className = "list-class hidden-text"
            newListItem.textContent = drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].instruction.text;
            newSubheading.textContent = (drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].travelDistance).toFixed(2) + 'mi';
            //append to page
            if ("hints" in drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i]) {
                let newHintItem = document.createElement("p");
                newHintItem.className = "hint-item";
                newHintItem.textContent = "Hint: " + drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].hints[0].text;
                newSubheading.appendChild(newHintItem);
            };
            if ("warnings" in drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i]) {
                let newWarningItem = document.createElement("p");
                newWarningItem.className = "warning-item";
                newWarningItem.textContent = "Alert: " + drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].warnings[0].text;
                newSubheading.appendChild(newWarningItem);
            };

            //check for warnings
            //drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i].warnings[0].text

            newListItem.appendChild(newSubheading); 
            drivingList.appendChild(newListItem); 
        }
    });

    //calculate the amount of time it takes to drive to airport
    let drivingSeconds = drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].travelDuration
    let drivingHours = Math.floor(drivingSeconds / 3600);
    let drivingMinutes = Math.round(drivingSeconds - drivingHours * 3600);
    drivingMinutes = Math.round(drivingMinutes / 60);
    
    let driverDepLi = document.createElement('li')         
    driverDepLi.innerHTML = `Leave at: ${moment((moment(flightDataArray[0].response.arr_time, 'YYYY-MM-DD HH:mm').unix()+(10*60)-drivingSeconds)*1000).format('hh:mma')} <br>
            Total driving time: ${drivingHours} hours, ${drivingMinutes} minutes <br>
            Arriving at ${moment((moment(flightDataArray[0].response.arr_time, 'YYYY-MM-DD HH:mm').unix()+(10*60))*1000).format('hh:mma')} (~10 minutes after flight lands)`              
    flightInfo.appendChild(driverDepLi)

    // display time spent driving
    drivingDuration = document.createElement("p");
    drivingDuration.textContent = "Total Driving Time: " + drivingHours + " hours, " + drivingMinutes + " minutes"
    directionsContainer.appendChild(drivingDuration);



//drivingDataArray[0].resourceSets[0].resources[0].routeLegs[0].itineraryItems[i]
}

function renderErrorMessage() {
    let directionsContainer = document.querySelector(".driving-directions");
    //create element
    let drivingList = document.createElement("p");     //ordered list needs styling with numbers
    drivingList.className = "container-class";
    drivingList.id = "list-container";
    //add text value
    drivingList.textContent = 'Sorry! We are currently unable to search with parameters due to a server error!';
    //append to page
    directionsContainer.appendChild(drivingList); 
    drivingOptions = '';
    document.getElementById('avoid-tolls').checked = false;
    document.getElementById('avoid-highways').checked = false;
    fetchFlightData();
}

// appends li from local storage
function updatePreviousSearch() {

    yourAddressDropdown.innerHTML = '';

    for (let i = 0; i < previousUserAddress.length; i++) {
    
        const previousSearchLi = document.createElement('li');
    
        previousSearchLi.textContent = previousUserAddress[i];
        previousSearchLi.setAttribute('class', "dropdown-item");
    
        yourAddressDropdown.append(previousSearchLi);
    
    }

    flightIdDropdown.innerHTML = '';

    for (let i = 0; i < previousUserFlightId.length; i++) {
    
        const previousSearchLi = document.createElement('li');
    
        previousSearchLi.textContent = previousUserFlightId[i];
        previousSearchLi.setAttribute('class', "dropdown-item");
    
        flightIdDropdown.append(previousSearchLi);
    
    }

}

