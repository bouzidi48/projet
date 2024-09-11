import React, { useState, useEffect } from 'react';
import { CartItemType } from '../../types/carte';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, updateQuantity, removeItem }) => {
  const [quantity, setQuantity] = useState(item.quantity.toString());

  useEffect(() => {
    setQuantity(item.quantity.toString());
  }, [item.quantity]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = e.target.value;
    setQuantity(newQuantity);
  };

  const handleQuantityBlur = () => {
    const newQuantity = parseInt(quantity, 10);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    } else {
      setQuantity(item.quantity.toString());
    }
  };

  const handleIncrement = () => {
    const newQuantity = parseInt(quantity, 10) + 1;
    setQuantity(newQuantity.toString());
    updateQuantity(item.id, newQuantity);
  };

  const handleDecrement = () => {
    const newQuantity = Math.max(1, parseInt(quantity, 10) - 1);
    setQuantity(newQuantity.toString());
    updateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex items-center justify-between border-b py-4">
      <div className="flex items-center">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover mr-4" />
        <div>
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-gray-600">{item.price.toFixed(2)} MAD</p>
          {item.color && <p className="text-sm text-gray-500">Couleur: {item.color}</p>}
          {item.size && <p className="text-sm text-gray-500">Taille: {item.size}</p>}
        </div>
      </div>
      <div className="flex items-center">
        <button 
          onClick={handleDecrement}
          className="px-2 py-1 border rounded"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <input
          type="text"
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={handleQuantityBlur}
          className="mx-2 w-16 text-center"
          aria-label="Item quantity"
        />
        <button 
          onClick={handleIncrement}
          className="px-2 py-1 border rounded"
          aria-label="Increase quantity"
        >
          +
        </button>
        <button 
          onClick={() => removeItem(item.id)}
          className="ml-4 text-red-500"
          aria-label="Remove item"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;