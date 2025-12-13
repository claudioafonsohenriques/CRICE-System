import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Product = Tables<'products'>;
type Category = Tables<'categories'>;

const Produtos = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchData = async () => {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').eq('available', true),
      supabase.from('categories').select('*'),
    ]);

    if (productsRes.data) setProducts(productsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);
    setLoading(false);
  };

  const fetchFavorites = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', user.id);
    
    if (data) {
      setFavorites(data.map(f => f.product_id));
    }
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) {
      toast({
        title: 'Faça login',
        description: 'É necessário estar logado para adicionar favoritos.',
        variant: 'destructive',
      });
      return;
    }

    const isFavorite = favorites.includes(productId);

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, product_id: productId });
      setFavorites([...favorites, productId]);
    }
  };

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    await addToCart(productId);
    setAddingToCart(null);
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category_id === selectedCategory)
    : products;

  const featuredProducts = products.filter(p => p.featured);

  return (
    <Layout>
      <div className="bg-cream min-h-screen">
        {/* Hero Section */}
        <section className="gradient-hero py-16 px-4">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-4">
              Nossos Gelados
            </h1>
            <p className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Descubra nossa seleção de gelados artesanais feitos com ingredientes premium
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-12">
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'gradient-hero' : ''}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={selectedCategory === category.id ? 'gradient-hero' : ''}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Featured Products */}
          {!selectedCategory && featuredProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                Destaques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart === product.id}
                    featured
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Products */}
          <div>
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'Todos os Sabores'}
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square" />
                    <CardContent className="p-4">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart === product.id}
                  />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum produto encontrado nesta categoria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
  isAddingToCart: boolean;
  featured?: boolean;
}

const ProductCard = ({ 
  product, 
  isFavorite, 
  onToggleFavorite, 
  onAddToCart, 
  isAddingToCart,
  featured 
}: ProductCardProps) => {
  return (
    <Card className={`overflow-hidden shadow-soft hover:shadow-medium transition-smooth hover:scale-[1.02] ${featured ? 'ring-2 ring-primary' : ''}`}>
      <div className="aspect-square overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-smooth hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Sem imagem</span>
          </div>
        )}
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-smooth"
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}`} 
          />
        </button>
        {featured && (
          <Badge className="absolute top-3 left-3 gradient-hero border-0">
            Destaque
          </Badge>
        )}
      </div>
      <CardContent className="p-4 gradient-card">
        <h3 className="text-lg font-semibold text-foreground mb-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        {product.allergens && product.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.allergens.map((allergen, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {allergen}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            €{product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="gradient-hero hover:opacity-90 transition-smooth"
            onClick={() => onAddToCart(product.id)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-1" />
                Adicionar
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Produtos;
