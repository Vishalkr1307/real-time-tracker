const socket = io();

        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
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
            zoom: 2,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Object to hold markers for each user
        var markers = {};

        // Listen for location updates from other users
        socket.on("receive-location", (val) => {
            const { id, data } = val;

            // If the user already has a marker, update its position
            if (markers[id]) {
                markers[id].setLatLng([data.latitude, data.longitude]);
            } else {
                // Otherwise, create a new marker for the user
                markers[id] = L.marker([data.latitude, data.longitude]).addTo(map);
            }

            // Optionally, you can set the view to the latest user's location
            map.setView([data.latitude, data.longitude], 16);
        });

        // Remove marker when a user disconnects
        socket.on("user-disconnect", (id) => {
            if (markers[id]) {
                map.removeLayer(markers[id]);
                delete markers[id];
            }
        });