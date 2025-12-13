import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { User, Package, Heart, Loader2, Clock, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Profile = Tables<'profiles'>;
type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;
type Product = Tables<'products'>;

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendente', color: 'bg-yellow-500' },
  confirmed: { label: 'Confirmado', color: 'bg-blue-500' },
  preparing: { label: 'Preparando', color: 'bg-purple-500' },
  ready: { label: 'Pronto', color: 'bg-green-500' },
  delivered: { label: 'Entregue', color: 'bg-green-700' },
  cancelled: { label: 'Cancelado', color: 'bg-red-500' },
};

const Perfil = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);
  const [favorites, setFavorites] = useState<(Tables<'favorites'> & { products: Product | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;

    const [profileRes, ordersRes, favoritesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('orders').select('*, order_items(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('favorites').select('*, products(*)').eq('user_id', user.id),
    ]);

    if (profileRes.data) {
      setProfile(profileRes.data);
      setForm({
        fullName: profileRes.data.full_name || '',
        phone: profileRes.data.phone || '',
        address: profileRes.data.address || '',
        city: profileRes.data.city || '',
        postalCode: profileRes.data.postal_code || '',
      });
    }

    if (ordersRes.data) {
      setOrders(ordersRes.data as any);
    }

    if (favoritesRes.data) {
      setFavorites(favoritesRes.data as any);
    }

    setLoading(false);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: form.fullName,
        phone: form.phone,
        address: form.address,
        city: form.city,
        postal_code: form.postalCode,
      })
      .eq('id', user.id);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o perfil.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Sucesso',
        description: 'Perfil atualizado com sucesso.',
      });
    }
    
    setSaving(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    await supabase.from('favorites').delete().eq('id', favoriteId);
    setFavorites(favorites.filter(f => f.id !== favoriteId));
    toast({
      title: 'Removido',
      description: 'Produto removido dos favoritos.',
    });
  };

  if (!user) return null;

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center bg-cream">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-cream min-h-screen py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-8">
            Minha Conta
          </h1>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Pedidos</span>
              </TabsTrigger>
              <TabsTrigger value="favorites" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favoritos</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="shadow-soft max-w-2xl">
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user.email || ''}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <h3 className="font-semibold text-foreground">Morada de Entrega</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Morada</Label>
                    <Input
                      id="address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={form.city}
                        onChange={(e) => setForm({ ...form, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Código Postal</Label>
                      <Input
                        id="postalCode"
                        value={form.postalCode}
                        onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <Button 
                    className="gradient-hero hover:opacity-90 transition-smooth"
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Guardar Alterações'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              {orders.length === 0 ? (
                <Card className="shadow-soft text-center">
                  <CardContent className="py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhum pedido ainda
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Faça seu primeiro pedido de gelados!
                    </p>
                    <Button 
                      className="gradient-hero hover:opacity-90 transition-smooth"
                      onClick={() => navigate('/produtos')}
                    >
                      Ver Produtos
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id} className="shadow-soft">
                      <CardContent className="p-6">
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Pedido #{order.id.slice(0, 8)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {new Date(order.created_at).toLocaleDateString('pt-PT', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </div>
                          <Badge className={`${statusLabels[order.status || 'pending'].color} text-white`}>
                            {statusLabels[order.status || 'pending'].label}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.product_name}</span>
                              <span className="font-medium">
                                €{(item.unit_price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{order.delivery_address}, {order.delivery_city}</span>
                          </div>
                          <p className="text-lg font-bold text-primary">
                            €{Number(order.total).toFixed(2)}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Favorites Tab */}
            <TabsContent value="favorites">
              {favorites.length === 0 ? (
                <Card className="shadow-soft text-center">
                  <CardContent className="py-12">
                    <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Nenhum favorito ainda
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Adicione gelados aos seus favoritos!
                    </p>
                    <Button 
                      className="gradient-hero hover:opacity-90 transition-smooth"
                      onClick={() => navigate('/produtos')}
                    >
                      Ver Produtos
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((favorite) => (
                    <Card key={favorite.id} className="shadow-soft overflow-hidden">
                      <div className="aspect-video overflow-hidden">
                        {favorite.products?.image_url ? (
                          <img
                            src={favorite.products.image_url}
                            alt={favorite.products.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Heart className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground">
                          {favorite.products?.name}
                        </h3>
                        <p className="text-primary font-bold mb-3">
                          €{favorite.products?.price.toFixed(2)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => removeFavorite(favorite.id)}
                        >
                          Remover
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Perfil;
