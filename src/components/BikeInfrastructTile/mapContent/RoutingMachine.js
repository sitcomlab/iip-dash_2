import { useCallback, useEffect, useRef, useState,useMemo } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import * as Geocoder from "leaflet-control-geocoder";
import { useRecoilValue } from 'recoil'; // NEW: For accessing weights
import { biWeightsState } from '@/components/RecoilContextProvider'; // NEW: Import weights state
// import LoadingSpinner from '@/components/Elements/LoadingSpinner'; // NEW: For loading indicator


if (typeof window !== "undefined" && L.Control && !L.Control.Geocoder) {
  L.Control.Geocoder = Geocoder;
}

const CustomOSRMv1 = L.Routing.OSRMv1.extend({
  buildRouteUrl: function (waypoints, options) {
    const baseUrl =
      L.Routing.OSRMv1.prototype.buildRouteUrl.call(this, waypoints, options);

    const w = this.options.weights || {};

    const infrastructureScore = Math.round(
      (w.infrastructure_quality ?? 0.4) * 100
    );
    const safetyScore = Math.round((w.safety ?? 0.3) * 100);
    const environmentalScore = Math.round(
      (w.environment_quality ?? 0.3) * 100
    );

    return (
      baseUrl +
      `&infrastructure_score=${infrastructureScore}` +
      `&safety_score=${safetyScore}` +
      `&environmental_score=${environmentalScore}`
    );
  },
});


export default function RoutingMachine() {
  const map = useMap();
  const controlRef = useRef(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const startDropdownRef = useRef(null);
  const endDropdownRef = useRef(null);
  const loadingOverlayRef = useRef(null); // NEW: Ref for loading overlay
  const [startQuery, setStartQuery] = useState("");
  const [endQuery, setEndQuery] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);
  const [isRouting, setIsRouting] = useState(false); // NEW: Loading state for routing
  const weights = useRecoilValue(biWeightsState);


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
    if (!value.trim()) {
      setStartSuggestions([]);
      setShowStartDropdown(false);
      return;
    }
    const suggestions = await fetchSuggestions(value);
    setStartSuggestions(suggestions);
    setShowStartDropdown(suggestions.length > 0);
  }, [fetchSuggestions, map]);

  const handleEndInputChange = useCallback(async (e) => {
    const value = e.target.value;
    setEndQuery(value);
    if (!value.trim()) {
      setEndSuggestions([]);
      setShowEndDropdown(false);
      return;
    }
    const suggestions = await fetchSuggestions(value);
    setEndSuggestions(suggestions);
    setShowEndDropdown(suggestions.length > 0);
  }, [fetchSuggestions, map]);

  const selectStartSuggestion = useCallback((suggestion) => {
    setStartQuery(suggestion.name);
    setShowStartDropdown(false);
    setStartSuggestions([]);

    if (startInputRef.current) {
      startInputRef.current.oninput = null;
      startInputRef.current.value = suggestion.name;

      setTimeout(() => {
        startInputRef.current.oninput = handleStartInputChange;
      }, 50);
    }
    if (controlRef.current) {
      const currentWaypoints = controlRef.current.getWaypoints();
      currentWaypoints[0] = L.Routing.waypoint(suggestion.latlng);
      controlRef.current.setWaypoints(currentWaypoints);
    }
  }, []);

  const selectEndSuggestion = useCallback((suggestion) => {
    setEndQuery(suggestion.name);
    setShowEndDropdown(false);
    setEndSuggestions([]);

    if (endInputRef.current) {
      endInputRef.current.oninput = null;
      endInputRef.current.value = suggestion.name;

      setTimeout(() => {
        endInputRef.current.oninput = handleEndInputChange;
      }, 50);
    }
    if (controlRef.current) {
      const currentWaypoints = controlRef.current.getWaypoints();
      currentWaypoints[1] = L.Routing.waypoint(suggestion.latlng);
      controlRef.current.setWaypoints(currentWaypoints);
    }
  }, []);

  useEffect(() => {
    if (!map) return;

    if (controlRef.current) {
      map.removeControl(controlRef.current);
    }

    // Create loading overlay
    const loadingOverlay = L.DomUtil.create('div', 'leaflet-loading-overlay');
    loadingOverlay.style.position = 'absolute';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    loadingOverlay.style.zIndex = '1000';
    loadingOverlay.style.display = 'none'; // Initially hidden
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.innerHTML = '<div class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-theme-green"><svg aria-hidden="true" class="w-8 h-8" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/></svg><span class="sr-only">Loading...</span></div>';
    loadingOverlayRef.current = loadingOverlay;
    map.getContainer().appendChild(loadingOverlay);

    // Create custom control for inputs below zoom
    const customControl = L.control({ position: 'topleft' });
    customControl.onAdd = function(map) {
      const container = L.DomUtil.create('div', 'custom-routing-control leaflet-control');
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
      // startDiv.style.marginBottom = '10px';

      const startLabel = L.DomUtil.create('label', '', startDiv);
      startLabel.textContent = 'Start:';
      startLabel.style.display = 'block';
      startLabel.style.marginBottom = '2px';
      startLabel.style.fontWeight = 'bold';

      const startInput = L.DomUtil.create('input', '', startDiv);
      startInput.type = 'text';
      startInput.placeholder = 'Enter start location';
      // startInput.style.width = '200px';
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
      // endInput.style.width = '200px';
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

    const router = new CustomOSRMv1({
      serviceUrl: "http://127.0.0.1:3332/sensebox/route/v1",
      profile: "driving",
      weights: weights,
    });

    const control = L.Routing.control({
      // router: L.Routing.osrmv1({
      //   serviceUrl: "https://router.project-osrm.org/route/v1",
      // }),
      router,
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
      setIsRouting(false); // NEW: Stop loading
    });

    // NEW: Handle routing start
    control.on('routingstart', () => {
      setIsRouting(true); // NEW: Start loading
    });

    // NEW: Handle routing error
    control.on('routingerror', () => {
      setIsRouting(false); // NEW: Stop loading on error
    });

    return () => {
      map.removeControl(customControl);
      map.removeControl(control);
    };
  }, [map, handleStartInputChange, handleEndInputChange, weights]);

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

  // NEW: Update loading overlay visibility
  useEffect(() => {
    if (loadingOverlayRef.current) {
      loadingOverlayRef.current.style.display = isRouting ? 'flex' : 'none';
    }
  }, [isRouting]);

  return null;
}
