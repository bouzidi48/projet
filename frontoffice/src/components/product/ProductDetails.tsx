import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import { Product, Colour, Size, Image as ProductImage } from '../../types/product';
import { FiCheck, FiHeart } from 'react-icons/fi';
import { useFavorites } from '../../contexts/FavoritesContext';
import { axiosInstance } from '../../services/api';

interface ProductDetailsProps {
  productId: number;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
  const { product, loading, error } = useProduct(productId);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedColor, setSelectedColor] = useState<Colour | null>(null);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product && product.colours.length > 0) {
      setSelectedColor(product.colours[0]);
      setSelectedSize(product.colours[0].sizes?.[0] || null);
    }
  }, [product]);

  const handleColorChange = useCallback((color: Colour) => {
    setSelectedColor(color);
    setSelectedSize(color.sizes?.[0] || null);
  }, []);

  const handleSizeChange = useCallback((size: Size) => {
    setSelectedSize(size);
  }, []);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  }, []);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (product && selectedColor && selectedSize) {
      try {
        console.log(quantity)
        const response = await axiosInstance.post('/product/createPanier', {
          productId: product.id,
          couleurId: selectedColor.id,
          sizeId: selectedSize.id,
          quantity: quantity
        }, { withCredentials: true });
  
        if (response.data.statusCode === 200) {
          addItem({
            id: `${product.id}-${selectedColor.id}-${selectedSize.id}`,
            name: product.nameProduct,
            price: product.price,
            quantity: quantity,
            image: selectedColor.images?.[0]?.UrlImage,
            color: selectedColor.nameCouleur,
            size: selectedSize.typeSize
          });
          // Le produit a été ajouté avec succès au panier
          setIsAdded(true);
          setTimeout(() => setIsAdded(false), 2000); // Réinitialisation après 2 secondes
        } else {
          // Gérez l'erreur si la réponse n'est pas un succès
          console.error(response.data.message || 'Erreur lors de l\'ajout au panier');
        }
      } catch (error) {
        console.error('Erreur lors de l\'ajout au panier', error);
      }
    }
  }, [product, selectedColor, selectedSize, quantity]);
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (product) {
      toggleFavorite(product);
    }
  }, [product, toggleFavorite]);

  const settings = useMemo(() => ({
    dots: selectedColor?.images?.length ? selectedColor.images.length > 1 : false,
    infinite: selectedColor?.images?.length ? selectedColor.images.length > 1 : false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: selectedColor?.images?.length ? selectedColor.images.length > 1 : false,
  }), [selectedColor]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10">Error: {error.message}</div>;
  if (!product) return <div className="text-center py-10">Product not found</div>;
  if (!selectedColor) return <div className="text-center py-10">No colors available</div>;

  const Review = ({ rating, text }: { rating: number; text: string }) => {
    const stars = Array(5)
      .fill(0)
      .map((_, i) => (
        <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      ));

    return (
      <div className="flex flex-col items-start p-4 bg-gray-100 rounded-lg shadow-md mt-4">
        <div className="flex items-center">{stars}</div>
        <p className="text-sm text-gray-700 mt-2">{text}</p>
      </div>
    );
  };

  const renderImage = (image: ProductImage) => (
    <div key={image.id} className="aspect-w-3 aspect-h-4">
      <img
        className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-md"
        src={image.UrlImage}
        alt={product.nameProduct}
      />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row p-6 max-w-7xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Left section with description */}
      <div className="flex flex-col lg:w-1/3 space-y-4 p-4">
        <h1 className="text-2xl font-bold text-gray-800">{product.nameProduct}</h1>
        <p className="text-2xl font-bold text-gray-800">{product.price.toFixed(2)} MAD</p>
        <p className="text-sm text-gray-500">CRÉDIT | REF. {product.id}</p>
        <p className="text-base text-gray-700">{product.description}</p>

        {/* Review section */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800">Avis des clients</h2>
          <Review rating={4} text="Superbe produit, très confortable et élégant !" />
          <Review rating={5} text="Très satisfait(e) de mon achat, je recommande !" />
        </div>
      </div>

      {/* Middle section with image */}
      <div className="lg:w-1/3 flex flex-col items-center p-4">
        <div className="w-full max-w-md relative">
          {selectedColor.images && selectedColor.images.length === 1 ? (
            renderImage(selectedColor.images[0])
          ) : (
            <Slider {...settings}>
              {selectedColor.images?.map(renderImage)}
            </Slider>
          )}
          <button 
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-300 z-10"
          >
            <FiHeart 
              className={`w-6 h-6 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            />
          </button>
        </div>
      </div>

      {/* Right section with details */}
      <div className="lg:w-1/3 flex flex-col p-4 space-y-6">
        {/* Color selector */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-gray-600">COULEUR:</span>
          <div className="flex space-x-2">
            {product.colours.map((color) => (
              <button
                key={color.id}
                onClick={() => handleColorChange(color)}
                className={`w-6 h-6 rounded-full border-2 ${selectedColor.id === color.id ? 'border-black' : 'border-gray-300'}`}
                style={{ backgroundColor: color.nameCouleur.toLowerCase() }}
                title={color.nameCouleur}
              />
            ))}
          </div>
        </div>

        {/* Size selector */}
        <div className="space-y-2">
          <span className="text-sm font-semibold text-gray-600">TAILLE:</span>
          <div className="flex justify-left space-x-1">
            {selectedColor.sizes?.map((size) => (
              <button
                key={size.id}
                onClick={() => handleSizeChange(size)}
                className={`px-2 py-1 text-xs border rounded ${
                  selectedSize?.id === size.id
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-100'
                }`}
              >
                {size.typeSize}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity selector and Add to Cart button */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="quantity" className="text-sm font-medium">Qté:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              className="w-16 px-2 py-1 text-sm border rounded"
            />
          </div>
          <button 
            onClick={handleAddToCart}
            className={`w-full py-2 mt-2 rounded-md text-sm font-semibold transition duration-300 ${
              selectedSize
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!selectedSize}
          >
            {selectedSize ? 'Ajouter au panier' : 'Sélectionnez une taille'}
          </button>
        </div>

        {/* Success message */}
        {isAdded && (
          <div className="bg-green-500 text-white py-2 px-4 text-center rounded-md transition-all duration-300 ease-in-out">
            <FiCheck className="inline-block mr-2" />
            Produit ajouté au panier!
          </div>
        )}

        {/* Composition and care */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">COMPOSITION ET ENTRETIEN</h2>
          <div className="flex space-x-3 text-sm">
            {['⚠️', '🌡️', '🧺', '🚫', '🧼'].map((icon, index) => (
              <div
                key={index}
                className="group relative flex items-center cursor-pointer text-gray-500"
              >
                <span className="text-gray-500 text-xl">{icon}</span>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1 w-48">
                  {['Attention : Ne pas laver à haute température.',
                    'Lavage en machine à 30°C maximum.',
                    'Lavable en machine.',
                    'Ne pas sécher en machine.',
                    'Utiliser un savon doux.'][index]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;