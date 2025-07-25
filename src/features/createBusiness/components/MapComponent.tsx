import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import * as L from "leaflet";
import type { Location } from "../types/business.types";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
  selectedLocation: Location | null;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function MapComponent({ onLocationSelect, selectedLocation }: MapComponentProps) {
  const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <MapContainer
      center={[16.7500, -93.1200]} // tuxtla
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapClickHandler onLocationSelect={onLocationSelect} />

      {selectedLocation && (
        <Marker 
          position={[selectedLocation.latitude, selectedLocation.longitude]}
          icon={customIcon}
        >
          <Popup>
            <div className="text-sm">
              <strong>Ubicación Seleccionada</strong>
              <br />
              <strong>Lat:</strong> {selectedLocation.latitude?.toFixed(6)}
              <br />
              <strong>Lng:</strong> {selectedLocation.longitude?.toFixed(6)}
              <br />
              <strong>Dirección:</strong> {selectedLocation.address}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}