import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductList from '../product/ProductList'; // Assurez-vous que ce composant affiche les produits
import { axiosInstance } from '../../services/api'; // Assurez-vous que axiosInstance est bien configuré

// Type pour une sous-catégorie
type Subcategory = {
  id: number;
  nameCategory: string;
  image: any;
  products: Array<any>; // Si la liste des produits est incluse, ajustez ce type
};

const CategoryList: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Récupération de l'ID de la catégorie parente depuis l'URL
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer les sous-catégories
  const fetchSubcategories = async (categoryId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/categories/Subcategories/${categoryId}`);
      const subcategoriesData = response.data.data;
      setSubcategories(subcategoriesData); // Assurez-vous que la réponse renvoie bien `data.data`
      
      // Si la liste n'est pas vide, sélectionnez la première sous-catégorie par défaut
      if (subcategoriesData.length > 0) {
        setSelectedSubcategory(subcategoriesData[0]);
      }
    } catch (error) {
      setError('Erreur lors du chargement des sous-catégories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubcategories(id);
    }
  }, [id]); // Rechargement à chaque changement de catégorie parente

  return (
    <div className="container mx-auto px-4">
      <div>
        <h3 className="text-xs font-normal text-gray-800 uppercase tracking-wide mb-3">Catégories</h3>
        <div className="flex space-x-3"> {/* Aligne les boutons horizontalement */}
          {subcategories?.map((subcategory) => (
            <button
              key={subcategory.id}
              onClick={() => setSelectedSubcategory(subcategory)}
              className={`px-4 py-2 rounded flex items-center space-x-2 ${selectedSubcategory?.id === subcategory.id ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            >
              {/* Affichage de l'image associée à la sous-catégorie */}
              <img 
                src={subcategory.image.UrlImage} 
                alt={subcategory.nameCategory} 
                className="w-8 h-8 object-cover rounded-full" 
              />
              <span>{subcategory.nameCategory}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Affichage de la liste des produits filtrée par la sous-catégorie sélectionnée */}
      {selectedSubcategory ? (
        <ProductList categoryId={selectedSubcategory.id} />  
      ) : (
        <div className="text-center py-10">Veuillez sélectionner une sous-catégorie.</div>
      )}

      {loading && <div className="text-center py-10">Chargement...</div>}
      {error && <div className="text-center py-10 text-red-500">{error}</div>}
    </div>
  );
};

export default CategoryList;
