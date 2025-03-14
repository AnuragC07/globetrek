import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Globe = ({ lat, lon, title, spinning, mapRef }) => {
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const spinIntervalRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize the map if it doesn't exist
    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current).setView([20, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      mapRef.current = map;
    }

    // Clean up on unmount
    return () => {
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }
    };
  }, []);

  // Handle spinning effect
  useEffect(() => {
    if (!mapRef.current) return;

    if (spinning) {
      // Clear any existing interval
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
      }

      // Create a new interval for spinning
      spinIntervalRef.current = setInterval(() => {
        mapRef.current.setView(
          [Math.random() * 180 - 90, Math.random() * 360 - 180],
          2
        );
      }, 2000);

      // Remove any existing marker when spinning
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    } else {
      // Stop spinning
      if (spinIntervalRef.current) {
        clearInterval(spinIntervalRef.current);
        spinIntervalRef.current = null;
      }
    }
  }, [spinning]);

  // Handle marker and location updates
  useEffect(() => {
    if (!mapRef.current || spinning) return;

    if (lat && lon) {
      // Fly to the location
      mapRef.current.flyTo([lat, lon], 6, { duration: 2 });

      // Add a marker if it doesn't exist or update its position
      if (!markerRef.current) {
        markerRef.current = L.marker([lat, lon])
          .addTo(mapRef.current)
          .bindPopup(title || "Location");
      } else {
        markerRef.current.setLatLng([lat, lon]);
        if (title) {
          markerRef.current.getPopup().setContent(title);
        }
      }
    }
  }, [lat, lon, title, spinning]);

  // Force a resize on window resize
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener("resize", handleResize);

    // Initial invalidateSize to ensure map renders correctly
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "100%" }}
      id="map-container"
    ></div>
  );
};

export default Globe;
