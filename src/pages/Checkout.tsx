import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;

const checkoutSchema = z.object({
  phone: z.string().trim().min(9, { message: 'Telefone inválido' }).max(20),
  address: z.string().trim().min(5, { message: 'Morada muito curta' }).max(200),
  city: z.string().trim().min(2, { message: 'Cidade inválida' }).max(100),
  postalCode: z.string().trim().min(4, { message: 'Código postal inválido' }).max(20),
  notes: z.string().max(500).optional(),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    
    if (data) {
      setForm({
        phone: data.phone || '',
        address: data.address || '',
        city: data.city || '',
        postalCode: data.postal_code || '',
        notes: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || cartItems.length === 0) return;
    
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      toast({
        title: 'Erro de validação',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }
    
    setLoading(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: cartTotal,
          phone: form.phone,
          delivery_address: form.address,
          delivery_city: form.city,
          delivery_postal_code: form.postalCode,
          notes: form.notes || null,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.products?.name || 'Produto',
        quantity: item.quantity,
        unit_price: item.products?.price || 0,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update profile with delivery info
      await supabase
        .from('profiles')
        .update({
          phone: form.phone,
          address: form.address,
          city: form.city,
          postal_code: form.postalCode,
        })
        .eq('id', user.id);

      // Clear cart
      await clearCart();
      
      setOrderId(order.id);
      setOrderComplete(true);
      
      toast({
        title: 'Pedido realizado!',
        description: 'Seu pedido foi enviado com sucesso.',
      });
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: 'Erro ao criar pedido',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (cartItems.length === 0 && !orderComplete) {
    navigate('/carrinho');
    return null;
  }

  if (orderComplete) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-cream">
          <Card className="max-w-md mx-4 text-center shadow-medium">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
                Pedido Confirmado!
              </h2>
              <p className="text-muted-foreground mb-2">
                Seu pedido foi recebido com sucesso.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Número do pedido: <span className="font-mono font-bold">{orderId?.slice(0, 8)}</span>
              </p>
              <div className="space-y-3">
                <Button 
                  className="w-full gradient-hero hover:opacity-90 transition-smooth"
                  onClick={() => navigate('/perfil')}
                >
                  Ver Meus Pedidos
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/produtos')}
                >
                  Continuar Comprando
                </Button>
              </div>
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
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/carrinho')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Carrinho
          </Button>

          <h1 className="text-3xl font-heading font-bold text-foreground mb-8">
            Finalizar Pedido
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Delivery Info */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-soft">
                  <CardHeader>
                    <CardTitle>Informações de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+351 912 345 678"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Morada *</Label>
                      <Input
                        id="address"
                        placeholder="Rua, número, andar"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          placeholder="Lisboa"
                          value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Código Postal *</Label>
                        <Input
                          id="postalCode"
                          placeholder="1000-000"
                          value={form.postalCode}
                          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Observações (opcional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Instruções especiais, horário preferido..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="shadow-medium sticky top-24">
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.quantity}x {item.products?.name}
                          </span>
                          <span className="font-medium">
                            €{((item.products?.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold text-foreground">
                      <span>Total</span>
                      <span className="text-primary">€{cartTotal.toFixed(2)}</span>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full gradient-hero hover:opacity-90 transition-smooth"
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        'Confirmar Pedido'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
