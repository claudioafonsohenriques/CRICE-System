import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import heroImage from "@/assets/hero-gelados.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Gelados Artesanais Premium
          </h1>
          <p className="text-xl md:text-2xl text-white/95 mb-8 max-w-2xl mx-auto font-light drop-shadow-lg">
            Sabores únicos e ingredientes selecionados para uma experiência inesquecível
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="gradient-hero hover:opacity-90 transition-smooth text-lg px-8 py-6 shadow-strong"
            >
              <Phone className="mr-2 h-5 w-5" />
              Encomendar Agora
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 transition-smooth text-lg px-8 py-6"
            >
              Ver Sabores
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
