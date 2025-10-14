import { Card, CardContent } from "@/components/ui/card";
import saborMorango from "@/assets/sabor-morango.jpg";
import saborChocolate from "@/assets/sabor-chocolate.jpg";
import saborMenta from "@/assets/sabor-menta.jpg";
import saborBaunilha from "@/assets/sabor-baunilha.jpg";

const sabores = [
  {
    nome: "Morango Premium",
    descricao: "Morangos frescos selecionados em creme artesanal",
    imagem: saborMorango,
  },
  {
    nome: "Chocolate Belga",
    descricao: "Chocolate belga 70% cacau com textura cremosa",
    imagem: saborChocolate,
  },
  {
    nome: "Menta Refrescante",
    descricao: "Menta natural com lascas de chocolate",
    imagem: saborMenta,
  },
  {
    nome: "Baunilha Madagascar",
    descricao: "Baunilha pura de Madagascar em base cremosa",
    imagem: saborBaunilha,
  },
];

const Sabores = () => {
  return (
    <section className="py-20 px-4 bg-cream">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Nossos Sabores Gourmet
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada sabor é cuidadosamente elaborado com ingredientes premium e técnicas artesanais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sabores.map((sabor, index) => (
            <Card 
              key={index} 
              className="overflow-hidden shadow-soft hover:shadow-medium transition-smooth hover:scale-105 cursor-pointer animate-scale-in border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={sabor.imagem} 
                  alt={sabor.nome}
                  className="w-full h-full object-cover transition-smooth hover:scale-110"
                />
              </div>
              <CardContent className="p-6 gradient-card">
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {sabor.nome}
                </h3>
                <p className="text-muted-foreground">
                  {sabor.descricao}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sabores;
