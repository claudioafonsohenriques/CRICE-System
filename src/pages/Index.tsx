import Hero from "@/components/Hero";
import Sabores from "@/components/Sabores";
import Sobre from "@/components/Sobre";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Sabores />
      <Sobre />
      <Contacto />
      <Footer />
    </main>
  );
};

export default Index;
