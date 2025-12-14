import Layout from "@/components/layout/Layout";
import Hero from "@/components/Hero";
import Sabores from "@/components/Sabores";
import Sobre from "@/components/Sobre";
import Contacto from "@/components/Contacto";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Sabores />
      <Sobre />
      <Contacto />
    </Layout>
  );
};

export default Index;
