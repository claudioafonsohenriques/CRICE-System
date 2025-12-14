import { Heart, IceCream, Phone, Mail, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-chocolate text-white py-16 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <IceCream className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold font-heading">CR ICE</span>
            </Link>
            <p className="text-white/80 leading-relaxed">
              Gelados artesanais gourmet feitos com amor e os melhores ingredientes selecionados.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">Navegação</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-white/80 hover:text-primary transition-colors">Início</Link></li>
              <li><Link to="/produtos" className="text-white/80 hover:text-primary transition-colors">Produtos</Link></li>
              <li><Link to="/auth" className="text-white/80 hover:text-primary transition-colors">Entrar</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading flex items-center gap-2">
              <Clock className="w-4 h-4" /> Horário
            </h4>
            <p className="text-white/80">Segunda a Domingo</p>
            <p className="text-white/80">10:00 - 22:00</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 font-heading">Contacto</h4>
            <div className="space-y-2">
              <p className="text-white/80 flex items-center gap-2">
                <Phone className="w-4 h-4" /> +351 912 345 678
              </p>
              <p className="text-white/80 flex items-center gap-2">
                <Mail className="w-4 h-4" /> info@crice.pt
              </p>
              <p className="text-white/80 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Lisboa, Portugal
              </p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p className="flex items-center justify-center gap-2">
            Feito com <Heart className="w-4 h-4 text-primary fill-primary" /> para os amantes de gelados
          </p>
          <p className="mt-2">© 2025 CR ICE. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
