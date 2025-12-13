import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  IceCream2, 
  ShoppingCart, 
  User, 
  Menu, 
  LogOut, 
  ClipboardList,
  Home,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      <Link 
        to="/" 
        className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        <Home className="h-4 w-4" />
        Início
      </Link>
      <Link 
        to="/produtos" 
        className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
        onClick={() => mobile && setMobileMenuOpen(false)}
      >
        <Package className="h-4 w-4" />
        Produtos
      </Link>
      {isAdmin && (
        <Link 
          to="/admin/pedidos" 
          className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
          onClick={() => mobile && setMobileMenuOpen(false)}
        >
          <ClipboardList className="h-4 w-4" />
          Pedidos
        </Link>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-full gradient-hero">
              <IceCream2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-heading font-bold text-foreground group-hover:text-primary transition-smooth">
              CR ICE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLinks />
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link to="/carrinho">
                  <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs gradient-hero border-0">
                        {cartCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <Link to="/perfil">
                  <Button variant="outline" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="gradient-hero hover:opacity-90 transition-smooth">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col gap-6 mt-8">
                <nav className="flex flex-col gap-4">
                  <NavLinks mobile />
                </nav>
                
                <div className="border-t border-border pt-6">
                  {user ? (
                    <div className="flex flex-col gap-4">
                      <Link 
                        to="/carrinho" 
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Carrinho
                        {cartCount > 0 && (
                          <Badge className="gradient-hero border-0 text-xs">
                            {cartCount}
                          </Badge>
                        )}
                      </Link>
                      <Link 
                        to="/perfil" 
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-smooth"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        Perfil
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="justify-start p-0 h-auto text-foreground hover:text-primary"
                        onClick={() => {
                          handleSignOut();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full gradient-hero hover:opacity-90 transition-smooth">
                        Entrar
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
