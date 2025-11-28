import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
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

export const MapSelector = ({ onLocationsSelected }: MapSelectorProps) => {
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [pickupMode, setPickupMode] = useState(true);

  // Refs for Leaflet map and markers
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pickupMarkerRef = useRef<L.Marker | null>(null);
  const destinationMarkerRef = useRef<L.Marker | null>(null);
  const pickupModeRef = useRef(true);

  // Sync ref with state for use in Leaflet event handler
  useEffect(() => {
    pickupModeRef.current = pickupMode;
  }, [pickupMode]);

  // Bengaluru coordinates
  const centerPosition: [number, number] = [12.9716, 77.5946];

  // Initialize Leaflet map once
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = L.map(mapContainerRef.current).setView(centerPosition, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(mapRef.current);

    const handleClick = (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      if (pickupModeRef.current) {
        setPickup({ lat, lng });
        setPickupMode(false);
      } else {
        setDestination({ lat, lng });
      }
    };

    mapRef.current.on("click", handleClick);

    return () => {
      mapRef.current?.off("click", handleClick);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (!mapRef.current) return;

    if (pickup) {
      if (pickupMarkerRef.current) {
        pickupMarkerRef.current.setLatLng(pickup);
      } else {
        pickupMarkerRef.current = L.marker(pickup).addTo(mapRef.current);
        pickupMarkerRef.current.bindPopup("Pickup Location");
      }
    } else if (pickupMarkerRef.current) {
      mapRef.current.removeLayer(pickupMarkerRef.current);
      pickupMarkerRef.current = null;
    }

    if (destination) {
      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLatLng(destination);
      } else {
        destinationMarkerRef.current = L.marker(destination).addTo(mapRef.current);
        destinationMarkerRef.current.bindPopup("Destination");
      }
    } else if (destinationMarkerRef.current) {
      mapRef.current.removeLayer(destinationMarkerRef.current);
      destinationMarkerRef.current = null;
    }
  }, [pickup, destination]);

  // Notify parent when both locations are set
  useEffect(() => {
    if (pickup && destination) {
      onLocationsSelected(pickup, destination);
    }
  }, [pickup, destination, onLocationsSelected]);

  const handleReset = () => {
    setPickup(null);
    setDestination(null);
    setPickupMode(true);
    pickupModeRef.current = true;
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
        <div ref={mapContainerRef} className="w-full h-full" />
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
