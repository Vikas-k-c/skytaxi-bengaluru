import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Plane, Clock } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface TierOption {
  name: string;
  pricePerKm: number;
}

interface BookingConfirmationProps {
  open: boolean;
  onClose: () => void;
  pickup: Location | null;
  destination: Location | null;
  tier: TierOption | null;
  fare: number | null;
  bookingId?: string;
}

export const BookingConfirmation = ({
  open,
  onClose,
  pickup,
  destination,
  tier,
  fare,
  bookingId,
}: BookingConfirmationProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-accent/10 rounded-full p-3">
              <CheckCircle2 className="w-12 h-12 text-accent" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Booking Confirmed!</DialogTitle>
          <DialogDescription className="text-center">
            Your flying taxi has been successfully booked
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {bookingId && (
            <div className="text-center p-3 bg-secondary/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Booking ID</span>
              <p className="font-mono text-sm font-semibold">{bookingId}</p>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <MapPin className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Pickup Location</p>
                <p className="text-xs text-muted-foreground truncate">
                  {pickup ? `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}` : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Destination</p>
                <p className="text-xs text-muted-foreground truncate">
                  {destination ? `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}` : "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-secondary/30 rounded-lg">
              <Plane className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium">Flying Taxi Tier</p>
                <p className="text-xs text-muted-foreground">{tier?.name || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg border-2 border-accent/30">
              <div className="flex-1">
                <p className="text-sm font-medium">Total Fare</p>
                <p className="text-2xl font-bold text-accent">₹{fare?.toFixed(2) || "0.00"}</p>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground pt-2">
            <Clock className="w-4 h-4 inline-block mr-1" />
            Your taxi will arrive in approximately 5-10 minutes
          </div>
        </div>

        <Button onClick={onClose} className="w-full bg-accent hover:bg-accent/90">
          Done
        </Button>
      </DialogContent>
    </Dialog>
  );
};