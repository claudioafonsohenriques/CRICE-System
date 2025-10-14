import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

const contactInfo = [
  {
    icon: Phone,
    titulo: "Telefone",
    info: "+351 912 345 678",
    link: "tel:+351912345678",
  },
  {
    icon: Mail,
    titulo: "Email",
    info: "gelados@premium.pt",
    link: "mailto:gelados@premium.pt",
  },
  {
    icon: MapPin,
    titulo: "Localização",
    info: "Lisboa, Portugal",
    link: "#",
  },
  {
    icon: Clock,
    titulo: "Horário",
    info: "Seg-Dom: 10h-22h",
    link: "#",
  },
];

const Contacto = () => {
  const handleWhatsApp = () => {
    window.open("https://wa.me/351912345678?text=Olá!%20Gostaria%20de%20encomendar%20gelados%20gourmet", "_blank");
  };

  return (
    <section className="py-20 px-4 bg-cream">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Entre em Contacto
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos prontos para criar os gelados perfeitos para você. Entre em contacto connosco!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {contactInfo.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index}
                className="text-center shadow-soft hover:shadow-medium transition-smooth animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 rounded-full gradient-hero mx-auto mb-4 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    {item.titulo}
                  </h3>
                  <p className="text-muted-foreground">
                    {item.info}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            onClick={handleWhatsApp}
            className="gradient-hero hover:opacity-90 transition-smooth text-lg px-10 py-6 shadow-medium"
          >
            <Phone className="mr-2 h-5 w-5" />
            Encomendar pelo WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contacto;
