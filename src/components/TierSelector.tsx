import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Plane } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TierOption {
  name: "Basic" | "Premium" | "Ultra";
  pricePerKm: number;
  description: string;
  features: string[];
}

interface TierSelectorProps {
  selectedTier: TierOption | null;
  onTierSelect: (tier: TierOption) => void;
  distance: number | null;
}

const tierOptions: TierOption[] = [
  {
    name: "Basic",
    pricePerKm: 50,
    description: "Efficient and affordable aerial transport",
    features: ["Standard seating", "Basic amenities", "Shared ride option"],
  },
  {
    name: "Premium",
    pricePerKm: 100,
    description: "Enhanced comfort with priority service",
    features: ["Premium seating", "Priority boarding", "Refreshments", "Wi-Fi"],
  },
  {
    name: "Ultra",
    pricePerKm: 200,
    description: "Luxury experience with exclusive perks",
    features: ["Luxury seating", "VIP boarding", "Premium refreshments", "Entertainment system", "Concierge service"],
  },
];

export const TierSelector = ({ selectedTier, onTierSelect, distance }: TierSelectorProps) => {
  const calculateFare = (tier: TierOption) => {
    if (!distance) return null;
    return (tier.pricePerKm * distance).toFixed(2);
  };

  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
      <div>
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Plane className="w-6 h-6 text-accent" />
          Choose Your Tier
        </h2>
        <p className="text-muted-foreground">
          Select a flying taxi tier that suits your needs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tierOptions.map((tier) => {
          const fare = calculateFare(tier);
          const isSelected = selectedTier?.name === tier.name;

          return (
            <Card
              key={tier.name}
              className={cn(
                "p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2",
                isSelected
                  ? "border-accent bg-accent/5 shadow-lg"
                  : "border-border hover:border-accent/50"
              )}
              onClick={() => onTierSelect(tier)}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>
                {isSelected && (
                  <div className="bg-accent text-white rounded-full p-1">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-accent">
                  ₹{tier.pricePerKm}
                </div>
                <div className="text-sm text-muted-foreground">per kilometer</div>
                {fare && (
                  <div className="mt-2 text-lg font-semibold">
                    Total: ₹{fare}
                  </div>
                )}
              </div>

              <ul className="space-y-2">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full mt-4",
                  isSelected
                    ? "bg-accent hover:bg-accent/90"
                    : "bg-secondary hover:bg-secondary/80"
                )}
                onClick={() => onTierSelect(tier)}
              >
                {isSelected ? "Selected" : "Select"}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};