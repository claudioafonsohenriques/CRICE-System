import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { 
  Loader2, 
  Package, 
  Clock, 
  MapPin, 
  Phone, 
  User,
  FileText,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Tables, Enums } from '@/integrations/supabase/types';

type Order = Tables<'orders'>;
type OrderItem = Tables<'order_items'>;
type Profile = Tables<'profiles'>;
type OrderStatus = Enums<'order_status'>;

type OrderWithDetails = Order & {
  order_items: OrderItem[];
};

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'pending', label: 'Pendente', color: 'bg-yellow-500' },
  { value: 'confirmed', label: 'Confirmado', color: 'bg-blue-500' },
  { value: 'preparing', label: 'Preparando', color: 'bg-purple-500' },
  { value: 'ready', label: 'Pronto', color: 'bg-green-500' },
  { value: 'delivered', label: 'Entregue', color: 'bg-green-700' },
  { value: 'cancelled', label: 'Cancelado', color: 'bg-red-500' },
];

const AdminPedidos = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate('/');
      return;
    }
    if (user && isAdmin) {
      fetchOrders();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os pedidos.',
        variant: 'destructive',
      });
    } else {
      setOrders(data as OrderWithDetails[]);
    }
    
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrder(orderId);
    
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      });
    } else {
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      toast({
        title: 'Atualizado',
        description: 'Status do pedido atualizado.',
      });
    }
    
    setUpdatingOrder(null);
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    preparing: orders.filter(o => o.status === 'preparing').length,
    ready: orders.filter(o => o.status === 'ready').length,
  };

  if (authLoading || loading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-[60vh] flex items-center justify-center bg-cream">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout showFooter={false}>
      <div className="bg-cream min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">
                Gestão de Pedidos
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie todos os pedidos da plataforma
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={fetchOrders}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Atualizar
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground">{orderStats.total}</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Preparando</p>
                <p className="text-2xl font-bold text-purple-600">{orderStats.preparing}</p>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Prontos</p>
                <p className="text-2xl font-bold text-green-600">{orderStats.ready}</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card className="shadow-soft text-center">
              <CardContent className="py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhum pedido encontrado
                </h3>
                <p className="text-muted-foreground">
                  {filterStatus === 'all' 
                    ? 'Ainda não há pedidos na plataforma.'
                    : 'Nenhum pedido com este status.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const statusInfo = statusOptions.find(s => s.value === order.status) || statusOptions[0];
                
                return (
                  <Card key={order.id} className="shadow-soft">
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-foreground">
                              Pedido #{order.id.slice(0, 8)}
                            </h3>
                            <Badge className={`${statusInfo.color} text-white`}>
                              {statusInfo.label}
                            </Badge>
                          </div>
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
                        
                        <div className="flex items-center gap-2">
                          {updatingOrder === order.id && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          <Select 
                            value={order.status || 'pending'} 
                            onValueChange={(value) => updateOrderStatus(order.id, value as OrderStatus)}
                            disabled={updatingOrder === order.id}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Cliente</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>{order.phone || 'Sem telefone'}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-start gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                            <span>
                              {order.delivery_address}, {order.delivery_postal_code} {order.delivery_city}
                            </span>
                          </div>
                          {order.notes && (
                            <div className="flex items-start gap-2 text-sm text-muted-foreground">
                              <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{order.notes}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium text-foreground">Itens do Pedido</h4>
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm py-2 border-b border-border/50 last:border-0">
                            <span>
                              <span className="font-medium">{item.quantity}x</span> {item.product_name}
                            </span>
                            <span className="font-medium">
                              €{(item.unit_price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <Separator className="my-4" />
                      
                      {/* Total */}
                      <div className="flex justify-end">
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Total do Pedido</p>
                          <p className="text-2xl font-bold text-primary">
                            €{Number(order.total).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPedidos;
