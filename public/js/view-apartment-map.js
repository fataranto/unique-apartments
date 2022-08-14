var map = L.map('map').setView([ <%= apartment.location.lat %> , <%= apartment.location.long %> ], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([ <%= apartment.location.lat %> , <%= apartment.location.long %> ]).addTo(map)
      .bindPopup('<%=apartment.title%>')
      .openPopup();
    map.flyTo([ <%= apartment.location.lat %> , <%= apartment.location.long %> ], 15);