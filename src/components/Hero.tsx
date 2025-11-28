import { Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-flycab.jpg";

interface HeroProps {
  onBookNowClick: () => void;
}

export const Hero = ({ onBookNowClick }: HeroProps) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Futuristic autonomous flying taxi over modern cityscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-accent/20 backdrop-blur-sm rounded-full border border-accent/30">
          <Plane className="w-4 h-4 text-accent animate-float" />
          <span className="text-sm font-medium text-white">Autonomous Flying Taxis</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
          Welcome to <span className="text-accent">FlyCab</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          Experience the future of urban transportation in Bengaluru. 
          Book your autonomous flying taxi in seconds.
        </p>
        
        <Button
          onClick={onBookNowClick}
          size="lg"
          className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-6 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          Book Your Flight Now
        </Button>
      </div>

      {/* Gradient Fade to Content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5]" />
    </section>
  );
};