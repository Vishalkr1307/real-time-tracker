console.log("Starting");

const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
            
            socket.emit("send-location", { latitude, longitude });
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: false, 
            timeout: 10000, 
            maximumAge: 0,
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map", {
    center: [0, 0], 
    zoom: 13,
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var markers = {};
console.log(markers);


socket.on("receive-location", (val) => {
    const { id, data } = val;
    map.setView([data.latitude, data.longitude], 16);

    if (markers[id]) {
        markers[id].setLatLng([data.latitude, data.longitude]);
    } else {
        markers[id] = L.marker([data.latitude, data.longitude]).addTo(map);
    }
    
});

socket.on("user-disconnect",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id]
    }
})
