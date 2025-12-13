import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

const Carrinho = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart();

  if (!user) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-cream">
          <Card className="max-w-md mx-4 text-center shadow-medium">
            <CardContent className="p-8">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Faça login para ver seu carrinho
              </h2>
              <p className="text-muted-foreground mb-6">
                É necessário estar logado para adicionar produtos ao carrinho.
              </p>
              <Button 
                className="gradient-hero hover:opacity-90 transition-smooth"
                onClick={() => navigate('/auth')}
              >
                Entrar
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-cream">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-cream">
          <Card className="max-w-md mx-4 text-center shadow-medium">
            <CardContent className="p-8">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Carrinho vazio
              </h2>
              <p className="text-muted-foreground mb-6">
                Adicione deliciosos gelados ao seu carrinho!
              </p>
              <Button 
                className="gradient-hero hover:opacity-90 transition-smooth"
                onClick={() => navigate('/produtos')}
              >
                Ver Produtos
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-cream min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-8">
            Meu Carrinho
          </h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.id} className="shadow-soft">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        {item.products?.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.products?.name}
                        </h3>
                        <p className="text-primary font-bold mt-1">
                          €{item.products?.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          €{((item.products?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="shadow-medium sticky top-24">
                <CardHeader>
                  <CardTitle className="text-xl">Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>€{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Entrega</span>
                    <span>A calcular</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">€{cartTotal.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    className="w-full gradient-hero hover:opacity-90 transition-smooth"
                    size="lg"
                    onClick={() => navigate('/checkout')}
                  >
                    Finalizar Pedido
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Carrinho;
