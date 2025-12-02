// import { useEffect, useRef, useState } from "react";
// import { useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet-routing-machine";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import "leaflet-control-geocoder/dist/Control.Geocoder.css";
// import * as Geocoder from "leaflet-control-geocoder";

// if (typeof window !== "undefined" && L.Control && !L.Control.Geocoder) {
//   L.Control.Geocoder = Geocoder;
// }

// function createNominatimGeocoder() {
//   return {
//     geocode: function (query, cb) {
//       fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`)
//         .then(res => res.json())
//         .then(results => {
//           const res = results.map(r => ({
//             name: r.display_name,
//             center: L.latLng(r.lat, r.lon),
//             bbox: r.boundingbox ? L.latLngBounds(
//               [r.boundingbox[0], r.boundingbox[2]],
//               [r.boundingbox[1], r.boundingbox[3]]
//             ) : null
//           }));
//           cb(res);
//         })
//         .catch(() => cb([]));
//     },

//     suggest: function (query, cb) {
//       // same endpoint for autocomplete
//       fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`)
//         .then(res => res.json())
//         .then(results => {
//           const res = results.map(r => ({
//             name: r.display_name,
//             center: L.latLng(r.lat, r.lon)
//           }));
//           cb(res);
//         })
//         .catch(() => cb([]));
//     },

//     options: {
//       serviceUrl: 'https://nominatim.openstreetmap.org/',
//       placeholder: 'Search location...'
//     }
//   };
// }

// export default function RoutingMachine() {
//   const map = useMap();

//   useEffect(() => {
//     if (!map) return;

//     const control = L.Routing.control({
//       router: L.Routing.osrmv1({
//         serviceUrl: "https://router.project-osrm.org/route/v1",
//       }),
//       geocoder: L.Control.Geocoder.photon({ // 🔥 Photon supports live suggestions!
//         serviceUrl: "https://photon.komoot.io/api/",
//       }),
//       routeWhileDragging: true,
//       showAlternatives: true,
//       addWaypoints: true,
//       position: "topleft",
//       lineOptions: {
//         styles: [{ color: "green", weight: 5 }],
//       },
//       altLineOptions: {
//         styles: [{ color: "gray", opacity: 0.6, weight: 4 }],
//       },
//       createMarker: (i, wp) => L.marker(wp.latLng, { draggable: true }),
//     }).addTo(map);

//     return () => map.removeControl(control);
//   }, [map]);

//   return null;
// }

import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import * as Geocoder from "leaflet-control-geocoder";

if (typeof window !== "undefined" && L.Control && !L.Control.Geocoder) {
  L.Control.Geocoder = Geocoder;
}

export default function RoutingMachine() {
  const map = useMap();
  const controlRef = useRef(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const startDropdownRef = useRef(null);
  const endDropdownRef = useRef(null);
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);

  // const fetchSuggestions = useCallback(async (query) => {
  //   if (!query) return [];
  //   try {
  //     const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`);
  //     const data = await res.json();
  //     return data.features.map(f => ({
  //       name: f.properties.name || f.properties.city || f.properties.street,
  //       latlng: L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0])
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching suggestions:", error);
  //     return [];
  //   }
  // }, []);
  
  const getCityFromMapCenter = useCallback(() => {
    const center = map.getCenter();
    const lat = center.lat;
    const lng = center.lng;
    // Approximate bounds for Münster: lat 51.8-52.1, lng 7.4-7.8
    if (lat >= 51.8 && lat <= 52.1 && lng >= 7.4 && lng <= 7.8) return 'Münster';
    // Approximate bounds for Osnabrück: lat 52.1-52.4, lng 7.9-8.2
    if (lat >= 52.1 && lat <= 52.4 && lng >= 7.9 && lng <= 8.2) return 'Osnabrück';
    return '';
  }, [map]);

  const fetchSuggestions = useCallback(async (query, bounds) => {
    if (!query) return [];
    try {
      const city = getCityFromMapCenter();
      const searchQuery = city ? `${query} ${city}` : query;
      let url = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5`;
      if (bounds) {
        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        url += `&bbox=${bbox}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      return data.features.map(f => ({
        name: f.properties.name || f.properties.city || f.properties.street,
        latlng: L.latLng(f.geometry.coordinates[1], f.geometry.coordinates[0])
      }));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  }, [getCityFromMapCenter]);

  const handleStartInputChange = useCallback(async (e) => {
    const value = e.target.value;
    setStartQuery(value);
    // if (!value.trim()) {
    //   setStartSuggestions([]);
    //   setShowStartDropdown(false);
    //   return;
    // }
    const suggestions = await fetchSuggestions(value);
    setStartSuggestions(suggestions);
    setShowStartDropdown(suggestions.length > 0);
  }, [fetchSuggestions, map]);

  const handleEndInputChange = useCallback(async (e) => {
    const value = e.target.value;
    setEndQuery(value);
    // if (!value.trim()) {
    //   setEndSuggestions([]);
    //   setShowEndDropdown(false);
    //   return;
    // }
    const suggestions = await fetchSuggestions(value);
    setEndSuggestions(suggestions);
    setShowEndDropdown(suggestions.length > 0);
  }, [fetchSuggestions, map]);

  const selectStartSuggestion = useCallback((suggestion) => {
    setStartQuery(suggestion.name);
    setShowStartDropdown(false);
    // setStartSuggestions([]);

    // if (startInputRef.current) {
    //   startInputRef.current.oninput = null;
    //   startInputRef.current.value = suggestion.name;

    //   setTimeout(() => {
    //     startInputRef.current.oninput = handleStartInputChange;
    //   }, 50);
    // }
    if (controlRef.current) {
      const currentWaypoints = controlRef.current.getWaypoints();
      currentWaypoints[0] = L.Routing.waypoint(suggestion.latlng);
      controlRef.current.setWaypoints(currentWaypoints);
    }
  }, []);

  const selectEndSuggestion = useCallback((suggestion) => {
    setEndQuery(suggestion.name);
    setShowEndDropdown(false);
    // setEndSuggestions([]);

    // if (endInputRef.current) {
    //   endInputRef.current.oninput = null;
    //   endInputRef.current.value = suggestion.name;

    //   setTimeout(() => {
    //     endInputRef.current.oninput = handleEndInputChange;
    //   }, 50);
    // }
    if (controlRef.current) {
      const currentWaypoints = controlRef.current.getWaypoints();
      currentWaypoints[1] = L.Routing.waypoint(suggestion.latlng);
      controlRef.current.setWaypoints(currentWaypoints);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    // // Create custom control for inputs below zoom
    // const customControl = L.control({ position: 'topleft' });
    // customControl.onAdd = function(map) {
    //   const container = L.DomUtil.create('div', 'custom-routing-control leaflet-control');
    //   const startDiv = L.DomUtil.create('div', 'routing-input-group', container);
    //   const startLabel = L.DomUtil.create('label', 'routing-label', startDiv);
    //   const startInput = L.DomUtil.create('input', 'routing-input', startDiv);
    //   const startDropdown = L.DomUtil.create('ul', 'routing-dropdown', startDiv);

    //   const endDiv = L.DomUtil.create('div', 'routing-input-group', container);
    //   const endLabel = L.DomUtil.create('label', 'routing-label', endDiv);
    //   const endInput = L.DomUtil.create('input', 'routing-input', endDiv);
    //   const endDropdown = L.DomUtil.create('ul', 'routing-dropdown', endDiv);
  

    //   // // Prevent map interactions when interacting with inputs
    //   L.DomEvent.disableClickPropagation(container);
    //   L.DomEvent.disableScrollPropagation(container);


    //   startLabel.textContent = 'Start:';
     
    //   startInput.type = 'text';
    //   startInput.placeholder = 'Enter start location';

    //   startInputRef.current = startInput;
    //   startInput.oninput = handleStartInputChange;

     
    //   startDropdownRef.current = startDropdown;

    //   endLabel.textContent = 'End:';

    //   endInput.type = 'text';
    //   endInput.placeholder = 'Enter end location';
      
    //   endInputRef.current = endInput;
    //   endInput.oninput = handleEndInputChange;

     
    //   endDropdownRef.current = endDropdown;

    //   return container;
    // };

    // Create custom control for inputs below zoom
    const customControl = L.control({ position: 'topleft' });
    customControl.onAdd = function(map) {
      const container = L.DomUtil.create('div', 'custom-routing-control leaflet-control');
      // const container = L.DomUtil.create(
      //                     'div',
      //                     'custom-routing-control leaflet-control p-2 sm:p-4 md:p-6 text-xs sm:text-sm md:text-base lg:text-lg bg-white rounded shadow-lg'
      //                   );


      // const W = window.innerWidth;

      // // Responsive dynamic width
      // if (W < 480) {
      //   container.style.width = '90vw';       // very small screens
      // } else if (W < 768) {
      //   container.style.width = '70vw';       // mobile
      // } else {
      //   container.style.width = '320px';      // desktop
      // }

      // Responsive padding & font
      // container.style.padding = W < 768 ? '4px' : W < 1100? '8px' : W > 1100 ? '10px' : '12px' ;
      // container.style.fontSize = W < 768 ? '10px' : W < 1100 ? '10px' : W > 1100 ? '16px' : '18px';

      container.style.background = 'white';
      container.style.padding = '10px';
      container.style.borderRadius = '5px';
      container.style.boxShadow = '0 1px 5px rgba(0,0,0,0.4)';
      // container.style.fontSize = '18px';
      container.style.marginTop = '20px'; // Position below zoom buttons
      container.style.boxSizing = 'border-box';
      container.style.zIndex = '9999';


      // Prevent map interactions when interacting with inputs
      L.DomEvent.disableClickPropagation(container);
      // L.DomEvent.disableScrollPropagation(container);

      const startDiv = L.DomUtil.create('div', '', container);
      startDiv.style.marginBottom = '10px';

      const startLabel = L.DomUtil.create('label', '', startDiv);
      startLabel.textContent = 'Start:';
      startLabel.style.display = 'block';
      startLabel.style.marginBottom = '2px';
      startLabel.style.fontWeight = 'bold';

      const startInput = L.DomUtil.create('input', '', startDiv);
      startInput.type = 'text';
      startInput.placeholder = 'Enter start location';
      startInput.style.width = '200px';
      startInput.style.boxSizing = 'border-box';
      startInputRef.current = startInput;
      startInput.oninput = handleStartInputChange;

      const startDropdown = L.DomUtil.create('ul', '', startDiv);
      startDropdown.style.listStyle = 'none';
      startDropdown.style.padding = '0';
      startDropdown.style.margin = '0';
      startDropdown.style.border = '1px solid #ccc';
      startDropdown.style.maxHeight = '150px';
      startDropdown.style.overflowY = 'auto';
      startDropdownRef.current = startDropdown;

      const endDiv = L.DomUtil.create('div', '', container);

      const endLabel = L.DomUtil.create('label', '', endDiv);
      endLabel.textContent = 'End:';
      endLabel.style.display = 'block';
      endLabel.style.marginBottom = '2px';
      endLabel.style.fontWeight = 'bold';

      const endInput = L.DomUtil.create('input', '', endDiv);
      endInput.type = 'text';
      endInput.placeholder = 'Enter end location';
      endInput.style.width = '200px';
      endInput.style.boxSizing = 'border-box';
      endInputRef.current = endInput;
      endInput.oninput = handleEndInputChange;

      const endDropdown = L.DomUtil.create('ul', '', endDiv);
      endDropdown.style.listStyle = 'none';
      endDropdown.style.padding = '0';
      endDropdown.style.margin = '0';
      endDropdown.style.border = '1px solid #ccc';
      endDropdown.style.maxHeight = '150px';
      endDropdown.style.overflowY = 'auto';
      endDropdownRef.current = endDropdown;

      return container;
    };

    customControl.addTo(map);

    const myIcon = L.icon({
      iconUrl: '/icons/marker-icon.png', 
      iconSize: [25, 41], 
      iconAnchor: [12, 41], 
      popupAnchor: [1, -34], 
    });

    const control = L.Routing.control({
      router: L.Routing.osrmv1({
        serviceUrl: "https://router.project-osrm.org/route/v1",
      }),
      geocoder: false, // Disable built-in geocoder
      routeWhileDragging: true,
      // showAlternatives: true,
      addWaypoints: true,
      position: "topleft",
      lineOptions: {
        styles: [{ color: "black", weight: 5, opacity: 0.9, dashArray: "10, 10" }],
      },
      // altLineOptions: {
      //   styles: [{ color: "gray", opacity: 0.6, weight: 4 }],
      // },
      createMarker: (i, wp) => L.marker(wp.latLng, { icon: myIcon, draggable: true }),
    }).addTo(map);

    controlRef.current = control;

    // Hide the routing container initially (itinerary and alternatives)
    const routingContainer = control.getContainer();
    routingContainer.style.display = 'none';

    // Show itinerary below custom inputs when routes are found
    control.on('routesfound', () => {
      routingContainer.style.display = 'block';
    });

    // control.on('routesfound', () => {
    //   routingContainer.style.display = 'block';
    //   routingContainer.style.fontSize = '17px'; // Increase font size for better readability
    //   routingContainer.style.width = '400px'; // Make the box wider to accommodate larger text
    //   routingContainer.style.padding = '12px'; // Add more padding to prevent congestion
    //   // Ensure all text inside is the same size by targeting specific elements
    //   // const summaryElements = routingContainer.querySelectorAll('.leaflet-routing-alt, .leaflet-routing-alt h2, .leaflet-routing-alt h3, .leaflet-routing-alt p, .leaflet-routing-alt div');
    //   // summaryElements.forEach(el => {
    //   //   el.style.fontSize = '14px';
    //   // });
    //   // const instructionElements = routingContainer.querySelectorAll('.leaflet-routing-container-hide, .leaflet-routing-container-hide p, .leaflet-routing-container-hide div, .leaflet-routing-instruction');
    //   // instructionElements.forEach(el => {
    //   //   el.style.fontSize = '14px';
    //   // });
    //   // Also apply to all child elements as a fallback
    //   const allElements = routingContainer.querySelectorAll('*');
    //   allElements.forEach(el => {
    //     el.style.fontSize = '14px';
    //   });
    // });

    return () => {
      map.removeControl(customControl);
      map.removeControl(control);
    };
  }, [map, handleStartInputChange, handleEndInputChange]);

  // Update DOM elements
  useEffect(() => {
    if (startInputRef.current) startInputRef.current.value = startQuery;
    if (endInputRef.current) endInputRef.current.value = endQuery;

    if (startDropdownRef.current) {
      startDropdownRef.current.innerHTML = '';
      if (showStartDropdown) {
        startSuggestions.forEach((suggestion) => {
          const li = document.createElement('li');
          li.textContent = suggestion.name;
          li.style.padding = '5px';
          li.style.cursor = 'pointer';
          li.style.borderBottom = '1px solid #eee';
          li.onclick = () => selectStartSuggestion(suggestion);
          startDropdownRef.current.appendChild(li);
        });
        startDropdownRef.current.style.display = 'block';
      } else {
        startDropdownRef.current.style.display = 'none';
      }
    }

    if (endDropdownRef.current) {
      endDropdownRef.current.innerHTML = '';
      if (showEndDropdown) {
        endSuggestions.forEach((suggestion) => {
          const li = document.createElement('li');
          li.textContent = suggestion.name;
          li.style.padding = '5px';
          li.style.cursor = 'pointer';
          li.style.borderBottom = '1px solid #eee';
          li.onclick = () => selectEndSuggestion(suggestion);
          endDropdownRef.current.appendChild(li);
        });
        endDropdownRef.current.style.display = 'block';
      } else {
        endDropdownRef.current.style.display = 'none';
      }
    }
  }, [startQuery, endQuery, startSuggestions, endSuggestions, showStartDropdown, showEndDropdown, selectStartSuggestion, selectEndSuggestion]);

  return null;
}
