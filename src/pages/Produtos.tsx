import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingCart, Heart, Loader2, Sparkles, IceCream, Star } from 'lucide-react';
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
        <section className="relative gradient-hero py-16 sm:py-20 lg:py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="container mx-auto text-center relative z-10">
            <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
              <IceCream className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground animate-float" />
              <Sparkles className="w-6 h-6 text-primary-foreground/80" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-primary-foreground mb-4 animate-fade-in">
              Nossos Gelados
            </h1>
            <p className="text-primary-foreground/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto animate-fade-in-up">
              Descubra nossa seleção de gelados artesanais feitos com ingredientes premium
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 sm:py-12">
          {/* Categories Filter */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10 justify-center animate-fade-in">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(null)}
              className={`transition-all duration-300 ${selectedCategory === null ? 'gradient-hero scale-105 shadow-medium' : 'hover:scale-105'}`}
              size="sm"
            >
              Todos
            </Button>
            {categories.map((category, index) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
                className={`transition-all duration-300 ${selectedCategory === category.id ? 'gradient-hero scale-105 shadow-medium' : 'hover:scale-105'}`}
                size="sm"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Featured Products */}
          {!selectedCategory && featuredProducts.length > 0 && (
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <Star className="w-6 h-6 text-primary fill-primary" />
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground">
                  Destaques
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {featuredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart === product.id}
                    featured
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All Products */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-6 sm:mb-8">
              {selectedCategory 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'Todos os Sabores'}
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-square" />
                    <CardContent className="p-3 sm:p-4">
                      <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
                      <Skeleton className="h-3 sm:h-4 w-full mb-4" />
                      <Skeleton className="h-8 sm:h-10 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                    onAddToCart={handleAddToCart}
                    isAddingToCart={addingToCart === product.id}
                    index={index}
                  />
                ))}
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16 sm:py-20 animate-fade-in">
                <IceCream className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground text-base sm:text-lg">
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
  index?: number;
}

const ProductCard = ({ 
  product, 
  isFavorite, 
  onToggleFavorite, 
  onAddToCart, 
  isAddingToCart,
  featured,
  index = 0
}: ProductCardProps) => {
  return (
    <Card 
      className={`group overflow-hidden shadow-soft hover:shadow-strong transition-all duration-500 hover:-translate-y-2 ${featured ? 'ring-2 ring-primary ring-offset-2' : ''} animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="aspect-square overflow-hidden relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <IceCream className="w-12 h-12 sm:w-16 sm:h-16 text-primary/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <button
          onClick={() => onToggleFavorite(product.id)}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background transition-all duration-300 hover:scale-110 shadow-soft"
        >
          <Heart 
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${isFavorite ? 'fill-primary text-primary scale-110' : 'text-muted-foreground hover:text-primary'}`} 
          />
        </button>
        {featured && (
          <Badge className="absolute top-2 left-2 sm:top-3 sm:left-3 gradient-hero border-0 shadow-medium text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            Destaque
          </Badge>
        )}
      </div>
      <CardContent className="p-3 sm:p-4 gradient-card">
        <h3 className="text-sm sm:text-lg font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        {product.allergens && product.allergens.length > 0 && (
          <div className="hidden sm:flex flex-wrap gap-1 mb-3">
            {product.allergens.slice(0, 2).map((allergen, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {allergen}
              </Badge>
            ))}
            {product.allergens.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{product.allergens.length - 2}
              </Badge>
            )}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg sm:text-xl font-bold text-primary">
            €{product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            className="gradient-hero hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-soft text-xs sm:text-sm px-2 sm:px-3"
            onClick={() => onAddToCart(product.id)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-1" />
                <span className="hidden sm:inline">Adicionar</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Produtos;
