import { Award, Heart, Leaf } from "lucide-react";

const features = [
  {
    icon: Heart,
    titulo: "Feito com Amor",
    descricao: "Cada gelado é preparado artesanalmente com paixão e dedicação",
  },
  {
    icon: Leaf,
    titulo: "Ingredientes Naturais",
    descricao: "Utilizamos apenas ingredientes frescos e de origem premium",
  },
  {
    icon: Award,
    titulo: "Qualidade Premium",
    descricao: "Gelados artesanais que superam todos os padrões de qualidade",
  },
];

const Sobre = () => {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Tradição & Inovação em Cada Bola
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Na nossa gelataria, combinamos técnicas artesanais tradicionais com ingredientes 
              premium cuidadosamente selecionados. Cada sabor é uma experiência única, 
              criada para proporcionar momentos de puro prazer.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Do morango fresco ao chocolate belga mais fino, cada gelado é uma obra de arte 
              culinária que derrete na boca e aquece o coração.
            </p>
          </div>

          <div className="grid gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-6 rounded-lg bg-card shadow-soft hover:shadow-medium transition-smooth animate-scale-in"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-foreground">
                      {feature.titulo}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.descricao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sobre;
