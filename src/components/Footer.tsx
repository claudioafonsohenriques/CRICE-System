import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-chocolate text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 font-heading">Gelados Gourmet</h3>
            <p className="text-white/80 leading-relaxed">
              Gelados artesanais premium feitos com amor e os melhores ingredientes.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Horário</h4>
            <p className="text-white/80">Segunda a Domingo</p>
            <p className="text-white/80">10:00 - 22:00</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <p className="text-white/80">+351 912 345 678</p>
            <p className="text-white/80">gelados@premium.pt</p>
            <p className="text-white/80">Lisboa, Portugal</p>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p className="flex items-center justify-center gap-2">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> para os amantes de gelados
          </p>
          <p className="mt-2">© 2025 Gelados Gourmet. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
