import React, { useState } from 'react';
import ProductList from '../product/ProductList';

// Définir les sous-catégories disponibles
const subCategories = ['Jeans', 'T-shirt', 'Robe', 'Mini-Jupes', 'Midi-Jupes'] as const;
type SubCategory = typeof subCategories[number];

const SousCategory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SubCategory | null>(null);

  return (
    <div className="container mx-auto px-4">
      {/* Menu de sous-catégories */}
      <div className="flex justify-center space-x-4 my-6">
        {subCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded ${selectedCategory === category ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Liste de produits filtrée par la sous-catégorie sélectionnée */}
      {selectedCategory ? (
        <ProductList searchTerm={selectedCategory} />
      ) : (
        <div className="text-center py-10">Veuillez sélectionner une sous-catégorie.</div>
      )}
    </div>
  );
};

export default SousCategory;