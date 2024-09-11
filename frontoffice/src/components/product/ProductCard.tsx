import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiCheck } from 'react-icons/fi';
import { Product } from '../../types/product';
import { useProduct } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import { useFavorites } from '../../contexts/FavoritesContext';
import axios from 'axios';
import { axiosInstance } from '../../services/api';


interface ProductCardProps {
  productId: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ productId }) => {
  const { product, loading, error } = useProduct(productId);
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [selectedColor, setSelectedColor] = useState<Product['colours'][0] | null>(null);
  const [selectedSize, setSelectedSize] = useState<Product['colours'][0]['sizes'][0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product && product.colours.length > 0) {
      setSelectedColor(product.colours[0]);
      setSelectedSize(product.colours[0].sizes?.[0] || null);
    }
  }, [product]);

  const handleColorChange = useCallback((color: Product['colours'][0]) => {
    setSelectedColor(color);
    setSelectedSize(color.sizes?.[0] || null);
  }, []);

  const handleSizeChange = useCallback((size: Product['colours'][0]['sizes'][0]) => {
    setSelectedSize(size);
  }, []);

  const handleQuantityChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  }, []);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (product) {
      toggleFavorite(product);
    }
  }, [product, toggleFavorite]);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (product && selectedColor && selectedSize) {
      try {
        console.log(quantity)
        const response = await axios.post('http://localhost:3000/api/product/createPanier', {
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

  if (loading) return <div className="rounded-lg shadow-lg p-4">Loading...</div>;
  if (error) return <div className="rounded-lg shadow-lg p-4 text-red-500">Error: {error.message}</div>;
  if (!product || !selectedColor) return null;

  return (
    <div className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 group relative">
      {isAdded && (
        <div className="absolute top-0 left-0 right-0 bg-green-500 text-white py-2 px-4 text-center z-10 rounded-t-lg transition-all duration-300 ease-in-out transform translate-y-0">
          <FiCheck className="inline-block mr-2" />
          Ajouté au panier!
        </div>
      )}
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          <img 
            src={selectedColor.images?.[0]?.UrlImage} 
            alt={product.nameProduct} 
            className="w-full h-64 object-cover rounded-t-lg"
          />
        </Link>
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-70 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-300 z-10"
        >
          <FiHeart 
            className={`w-6 h-6 ${isFavorite(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`}
          />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-4 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
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
              <div className="flex items-center space-x-2">
                <label htmlFor={`quantity-${product.id}`} className="text-sm font-medium">Qté:</label>
                <input
                  type="number"
                  id={`quantity-${product.id}`}
                  value={quantity}
                  onChange={handleQuantityChange}
                  min="1"
                  className="w-16 px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>
            <div className="flex justify-center space-x-1">
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
      </div>
      <Link to={`/product/${product.id}`} className="block p-4 bg-white rounded-b-lg">
        <h2 className="text-lg font-semibold truncate">{product.nameProduct}</h2>
        <p className="text-gray-600 font-medium">{product.price.toFixed(2)} MAD</p>
      </Link>
    </div>
  );
};

export default React.memo(ProductCard);