import { useState, useCallback, useRef, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { MapSelector } from "@/components/MapSelector";
import { TierSelector, TierOption } from "@/components/TierSelector";
import { BookingConfirmation } from "@/components/BookingConfirmation";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

const Index = () => {
  const [showBooking, setShowBooking] = useState(false);
  const [pickup, setPickup] = useState<Location | null>(null);
  const [destination, setDestination] = useState<Location | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierOption | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [fare, setFare] = useState<number | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingId, setBookingId] = useState<string>("");

  const bookingSectionRef = useRef<HTMLDivElement>(null);

  const scrollToBooking = () => {
    setShowBooking(true);
    setTimeout(() => {
      bookingSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleLocationsSelected = useCallback((newPickup: Location, newDestination: Location) => {
    setPickup(newPickup);
    setDestination(newDestination);

    // Calculate distance using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (newDestination.lat - newPickup.lat) * Math.PI / 180;
    const dLon = (newDestination.lng - newPickup.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(newPickup.lat * Math.PI / 180) *
        Math.cos(newDestination.lat * Math.PI / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const calculatedDistance = R * c;

    setDistance(calculatedDistance);
  }, []);

  const handleTierSelect = useCallback((tier: TierOption) => {
    setSelectedTier(tier);
  }, []);

  useEffect(() => {
    if (distance && selectedTier) {
      const calculatedFare = distance * selectedTier.pricePerKm;
      setFare(calculatedFare);
    }
  }, [distance, selectedTier]);

  const handleBooking = async () => {
    if (!pickup || !destination || !selectedTier || !fare) {
      toast.error("Please complete all booking details");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            pickup_lat: pickup.lat,
            pickup_lng: pickup.lng,
            destination_lat: destination.lat,
            destination_lng: destination.lng,
            tier: selectedTier.name,
            fare_amount: fare,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setBookingId(data.id);
      setShowConfirmation(true);
      toast.success("Booking confirmed successfully!");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to complete booking. Please try again.");
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    // Reset form
    setPickup(null);
    setDestination(null);
    setSelectedTier(null);
    setDistance(null);
    setFare(null);
    setShowBooking(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const canProceed = pickup && destination && selectedTier && fare;

  return (
    <div className="min-h-screen bg-background">
      <Hero onBookNowClick={scrollToBooking} />

      {showBooking && (
        <div ref={bookingSectionRef} className="container mx-auto px-4 py-16 space-y-12">
          <MapSelector onLocationsSelected={handleLocationsSelected} />

          {distance && (
            <div className="text-center p-4 bg-secondary/30 rounded-lg border border-border animate-fade-in">
              <p className="text-lg">
                <span className="font-semibold">Distance:</span>{" "}
                <span className="text-accent font-bold">{distance.toFixed(2)} km</span>
              </p>
            </div>
          )}

          {pickup && destination && (
            <TierSelector
              selectedTier={selectedTier}
              onTierSelect={handleTierSelect}
              distance={distance}
            />
          )}

          {canProceed && (
            <div className="flex justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button
                onClick={handleBooking}
                size="lg"
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-12 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Confirm Booking
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      )}

      <BookingConfirmation
        open={showConfirmation}
        onClose={handleConfirmationClose}
        pickup={pickup}
        destination={destination}
        tier={selectedTier}
        fare={fare}
        bookingId={bookingId}
      />
    </div>
  );
};

export default Index;