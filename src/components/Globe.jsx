import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapMover = ({ lat, lon, title, spinning, mapRef }) => {
  const map = useMap();

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = map;
    }

    if (spinning) {
      map.setView([Math.random() * 180 - 90, Math.random() * 360 - 180], 2);
    } else if (lat && lon) {
      map.flyTo([lat, lon], 5, { duration: 2 });
    }
  }, [lat, lon, spinning, map]);

  return lat && lon ? (
    <Marker position={[lat, lon]}>
      <Popup>{title}</Popup>
    </Marker>
  ) : null;
};

const Globe = ({ lat, lon, title, spinning, mapRef }) => {
  return (
    <MapContainer
      center={[0, 0]}
      zoom={2}
      style={{ height: "400px", width: "100%" }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapMover
        lat={lat}
        lon={lon}
        title={title}
        spinning={spinning}
        mapRef={mapRef}
      />
    </MapContainer>
  );
};

export default Globe;
