import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";
import { Card } from "@/components/ui/card";

// Fix for default marker icons in Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Location {
  lat: number;
  lng: number;
}

interface MapSelectorProps {
  onLocationsSelected: (pickup: Location, destination: Location) => void;
}

const MapClickHandler = ({
  onPickupSet,
  onDestinationSet,
  pickupMode,
}: {
  onPickupSet: (location: Location) => void;
  onDestinationSet: (location: Location) => void;
  pickupMode: boolean;
}) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      if (pickupMode) {
        onPickupSet({ lat, lng });
      } else {
        onDestinationSet({ lat, lng });
      }
    },
  });
  return null;
};

export const MapSelector = ({ onLocationsSelected }: MapSelectorProps) => {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [pickupMode, setPickupMode] = useState(true);
  
  // Bengaluru coordinates
  const centerPosition: [number, number] = [12.9716, 77.5946];

  useEffect(() => {
    if (pickup && destination) {
      onLocationsSelected(pickup, destination);
    }
  }, [pickup, destination, onLocationsSelected]);

  const handlePickupSet = (location: Location) => {
    setPickup(location);
    setPickupMode(false);
  };

  const handleDestinationSet = (location: Location) => {
    setDestination(location);
  };

  const handleReset = () => {
    setPickup(null);
    setDestination(null);
    setPickupMode(true);
  };

  return (
    <Card className="p-6 bg-card border-border animate-slide-up">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-accent" />
          Select Locations
        </h2>
        <p className="text-muted-foreground">
          {pickupMode
            ? "Click on the map to set your pickup location"
            : "Click on the map to set your destination"}
        </p>
      </div>

      <div className="grid gap-4 mb-4">
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="font-medium">Pickup:</span>
          <span className="text-muted-foreground">
            {pickup ? `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}` : "Not set"}
          </span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="font-medium">Destination:</span>
          <span className="text-muted-foreground">
            {destination ? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}` : "Not set"}
          </span>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border-2 border-border mb-4" style={{ height: "400px" }}>
        <MapContainer
          center={centerPosition}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            onPickupSet={handlePickupSet}
            onDestinationSet={handleDestinationSet}
            pickupMode={pickupMode}
          />
          {pickup && (
            <Marker position={[pickup.lat, pickup.lng]}>
              <Popup>Pickup Location</Popup>
            </Marker>
          )}
          {destination && (
            <Marker position={[destination.lat, destination.lng]}>
              <Popup>Destination</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {(pickup || destination) && (
        <Button
          onClick={handleReset}
          variant="outline"
          className="w-full"
        >
          Reset Locations
        </Button>
      )}
    </Card>
  );
};