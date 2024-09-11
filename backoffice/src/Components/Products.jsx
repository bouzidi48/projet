import React, { useEffect, useState } from 'react';
import { CAlert, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCollapse, CModal, CModalBody, CModalFooter, CModalHeader, CSpinner } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import axiosInstance from '../axiosConfig';
import CIcon from '@coreui/icons-react';
import { cilPlus, cilTrash } from '@coreui/icons';
import { id } from 'date-fns/locale';
import axios from 'axios';

function Products(props) {
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dknd9q7kt/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'ecommerce_upload'; // Remplacez par votre nom de preset
  const [isUploading, setIsUploading] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [details, setDetails] = useState([]);
  const [editId, setEditId] = useState(null);
  const [importMode, setImportMode] = useState('url');
  const [importEditMode, setEditImportMode] = useState('url');
  const [editProduct, setEditProduct] = useState({
    id: Date.now(),
    nameProduct: '',
    description: '',
    price: 0,
    nomCategory: '',
    listeCouleur: [],
    listeAjouterCouleur: [],
    listeSupprimerCouleur: [],
  });
  const [namePoduct1, setNameProduct1] = useState('');
  const [idCouleur, setidCouleur] = useState(null);
  const [idSize, setidSize] = useState(null);
  const [idImage, setidImage] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [selectedColor, setSelectedColors] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [newProduct, setNewProduct] = useState({
    id: Date.now(),
    nameProduct: '',
    description: '',
    price: 0,
    nomCategory: '',
    listeCouleur: [],
  });


  const columns = [
    { key: 'id', label: 'ID', _style: { width: '10.5%', borderRight: '1px solid #e0e0e0' } },
    { key: 'nameProduct', label: 'Product Name', _style: { width: '16.66%', borderRight: '1px solid #e0e0e0' } },
    { key: 'description', label: 'Description', _style: { width: '26.5%', borderRight: '1px solid #e0e0e0' } },
    { key: 'price', label: 'Price', _style: { width: '12.5%', borderRight: '1px solid #e0e0e0' } },
    { key: 'category', label: 'Category', _style: { width: '16.66%', borderRight: '1px solid #e0e0e0' }, filter: true, sorter: true },
    { key: 'createdate', label: 'Create Date', _style: { width: '16.66%', borderRight: '1px solid #e0e0e0' } },
    { key: 'show_details', label: '', _style: { width: '1%' }, filter: false, sorter: false },
  ];

  useEffect(() => {
    axiosInstance.get('/product', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }) // Remplacez par l'URL de votre backend
      .then(response => {
        setProductsData(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 5000); // Automatically remove alert after 5 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [alertMessage]);
  useEffect(() => {
    axiosInstance.get('/categories', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }) // Remplacez par l'URL de votre backend
      .then(response => {
        setCategoriesData(response.data.data);
        console.log(response.data.data);
      })
      .catch(error => {
        console.error('There was an error fetching the products!', error);
      });
  }, []);
  const handleModeChange = () => {
    setImportMode((prevMode) => (prevMode === 'url' ? 'file' : 'url'));
  };
  const handleImageUpload = async (file, colourId, imageId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true); // Définir l'état de chargement à true

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.secure_url;
      setNewProduct((prevProduct) => {
        const updatedColours = prevProduct.listeCouleur.map((couleur) => {
          if (couleur.id === colourId) {
            const updatedImages = couleur.listeimage.map((image) =>
              image.id === imageId ? { ...image, UrlImage: imageUrl } : image
            );
            return { ...couleur, listeimage: updatedImages };
          }
          return couleur;
        });
        return { ...prevProduct, listeCouleur: updatedColours };
      });

      console.log('Image téléchargée avec succès sur Cloudinary:', imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image sur Cloudinary:', error);
    } finally {
      setIsUploading(false); // Remettre l'état de chargement à false
    }
  };
  const handleEditModeChange = () => {
    setEditImportMode((prevMode) => (prevMode === 'url' ? 'file' : 'url'));
    console.log(importEditMode);
  };
  const handleEditImageUpload = async (file, colId, imgId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setIsEditUploading(true); // Définir l'état de chargement à true

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.secure_url;
      // Mettre à jour l'image dans la liste principale listeCouleur
      const updatedColours = editProduct.listeCouleur.map(col => {
        if (col.id === colId) {
          const image = col.listeimage.find(img => img.id === imgId);
          if (image) {
            return {
              ...col,
              listeimage: col.listeimage.map(img =>
                img.id === imgId ? { ...img, urlImage: imageUrl } : img
              ),
            };
          }
          else {
            const image = col.listeAjouterImage.find(img => img.id === imgId);
            if (image) {
              return {
                ...col,
                listeAjouterImage: col.listeAjouterImage.map(img =>
                  img.id === imgId ? { ...img, UrlImage: imageUrl } : img
                ),
              }
            }
          }
        }
        return col;
      });

      // Si l'image n'a pas été trouvée et mise à jour, on cherche dans listeAjouterImage
      const updatedColours1 = editProduct.listeAjouterCouleur.map(col => {
        if (col.id === colId) {
          const image = col.listeimage.find(img => img.id === imgId);
          if (image) {
            return {
              ...col,
              listeimage: col.listeimage.map(img =>
                img.id === imgId ? { ...img, UrlImage: imageUrl } : img
              ),
            }
          }
        }
        return col;
      })


      setidImage(imgId)
      setEditProduct({ ...editProduct, listeCouleur: updatedColours, listeAjouterCouleur: updatedColours1 });

      console.log('Image téléchargée avec succès sur Cloudinary:', imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image sur Cloudinary:', error);
    } finally {
      setIsEditUploading(false); // Remettre l'état de chargement à false
    }
  };
  const handleNextImage = async(id) => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedColor[id].images.length);
  };

  const handlePreviousImage = async(id) => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + selectedColor[id].images.length) % selectedColor[id].images.length);
  };
  const colorMapping = (nameCouleur) => {
    // Liste des couleurs avec leurs codes hexadécimaux
    const colors = {
      '#FF0000': '#FF0000',
      '#FF4500': '#FF4500',
      '#FFD700': '#FFD700',
      '#9ACD32': '#9ACD32',
      '#00FA9A': '#00FA9A',
      '#00CED1': '#00CED1',
      '#1E90FF': '#1E90FF',
      '#000080': '#000080',
      '#4B0082': '#4B0082',
      '#800080': '#800080',
      '#FFFFFF': '#FFFFFF',
      '#000000': '#000000',
    };

    // Retourne la couleur correspondant au nomCouleur ou une couleur par défaut si non trouvée
    return colors[nameCouleur] || '#000000'; // Noir par défaut si la couleur n'est pas trouvée
  };

  const toggleDetails = (index, item) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();

    if (position !== -1) {
      // Fermer le produit, réinitialiser l'image sélectionnée pour ce produit
      newDetails.splice(position, 1);
      setSelectedColors((prevColors) => ({
        ...prevColors,
        [item.id]: null
      }));
    } else {
      // Ouvrir un nouveau produit, définir l'image pour le nouveau produit
      newDetails = [...details, index];
      setSelectedColors((prevColors) => ({
        ...prevColors,
        [item.id]: item.colours[0] // Choisir la première couleur du produit
      }));
    }

    setDetails(newDetails);
  };
  const handleColorSelect = (productId, colour) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [productId]: colour
    }));
    setCurrentImageIndex(0);
  };


  const handleDeleteClick = async (item) => {
    try {
      console.log(item);
      console.log(Array.isArray(item.colours))
      // Créer l'objet à envoyer au backend, basé sur RemoveProductDto
      const deleteProductPayload = {
        id: item.id,
        listeCouleur: Array.isArray(item.colours) && item.colours.length > 0
          ? item.colours.map(couleur => ({
            id: couleur.id,
            nameProduct: item.nameProduct,
            listeimage: Array.isArray(couleur.images) && couleur.images.length > 0
              ? couleur.images.map(image => ({
                id: image.id,
                nomCategorie: null,
                nameCouleur: couleur.nameCouleur,
              }))
              : [],
            listesize: Array.isArray(couleur.sizes) && couleur.sizes.length > 0
              ? couleur.sizes.map(size => ({
                id: size.id,
                idCouleur: couleur.id,
              }))
              : [],
          }))
          : [],
      };
      console.log(deleteProductPayload);
      const response = await axiosInstance.delete('/product/delete', {
        data: deleteProductPayload, // Envoie le payload comme corps de la requête
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      console.log('Product deleted:', response.data.message);

      // Mise à jour locale de la liste des produits
      setProductsData(prevProductsData =>
        prevProductsData.filter(product => product.id !== item.id)
      );
      setAlertMessage('✅Produit supprimé avec succès!');
      setAlertType('success');
    } catch (error) {
      console.log('Error deleting product:', error);
      if (error.response && error.response.status === 404) {
        setAlertMessage('❌ Vous devez vous connecter.');
        setAlertType('danger');
      } else {
        setAlertMessage('❌ Échec de la suppression.');
        setAlertType('danger');
      }
    }
  };



  const handleEditClick = (item) => {
    setEditId(item.id);
    setNameProduct1(item.nameProduct);
    const transformedProduct = {
      id: item.id,
      nameProduct: item.nameProduct,
      description: item.description,
      price: item.price,
      nomCategory: item.category?.nameCategory || '',
      listeCouleur: item.colours.map(couleur => ({
        id: couleur.id,
        nameCouleur: couleur.nameCouleur,
        listeimage: couleur.images.map(image => ({
          id: image.id,
          urlImage: image.UrlImage,
          nameCouleur: couleur.nameCouleur,
          nameProduct: item.nameProduct,
        })),
        listesize: couleur.sizes.map(size => ({
          id: size.id,
          idCouleur: couleur.id,
          typeSize: size.typeSize,
          stockQuantity: size.stockQuantity,
          nameCouleur: couleur.nameCouleur,
          nameProduct: item.nameProduct,
        })),
        listeAjouterImage: [],
        listeAjouterSize: [],
        listeSupprimerImage: [],
        listeSupprimerSize: [],
        nameProduct: item.nameProduct
      })),

      // Liste des couleurs à ajouter et à supprimer
      listeAjouterCouleur: [],
      listeSupprimerCouleur: [],
    };

    setEditProduct(transformedProduct);
  };


  const handleSaveEditProduct = async () => {
    console.log(editProduct)

    try {
      editProduct.id = parseInt(editProduct.id);
      console.log(editProduct.nameProduct)
      console.log(namePoduct1)
      // Créer une nouvelle liste sans les IDs
      const editProductWithId = {
        ...editProduct,

        nameProduct: ((editProduct.nameProduct === namePoduct1) ? null : editProduct.nameProduct),
        listeCouleur: editProduct.listeCouleur.map(couleur => {
          // Créer une copie de couleur sans ID
          const { ...couleurWithoutId } = couleur;
          return {
            ...couleurWithoutId,
            id: parseInt(couleur.id, 10),
            nameCouleur: ((idCouleur === null) ? null : couleur.nameCouleur),
            listesize: couleur.listesize.map(size => {
              // Créer une copie de size sans ID
              const { ...sizeWithoutId } = size;
              console.log(idSize)
              return {
                ...sizeWithoutId,
                id: parseInt(size.id, 10),
                typeSize: ((idSize === null) ? null : size.typeSize),
                stockQuantity: parseInt(size.stockQuantity, 10),
                
              };
            }),
            listeimage: couleur.listeimage.map(image => {
              // Créer une copie de image sans ID
              const { ...imageWithoutId } = image;
              return {
                id: parseInt(image.id, 10),
                urlImage: ((idImage === null) ? null : image.UrlImage),
                ...imageWithoutId,
              };
            }),
            listeAjouterImage: couleur.listeAjouterImage.map(image => {
              // Créer une copie de image sans ID
              const { id, ...imageWithoutId } = image;
              return {
                ...imageWithoutId,


              };
            }),
            listeAjouterSize: couleur.listeAjouterSize.map(size => {
              // Créer une copie de image sans ID
              const { id, ...sizeWithoutId } = size;
              return {
                ...sizeWithoutId,
                stockQuantity: parseInt(size.stockQuantity, 10),
              };
            }),
            listeSupprimerImage: couleur.listeSupprimerImage.map(image => {
              // Créer une copie de image sans ID
              const { ...imageWithoutId } = image;
              return {
                id: parseInt(image.id, 10),
                ...imageWithoutId,
              };
            }),
            listeSupprimerSize: couleur.listeSupprimerSize.map(size => {
              // Créer une copie de image sans ID
              const { ...sizeWithoutId } = size;
              return {
                id: parseInt(size.id, 10),
                ...sizeWithoutId,
              };
            }),
          };
        }),
        listeAjouterCouleur: editProduct.listeAjouterCouleur.map(couleur => {
          const { id, ...couleurWithoutId } = couleur;
          return {
            ...couleurWithoutId,
            listesize: couleur.listesize.map(size => {
              // Créer une copie de size sans ID
              const { id, ...sizeWithoutId } = size;
              return {
                ...sizeWithoutId,
                stockQuantity: parseInt(size.stockQuantity, 10),
              };
            }),
            listeimage: couleur.listeimage.map(image => {
              // Créer une copie de image sans ID
              const { id, ...imageWithoutId } = image;
              return {
                ...imageWithoutId,
              };
            }),
          };
        }),
        listeSupprimerCouleur: editProduct.listeSupprimerCouleur.map(couleur => {
          // Créer une copie de couleur sans ID
          const { ...couleurWithoutId } = couleur;
          return {
            id: parseInt(couleur.id, 10),
            ...couleurWithoutId,
            listesize: couleur.listesize.map(size => {
              // Créer une copie de size sans ID
              const { ...sizeWithoutId } = size;
              return {
                id: parseInt(size.id, 10),
                ...sizeWithoutId,

              };
            }),
            listeimage: couleur.listeimage.map(image => {
              // Créer une copie de image sans ID
              const { ...imageWithoutId } = image;
              return {
                id: parseInt(image.id, 10),
                ...imageWithoutId,
              };
            }),
          }
        }),

      };
      console.log(editProductWithId)
      const response = await axiosInstance.put('/product/update', editProductWithId, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('New product added:', response.data.data);
      // Filtrer le produit à supprimer
      const filteredProducts = productsData.filter((product) => product.id !== editProductWithId.id);

      // Ajouter le produit mis à jour
      const updatedProducts = await [...filteredProducts, response.data.data];

      await setProductsData(updatedProducts);
      toggleDetails(response.data.data.id, response.data.data);
      setAlertMessage('✅ Produit mis à jour avec succès!');
      setAlertType('success');

    } catch (error) {
      console.error('Error saving product:', error);
      setAlertMessage('❌ Échec de mise à jour.');
      setAlertType('danger');
    }
    setEditId(null);
    setEditProduct(null);
  };

  const handleCancelEditProduct = () => {
    setEditId(null);
    setEditProduct(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: value,
    });
  };

  const handleEditColourChange = (color, colId) => {
    const updatedColours = editProduct.listeCouleur.map((col) =>
      col.id === colId ? { ...col, nameCouleur: color } : col
    );
    const updatedCouleurs = editProduct.listeAjouterCouleur.map((col) =>
      col.id === colId ? { ...col, nameCouleur: color } : col
    );
    setEditProduct({ ...editProduct, listeCouleur: updatedColours, listeAjouterCouleur: updatedCouleurs });
    setidCouleur(colId);
  };
  const handleDeleteEditColour = (colId) => {
    let deleteColour = editProduct.listeCouleur.find((col) => col.id === colId);

    if (deleteColour) {
      // Transformer chaque image et taille selon les DTOs
      const transformedListeImage = deleteColour.listeimage.map((img) => ({
        id: img.id,
        nomCategorie: editProduct.nomCategory || '',
        nameCouleur: deleteColour.nameCouleur,
      }));

      const transformedListeSize = deleteColour.listesize.map((size) => ({
        id: size.id,
        idCouleur: deleteColour.id,
      }));

      const transformedDeleteCouleur = {
        id: deleteColour.id,
        nameProduct: editProduct.nameProduct,
        listeimage: transformedListeImage,
        listesize: transformedListeSize,
      };

      const updatedColours = editProduct.listeCouleur.filter((col) => col.id !== colId);

      setEditProduct({
        ...editProduct,
        listeCouleur: updatedColours,
        listeSupprimerCouleur: [...editProduct.listeSupprimerCouleur, transformedDeleteCouleur],
      });
    } else {
      deleteColour = editProduct.listeAjouterCouleur.find((col) => col.id === colId);

      if (deleteColour) {
        const updatedAddColours = editProduct.listeAjouterCouleur.filter((col) => col.id !== colId);

        setEditProduct({
          ...editProduct,
          listeAjouterCouleur: updatedAddColours,
        });
      }
    }
  };



  const handleAddEditColour = () => {
    const newColour = {
      id: Date.now(), // Remplacez par une méthode d'incrémentation si nécessaire
      nameCouleur: '',
      nameProduct: editProduct.nameProduct,
      listesize: [],
      listeimage: [],
    };
    setEditProduct({
      ...editProduct,
      listeAjouterCouleur: [...editProduct.listeAjouterCouleur, newColour],
    });
  };


  const handleEditSizeChange = (e, colId, sizeId) => {
    const { name, value } = e.target;

    // Mettre à jour l'image dans la liste principale listeCouleur
    const updatedColours = editProduct.listeCouleur.map(col => {
      if (col.id === colId) {
        const size = col.listesize.find(siz => siz.id === sizeId);
        if (size) {
          return {
            ...col,
            listesize: col.listesize.map(siz =>
              siz.id === sizeId ? { ...siz, [name]: value } : siz
            ),
          };
        }
        else {
          const size = col.listeAjouterSize.find(siz => siz.id === sizeId);
          if (size) {
            return {
              ...col,
              listeAjouterSize: col.listeAjouterSize.map(siz =>
                siz.id === sizeId ? { ...siz, [name]: value } : siz
              ),
            }
          }
        }
      }
      return col;
    });

    // Si l'image n'a pas été trouvée et mise à jour, on cherche dans listeAjouterImage
    const updatedColours1 = editProduct.listeAjouterCouleur.map(col => {
      if (col.id === colId) {
        const size = col.listesize.find(siz => siz.id === sizeId);
        if (size) {
          return {
            ...col,
            listesize: col.listesize.map(siz =>
              siz.id === sizeId ? { ...siz, [name]: value } : siz
            ),
          }
        }
      }
      return col;
    })
    console.log(name)


    setEditProduct({ ...editProduct, listeCouleur: updatedColours, listeAjouterCouleur: updatedColours1 });
    if(name === 'typeSize') {
      
      setidSize(sizeId);
    }
    
  };

  const handleDeleteEditSize = (colId, sizeId) => {
    // Chercher d'abord dans listeCouleur
    const updatedListeCouleur = editProduct.listeCouleur.map((col) => {
      if (col.id === colId) {
        // Chercher dans listesize
        const foundSize = col.listesize.find((size) => size.id === sizeId);
        if (foundSize) {
          return {
            ...col,
            listesize: col.listesize.filter((size) => size.id !== sizeId),
            listeSupprimerSize: [...col.listeSupprimerSize, { id: foundSize.id, nameCouleur: col.nameCouleur }],
          };
        }

        // Si non trouvé dans listesize, chercher dans listeAjouterSize
        const foundSizeInAjouter = col.listeAjouterSize.find((size) => size.id === sizeId);
        if (foundSizeInAjouter) {
          return {
            ...col,
            listeAjouterSize: col.listeAjouterSize.filter((size) => size.id !== sizeId),
          };
        }
      }
      return col;
    });

    // Si non trouvé dans listeCouleur, chercher dans listeAjouterCouleur
    const updatedListeAjouterCouleur = editProduct.listeAjouterCouleur.map((col) => {
      if (col.id === colId) {
        // Chercher dans listesize
        const foundSize = col.listsize.find((size) => size.id === sizeId);
        if (foundSize) {
          return {
            ...col,
            listesize: col.listsize.filter((size) => size.id !== sizeId),
          };
        }
      }
      return col;
    });

    // Mettre à jour l'état avec les nouvelles valeurs
    setEditProduct({
      ...editProduct,
      listeCouleur: updatedListeCouleur,
      listeAjouterCouleur: updatedListeAjouterCouleur,
    });
  };

  const handleAddEditSize = (colId) => {


    const updatedListeCouleur = editProduct.listeCouleur.map((col) => {
      if (col.id === colId) {
        // Ajouter à listeAjouterSize si colId correspond à une couleur dans listeCouleur
        return {
          ...col,
          listeAjouterSize: [...col.listeAjouterSize, { id: Date.now(), typeSize: '', stockQuantity: 0, nameCouleur: col.nameCouleur, nameProduct: editProduct.nameProduct }]
        };
      }
      return col;
    });

    const updatedListeAjouterCouleur = editProduct.listeAjouterCouleur.map((col) => {
      if (col.id === colId) {
        // Ajouter à listesize si colId correspond à une couleur dans listeAjouterCouleur
        return {
          ...col,
          listesize: [...col.listesize, { id: Date.now(), typeSize: '', stockQuantity: 0, nameCouleur: col.nameCouleur, nameProduct: editProduct.nameProduct }]
        };
      }
      return col;
    });

    // Mettre à jour l'état avec les nouvelles valeurs
    setEditProduct({
      ...editProduct,
      listeCouleur: updatedListeCouleur,
      listeAjouterCouleur: updatedListeAjouterCouleur,
    });

  };


  const handleEditImageChange = (e, colId, imgId) => {
    const { name, value, files, type } = e.target;
    if (type === 'file') {
      const file = files[0];
      handleEditImageUpload(file, colId, imgId);
    }
    else {

      // Mettre à jour l'image dans la liste principale listeCouleur
      const updatedColours = editProduct.listeCouleur.map(col => {
        if (col.id === colId) {
          const image = col.listeimage.find(img => img.id === imgId);
          if (image) {
            return {
              ...col,
              listeimage: col.listeimage.map(img =>
                img.id === imgId ? { ...img, [name]: value } : img
              ),
            };
          }
          else {
            const image = col.listeAjouterImage.find(img => img.id === imgId);
            if (image) {
              return {
                ...col,
                listeAjouterImage: col.listeAjouterImage.map(img =>
                  img.id === imgId ? { ...img, [name]: value } : img
                ),
              }
            }
          }
        }
        return col;
      });

      // Si l'image n'a pas été trouvée et mise à jour, on cherche dans listeAjouterImage
      const updatedColours1 = editProduct.listeAjouterCouleur.map(col => {
        if (col.id === colId) {
          const image = col.listeimage.find(img => img.id === imgId);
          if (image) {
            return {
              ...col,
              listeimage: col.listeimage.map(img =>
                img.id === imgId ? { ...img, [name]: value } : img
              ),
            }
          }
        }
        return col;
      })


      setidImage(imgId)
      setEditProduct({ ...editProduct, listeCouleur: updatedColours, listeAjouterCouleur: updatedColours1 });
    }
  };

  const handleDeleteEditImage = (colId, imgId) => {
    const updatedColours = editProduct.listeCouleur.map((col) => {
      if (col.id === colId) {
        const imageToDelete = col.listeimage.find((img) => img.id === imgId);
        if (imageToDelete) {
          return {
            ...col,
            listeimage: col.listeimage.filter((img) => img.id !== imgId),
            listeSupprimerImage: [...col.listeSupprimerImage, { id: imageToDelete.id, nomCategorie: null, nameCouleur: col.nameCouleur }],
          };
        }
        else {
          const imageToDelete = col.listeAjouterImage.find((img) => img.id === imgId);
          if (imageToDelete) {
            return {
              ...col,
              listeAjouterImage: col.listeAjouterImage.filter((img) => img.id !== imgId),
            }
          }
        }
      }
      return col;
    });

    const updatedAddedColours = editProduct.listeAjouterCouleur.map((col) => {
      if (col.id === colId) {
        const imageToDelete = col.listeimage.find((img) => img.id === imgId);
        if (imageToDelete) {
          return {
            ...col,
            listeimage: col.listeimage.filter((img) => img.id !== imgId),
          };
        }
      }
      return col;
    });

    setEditProduct({
      ...editProduct,
      listeCouleur: updatedColours,
      listeAjouterCouleur: updatedAddedColours
    });
  };


  const handleAddEditImage = (colId) => {
    const updatedColours = editProduct.listeCouleur.map((col) => {
      if (col.id === colId) {
        // Si l'ID de couleur correspond, ajoutez l'image à listeAjouterImage
        return {
          ...col,
          listeAjouterImage: [...col.listeAjouterImage, { id: Date.now(), UrlImage: '', nameCouleur: col.nameCouleur, nameProduct: editProduct.nameProduct }],

        };
      } else {
        return col;
      }
    });

    const foundInAddedColours = editProduct.listeAjouterCouleur.find(col => col.id === colId);

    if (foundInAddedColours) {
      const updatedAddedColours = editProduct.listeAjouterCouleur.map(col =>
        col.id === colId ? {
          ...col,
          listeimage: [...col.listeimage, { id: Date.now(), UrlImage: '', nameCouleur: col.nameCouleur, nameProduct: editProduct.nameProduct }],

        } : col
      );

      setEditProduct({
        ...editProduct,
        listeCouleur: updatedColours,
        listeAjouterCouleur: updatedAddedColours
      });
    } else {
      setEditProduct({ ...editProduct, listeCouleur: updatedColours });
    }
  };


  // Fonction pour gérer les changements dans les champs généraux du produit
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  // Fonction pour changer la couleur de manière indépendante
  const handleNewColourChange = (selectedColor, colourId) => {
    setNewProduct((prevProduct) => {
      const updatedColours = prevProduct.listeCouleur.map((couleur) =>
        couleur.id === colourId ? { ...couleur, nameCouleur: selectedColor } : couleur
      );
      return { ...prevProduct, listeCouleur: updatedColours };
    });
  };

  // Fonction pour gérer les changements dans les tailles de manière indépendante
  const handleNewSizeChange = (e, colourId, sizeId) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => {
      const updatedColours = prevProduct.listeCouleur.map((couleur) => {
        if (couleur.id === colourId) {
          const updatedSizes = couleur.listesize.map((size) =>
            size.id === sizeId ? { ...size, [name]: value } : size
          );
          return { ...couleur, listesize: updatedSizes };
        }
        return couleur;
      });
      return { ...prevProduct, listeCouleur: updatedColours };
    });
  };

  // Fonction pour gérer les changements dans les images de manière indépendante
  const handleNewImageChange = (e, colourId, imageId) => {
    const { name, value, files, type } = e.target;

    setNewProduct((prevProduct) => {
      const updatedColours = prevProduct.listeCouleur.map((couleur) => {
        if (couleur.id === colourId) {
          const updatedImages = couleur.listeimage.map((image) => {
            if (image.id === imageId) {
              if (type === 'file') {

                const file = files[0];
                handleImageUpload(file, colourId, imageId);

                // Vous devez implémenter cette fonction pour gérer le téléchargement des images.

              } else {
                return {
                  ...image,
                  [name]: value // Mettez à jour les autres propriétés de l'image.
                };
              }
            }
            return image;
          });
          return { ...couleur, listeimage: updatedImages };
        }
        return couleur;
      });
      return { ...prevProduct, listeCouleur: updatedColours };
    });
  };


  // Fonction pour ajouter une nouvelle taille avec un ID unique à une couleur spécifique
  const handleAddNewSize = (colourId) => {
    setNewProduct((prevProduct) => {
      const updatedColours = prevProduct.listeCouleur.map((couleur) => {
        if (couleur.id === colourId) {
          return {
            ...couleur,
            listesize: [
              ...couleur.listesize,
              { id: Date.now(), typeSize: '', stockQuantity: 0, nameCouleur: couleur.nameCouleur, nameProduct: prevProduct.nameProduct },
            ],
          };
        }
        return couleur;
      });
      return { ...prevProduct, listeCouleur: updatedColours };
    });
  };

  // Fonction pour ajouter une nouvelle image avec un ID unique à une couleur spécifique
  const handleAddNewImage = (colourId) => {
    setNewProduct((prevProduct) => {
      const updatedColours = prevProduct.listeCouleur.map((couleur) => {
        if (couleur.id === colourId) {
          return {
            ...couleur,
            listeimage: [
              ...couleur.listeimage,
              { id: Date.now(), UrlImage: '', nameCouleur: couleur.nameCouleur, nameProduct: prevProduct.nameProduct },
            ],
          };
        }
        return couleur;
      });
      return { ...prevProduct, listeCouleur: updatedColours };
    });
  };

  // Fonction pour ajouter une nouvelle couleur avec un ID unique
  const handleAddNewColour = () => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      listeCouleur: [
        ...prevProduct.listeCouleur,
        {
          id: Date.now(), // ID unique basé sur le timestamp actuel
          nameCouleur: '',
          nameProduct: prevProduct.nameProduct,
          listesize: [],
          listeimage: []
        },
      ],
    }));
  };

  // Fonction pour sauvegarder le nouveau produit
  const handleSaveNewProduct = async () => {
    console.log(newProduct);

    try {
      newProduct.price = parseFloat(newProduct.price);

      // Créer une nouvelle liste sans les IDs
      const newProductWithoutId = {
        ...newProduct,
        listeCouleur: newProduct.listeCouleur.map(couleur => {
          // Créer une copie de couleur sans ID
          const { id, ...couleurWithoutId } = couleur;
          return {
            ...couleurWithoutId,
            listesize: couleur.listesize.map(size => {
              // Créer une copie de size sans ID
              const { id, ...sizeWithoutId } = size;
              return {
                ...sizeWithoutId,
                stockQuantity: parseInt(size.stockQuantity, 10),
              };
            }),
            listeimage: couleur.listeimage.map(image => {
              // Créer une copie de image sans ID
              const { id, ...imageWithoutId } = image;
              return {
                ...imageWithoutId,
              };
            }),
          };
        }),
      };
      const { id, ...productWithoutId } = newProductWithoutId;
      const response = await axiosInstance.post('/product/create', productWithoutId, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      console.log('New product added:', response.data.data);
      setProductsData((prevProductsData) => [...prevProductsData, response.data.data]);
      setAlertMessage('✅ Produit ajouté');
      setAlertType('success');
    } catch (error) {
      console.error('Error saving product:', error);
      setAlertMessage('❌ Échec de l\'ajout du produit');
      setAlertType('danger');
    }
    setIsAdding(false);
    resetNewProduct();
  };


  // Fonction pour annuler la création du nouveau produit
  const handleCancelNewProduct = () => {
    setIsAdding(false);
    resetNewProduct();
  };

  // Fonction pour réinitialiser le formulaire de nouveau produit
  const resetNewProduct = () => {
    setNewProduct({
      nameProduct: '',
      description: '',
      price: 0,
      nomCategory: '',
      listeCouleur: [],
    });
  };

  // Fonction pour basculer en plein écran (optionnelle, selon vos besoins)
  const toggleFullScreen = () => {
    setIsFullScreen(prevState => !prevState);
  };

  const handleDeleteNewSize = (colourId, sizeId) => {
    setNewProduct((prevProduct) => {
      const updatedColours = prevProduct.listeCouleur.map((couleur) => {
        if (couleur.id === colourId) {
          return {
            ...couleur,
            listesize: couleur.listesize.filter((size) => size.id !== sizeId),
          };
        }
        return couleur;
      });
      return { ...prevProduct, listeCouleur: updatedColours };
    });
  };

  const handleDeleteNewImage = (colourId, imageId) => {
    setNewProduct((prevProduct) => {
      const updatedColours = prevProduct.listeCouleur.map((couleur) => {
        if (couleur.id === colourId) {
          return {
            ...couleur,
            listeimage: couleur.listeimage.filter((image) => image.id !== imageId),
          };
        }
        return couleur;
      });
      return { ...prevProduct, listeCouleur: updatedColours };
    });
  };

  const handleDeleteNewColour = (colourId) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      listeCouleur: prevProduct.listeCouleur.filter((couleur) => couleur.id !== colourId),
    }));
  };


  return (

    <div className="container mx-auto">
      <div className="flex justify-between items-center my-4">
        <h2 className="text-center">Product List</h2>
        {/* Afficher l'alerte si un message existe */}
        {alertMessage && (
          <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
            <CAlert color={alertType} className="small-alert" dismissible onClose={() => setAlertMessage('')}>
              {alertMessage}
            </CAlert>
          </div>
        )}
        <CButton color="success" onClick={() => setIsAdding(true)}>
          Ajouter Produit
        </CButton>
      </div>
      <div className="overflow-x-auto">
        <CModal
          visible={isAdding}
          onClose={() => setIsAdding(false)}
          size={props.isLg === true ? 'lg' : 'md'}
        >
          <CModalHeader
            closeButton={true}
            className={
              props.theme === 'dark'
                ? 'bg-slate-700 text-white p-4 mt-auto border'
                : 'bg-slate-0 text-dark p-4 mt-auto border'
            }
          >
            <h5>Ajouter Nouveau Produit</h5>
          </CModalHeader>
          <CModalBody
            className={
              props.theme === 'dark'
                ? 'bg-slate-700 text-white p-4 mt-auto border-r border-l'
                : 'bg-slate-0 text-dark p-4 mt-auto border-l border-r'
            }
          >
            <div className="mb-2">
              <label htmlFor="nameProduct" className="font-bold mb-2">
                Product Name
              </label>
              <input
                type="text"
                id="nameProduct"
                name="nameProduct"
                value={newProduct.nameProduct}
                onChange={handleNewProductChange}
                className="form-control w-auto h-auto"
                placeholder="Product Name"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="description" className="font-bold mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                className="form-control"
                placeholder="Description"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="price" className="font-bold mb-2">
                Price
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                className="form-control w-auto h-auto"
                placeholder="Price"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="category" className="font-bold mb-2">
                Category
              </label>
              <select
                id="category"
                name="nomCategory"
                value={newProduct.nomCategory}
                onChange={handleNewProductChange}
                className="form-control w-auto h-auto"
              >
                <option value="">Select a category</option>
                {categoriesData.map((category) => (
                  <option key={category.id} value={category.nameCategory}>
                    {category.nameCategory}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-2">
              <label htmlFor="colours" className="font-bold">
                Colours:
              </label>
              <div>
                {newProduct.listeCouleur.map((col) => (
                  <div key={col.id} className="mb-4">
                    <label htmlFor="colours" className="font-bold mb-2">
                      Colour
                    </label>
                    <div className="flex space-x-2 items-center">
                      {[
                        '#FF0000',
                        '#FF4500',
                        '#FFD700',
                        '#9ACD32',
                        '#00FA9A',
                        '#00CED1',
                        '#1E90FF',
                        '#000080',
                        '#4B0082',
                        '#800080',
                        '#000000', // Noir
                        '#FFFFFF',
                      ].map((color) => (
                        <div
                          key={color}
                          onClick={() => handleNewColourChange(color, col.id)}
                          style={{
                            backgroundColor: color,
                            width: '30px',
                            height: '30px',
                            cursor: 'pointer',
                            border:
                              col.nameCouleur === color
                                ? '2px solid black'
                                : '1px solid #ccc',
                          }}
                          title={color}
                        />
                      ))}
                      <CIcon
                        icon={cilTrash}
                        className="text-red-500 cursor-pointer hover:text-red-700"
                        style={{ fontSize: '1.5rem', marginLeft: '8px' }}
                        onClick={() => handleDeleteNewColour(col.id)}
                      />
                    </div>
                    <div className="mt-4">
                      <label className="font-bold mb-2">Sizes:</label>
                      {col.listesize.map((size) => (
                        <div key={size.id} className="mb-2 flex items-center">
                          <input
                            type="text"
                            name="typeSize"
                            value={size.typeSize}
                            onChange={(e) =>
                              handleNewSizeChange(e, col.id, size.id)
                            }
                            className="form-control w-auto h-auto mb-1 mr-2"
                            placeholder="Size"
                          />
                          <input
                            type="number"
                            name="stockQuantity"
                            value={size.stockQuantity}
                            onChange={(e) =>
                              handleNewSizeChange(e, col.id, size.id)
                            }
                            className="form-control w-auto h-auto"
                            placeholder="Stock Quantity"
                          />
                          <CIcon
                            icon={cilTrash}
                            className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                            style={{ fontSize: '1.2rem' }}
                            onClick={() => handleDeleteNewSize(col.id, size.id)}
                          />
                        </div>
                      ))}
                      <CIcon
                        icon={cilPlus}
                        className="text-blue-500 cursor-pointer hover:text-blue-700 mt-2"
                        style={{ fontSize: '1.5rem' }}
                        onClick={() => handleAddNewSize(col.id)}
                      />
                    </div>
                    <div className="mt-4">
                      <label className="font-bold">Images:</label>
                      {col.listeimage.map((img) => (
                        <div key={img.id} className="mb-2 flex items-center">
                          {importMode === 'url' ? (
                            <>
                              <input
                                type="text"
                                name="UrlImage"
                                value={img.UrlImage}
                                onChange={(e) => handleNewImageChange(e, col.id, img.id)}
                                className="form-control w-1/2 h-10 mb-1 mr-2"
                                placeholder="Image URL"
                              />
                              <CIcon
                                icon={cilTrash}
                                className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                style={{ fontSize: '1.2rem' }}
                                onClick={() => handleDeleteNewImage(col.id, img.id)}
                              />
                            </>
                          ) : (
                            <>
                              <input
                                type="file"
                                name="UrlImage"
                                onChange={(e) => handleNewImageChange(e, col.id, img.id)}
                                className="form-control w-1/2 h-10 mb-1 mr-2"
                                placeholder="Upload Image"
                              />
                              <CIcon
                                icon={cilTrash}
                                className="text-red-500 mr-2 cursor-pointer hover:text-red-700 ml-2"
                                style={{ fontSize: '1.2rem' }}
                                onClick={() => handleDeleteNewImage(col.id, img.id)}
                              />
                            </>
                          )}
                          <div className='ml-2'>
                            <label>
                              <input
                                type="checkbox"
                                checked={importMode === 'file'}
                                onChange={handleModeChange}
                              />
                              Importer une image
                            </label>
                          </div>
                        </div>
                      ))}

                      <CIcon
                        icon={cilPlus}
                        className="text-blue-500 cursor-pointer hover:text-blue-700 mt-2"
                        style={{ fontSize: '1.5rem' }}
                        onClick={() => handleAddNewImage(col.id)}
                      />
                    </div>
                  </div>
                ))}
                <CIcon
                  icon={cilPlus}
                  className="text-blue-500 cursor-pointer hover:text-blue-700 mt-4"
                  style={{ fontSize: '1.5rem' }}
                  onClick={handleAddNewColour}
                />
              </div>
            </div>
          </CModalBody>
          <div
            className={
              props.theme === 'dark'
                ? 'bg-slate-700 border-l border-r border-b rounded-b-lg'
                : 'bg-slate-0 border-r border-l border-b rounded-b-lg'
            }
          >
            <CModalFooter>
              <CButton color="success" onClick={handleSaveNewProduct} className="mr-2" disabled={isUploading}>
                {isUploading ? (
                  <span>
                    <CSpinner size="sm" /> Saving...
                  </span>
                ) : (
                  'Save'
                )}
              </CButton>
              <CButton color="danger" onClick={handleCancelNewProduct}>
                Cancel
              </CButton>
            </CModalFooter>
          </div>
        </CModal>



        <CSmartTable
          striped
          className={props.theme === 'dark' ? 'bg-dark text-white text-center p-4 mt-auto border' : 'bg-slate-0 text-dark text-center p-4 mt-auto border'}
          activePage={1}
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={productsData}
          itemsPerPageSelect
          itemsPerPage={5}
          pagination
          onFilteredItemsChange={(items) => {
            console.log(items);
          }}
          onSelectedItemsChange={(items) => {
            console.log(items);
          }}
          scopedColumns={{
            id: (item) => (
              <td className="border border-gray-200">{item.id}</td>
            ),
            nameProduct: (item) => (
              <td className="border border-gray-200">{item.nameProduct}</td>
            ),
            description: (item) => (
              <td className="border border-gray-200">{item.description}</td>
            ),
            price: (item) => (
              <td className="border border-gray-200">{item.price}DH</td>
            ),
            category: (item) => (
              <td className="border border-gray-200">{item.category ? item.category.nameCategory : 'N/A'}</td>
            ),
            createdate: (item) => (
              <td className="border border-gray-200">
                {format(new Date(item.createdate), 'yyyy-MM-dd')}
              </td>
            ),

            show_details: (item) => (
              <td className="py-2 text-center border border-gray-200">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    toggleDetails(item.id, item);
                  }}
                  className="inline-flex"
                >
                  {details.includes(item.id) ? 'Hide' : 'Show'}
                </CButton>
              </td>
            ),
            details: (item) => (
              <CCollapse visible={details.includes(item.id)}>
                <CCardBody className="p-3 border border-gray-200">
                  {editId === item.id ?
                    (
                      <div className="space-y-2">
                        <h3 className="text-center text-lg font-bold mb-4">Edit Product: {item.nameProduct}</h3>
                        <div className="mb-2">
                          <label htmlFor="nameProduct" className="font-bold">Product Name</label>
                          <input
                            type="text"
                            id="nameProduct"
                            name="nameProduct"
                            value={editProduct.nameProduct}
                            onChange={handleEditInputChange}
                            className="form-control w-auto h-auto"
                          />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="description" className="font-bold">Description</label>
                          <textarea
                            id="description"
                            name="description"
                            value={editProduct.description}
                            onChange={handleEditInputChange}
                            className="form-control w-32 h-10"
                          />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="price" className="font-bold">Price</label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={editProduct.price}
                            onChange={handleEditInputChange}
                            className="form-control w-auto h-auto"
                          />
                        </div>
                        <div className="mb-2">
                          <label htmlFor="category" className="font-bold">
                            Category
                          </label>
                          <select
                            id="nomCategory"
                            name="nomCategory"
                            value={editProduct.nomCategory || ""}
                            onChange={handleEditInputChange}
                            className="form-control w-auto h-auto"
                          >
                            <option value="">Select a category</option>
                            {categoriesData.map((category) => (
                              <option key={category.id} value={category.nameCategory}>
                                {category.nameCategory}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-2">
                          <label htmlFor="colours" className="font-bold">Colours:</label>
                          <div>
                            {/* Parcourir listeCouleur */}
                            {editProduct.listeCouleur.map((col) => (
                              <div key={col.id} className="mb-4">
                                <label htmlFor="colours" className="font-bold mb-2">Colour</label>
                                <div className="flex space-x-2 items-center">
                                  {[
                                    '#FF0000', '#FF4500', '#FFD700', '#9ACD32', '#00FA9A', '#00CED1',
                                    '#1E90FF', '#000080', '#4B0082', '#800080', '#000000', // Noir
                                    '#FFFFFF',
                                  ].map((color) => (
                                    <div
                                      key={color}
                                      onClick={() => handleEditColourChange(color, col.id)}
                                      style={{
                                        backgroundColor: color,
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        border: col.nameCouleur === color ? '3px solid black' : '1px solid #ccc',
                                      }}
                                      title={color}
                                    />
                                  ))}
                                  <CIcon
                                    icon={cilTrash}
                                    className="text-red-500 cursor-pointer hover:text-red-700"
                                    style={{ fontSize: '1.5rem', marginLeft: '8px' }}
                                    onClick={() => handleDeleteEditColour(col.id)}
                                  />
                                </div>
                                <div className="mt-4">
                                  <label className="font-bold mb-2">Sizes:</label>
                                  {col.listesize.map((size) => (
                                    <div key={size.id} className="mb-2 flex items-center">
                                      <input
                                        type="text"
                                        name="typeSize"
                                        value={size.typeSize}
                                        onChange={(e) => handleEditSizeChange(e, col.id, size.id)}
                                        className="form-control w-auto h-auto mb-1 mr-2"
                                        placeholder="Size"
                                      />
                                      <input
                                        type="number"
                                        name="stockQuantity"
                                        value={size.stockQuantity}
                                        onChange={(e) => handleEditSizeChange(e, col.id, size.id)}
                                        className="form-control w-auto h-auto"
                                        placeholder="Stock Quantity"
                                      />
                                      <CIcon
                                        icon={cilTrash}
                                        className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                        style={{ fontSize: '1.2rem' }}
                                        onClick={() => handleDeleteEditSize(col.id, size.id)}
                                      />
                                    </div>
                                  ))}
                                  {col.listeAjouterSize.map((size) => (
                                    <div key={size.id} className="mb-2 flex items-center">
                                      <input
                                        type="text"
                                        name="typeSize"
                                        value={size.typeSize}
                                        onChange={(e) => handleEditSizeChange(e, col.id, size.id)}
                                        className="form-control w-auto h-auto mb-1 mr-2"
                                        placeholder="Size"
                                      />
                                      <input
                                        type="number"
                                        name="stockQuantity"
                                        value={size.stockQuantity}
                                        onChange={(e) => handleEditSizeChange(e, col.id, size.id)}
                                        className="form-control w-auto h-auto"
                                        placeholder="Stock Quantity"
                                      />
                                      <CIcon
                                        icon={cilTrash}
                                        className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                        style={{ fontSize: '1.2rem' }}
                                        onClick={() => handleDeleteEditSize(col.id, size.id)}
                                      />
                                    </div>
                                  ))}
                                  <CIcon
                                    icon={cilPlus}
                                    className="text-blue-500 cursor-pointer hover:text-blue-700 mt-2"
                                    style={{ fontSize: '1.5rem' }}
                                    onClick={() => handleAddEditSize(col.id)}
                                  />
                                </div>
                                <div className="mt-4">
                                  <label className="font-bold">Images:</label>
                                  {col.listeimage.map((img) => (
                                    <div key={img.id} className="mb-2">
                                      {importEditMode === 'url' ? (
                                        <div className="flex items-center">
                                          {/* Saisie de l'URL de l'image */}
                                          <input
                                            type="text"
                                            name="UrlImage"
                                            value={img.urlImage}
                                            onChange={(e) => handleEditImageChange(e, col.id, img.id)}
                                            className="form-control w-1/2 h-10 mb-1 mr-2"
                                            placeholder="Image URL"
                                          />
                                          <CIcon
                                            icon={cilTrash}
                                            className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                            style={{ fontSize: '1.2rem' }}
                                            onClick={() => handleDeleteEditImage(col.id, img.id)}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          {/* Téléchargement du fichier image */}
                                          <input
                                            type="file"
                                            name="UrlImage"
                                            onChange={(e) => handleEditImageChange(e, col.id, img.id)}
                                            className="form-control mb-2 w-1/2 mr-2"
                                          />
                                          <CIcon
                                            icon={cilTrash}
                                            className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                            style={{ fontSize: '1.2rem' }}
                                            onClick={() => handleDeleteEditImage(col.id, img.id)}
                                          />
                                        </div>
                                      )}

                                      {/* Sélecteur de mode d'importation */}
                                      <div>
                                        <label>
                                          <input
                                            type="checkbox"
                                            checked={importEditMode === 'file'}
                                            onChange={() => handleEditModeChange()}
                                          />
                                          Importer une image
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                  {col.listeAjouterImage.map((img) => (
                                    <div key={img.id} className="mb-2">
                                      {importEditMode === 'url' ? (
                                        <div className="flex items-center">
                                          {/* Saisie de l'URL de l'image */}
                                          <input
                                            type="text"
                                            name="UrlImage"
                                            value={img.urlImage}
                                            onChange={(e) => handleEditImageChange(e, col.id, img.id)}
                                            className="form-control w-1/2 h-10 mb-1 mr-2"
                                            placeholder="Image URL"
                                          />
                                          <CIcon
                                            icon={cilTrash}
                                            className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                            style={{ fontSize: '1.2rem' }}
                                            onClick={() => handleDeleteEditImage(col.id, img.id)}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          {/* Téléchargement du fichier image */}
                                          <input
                                            type="file"
                                            name="fileImage"
                                            onChange={(e) => handleEditImageChange(e, col.id, img.id)}
                                            className="form-control mb-2 w-1/2 mr-2"
                                          />
                                          <CIcon
                                            icon={cilTrash}
                                            className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                            style={{ fontSize: '1.2rem' }}
                                            onClick={() => handleDeleteEditImage(col.id, img.id)}
                                          />
                                        </div>
                                      )}

                                      {/* Sélecteur de mode d'importation */}
                                      <div>
                                        <label>
                                          <input
                                            type="checkbox"
                                            checked={importEditMode === 'file'}
                                            onChange={() => handleEditModeChange()}
                                          />
                                          Importer une image
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                  <CIcon
                                    icon={cilPlus}
                                    className="text-blue-500 cursor-pointer hover:text-blue-700 mt-2"
                                    style={{ fontSize: '1.5rem' }}
                                    onClick={() => handleAddEditImage(col.id)}
                                  />
                                </div>
                              </div>
                            ))}

                            {/* Parcourir listeAjouterCouleur */}
                            {editProduct.listeAjouterCouleur.map((col) => (
                              <div key={col.id} className="mb-4">
                                <label htmlFor="colours" className="font-bold mb-2">Colour</label>
                                <div className="flex space-x-2 items-center">
                                  {[
                                    '#FF0000', '#FF4500', '#FFD700', '#9ACD32', '#00FA9A', '#00CED1',
                                    '#1E90FF', '#000080', '#4B0082', '#800080', '#000000', // Noir
                                    '#FFFFFF',
                                  ].map((color) => (
                                    <div
                                      key={color}
                                      onClick={() => handleEditColourChange(color, col.id)}
                                      style={{
                                        backgroundColor: color,
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        border: col.nameCouleur === color ? '3px solid black' : '1px solid #ccc',
                                      }}
                                      title={color}
                                    />
                                  ))}
                                  <CIcon
                                    icon={cilTrash}
                                    className="text-red-500 cursor-pointer hover:text-red-700"
                                    style={{ fontSize: '1.5rem', marginLeft: '8px' }}
                                    onClick={() => handleDeleteEditColour(col.id)}
                                  />
                                </div>
                                <div className="mt-4">
                                  <label className="font-bold mb-2">Sizes:</label>
                                  {col.listesize.map((size) => (
                                    <div key={size.id} className="mb-2 flex items-center">
                                      <input
                                        type="text"
                                        name="typeSize"
                                        value={size.typeSize}
                                        onChange={(e) => handleEditSizeChange(e, col.id, size.id)}
                                        className="form-control w-auto h-auto mb-1 mr-2"
                                        placeholder="Size"
                                      />
                                      <input
                                        type="number"
                                        name="stockQuantity"
                                        value={size.stockQuantity}
                                        onChange={(e) => handleEditSizeChange(e, col.id, size.id)}
                                        className="form-control w-auto h-auto"
                                        placeholder="Stock Quantity"
                                      />
                                      <CIcon
                                        icon={cilTrash}
                                        className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                        style={{ fontSize: '1.2rem' }}
                                        onClick={() => handleDeleteEditSize(col.id, size.id)}
                                      />
                                    </div>
                                  ))}
                                  <CIcon
                                    icon={cilPlus}
                                    className="text-blue-500 cursor-pointer hover:text-blue-700 mt-2"
                                    style={{ fontSize: '1.5rem' }}
                                    onClick={() => handleAddEditSize(col.id)}
                                  />
                                </div>
                                <div className="mt-4">
                                  <label className="font-bold">Images:</label>
                                  {col.listeimage.map((img) => (
                                    <div key={img.id} className="mb-2">
                                      {importEditMode === 'url' ? (
                                        <div className="flex items-center">
                                          {/* Champ pour l'URL de l'image */}
                                          <input
                                            type="text"
                                            name="UrlImage"
                                            value={img.urlImage}
                                            onChange={(e) => handleEditImageChange(e, col.id, img.id)}
                                            className="form-control w-1/2 h-10 mb-1 mr-2"
                                            placeholder="Image URL"
                                          />
                                          <CIcon
                                            icon={cilTrash}
                                            className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                            style={{ fontSize: '1.2rem' }}
                                            onClick={() => handleDeleteEditImage(col.id, img.id)}
                                          />
                                        </div>
                                      ) : (
                                        <div className="flex items-center">
                                          {/* Champ pour importer un fichier image */}
                                          <input
                                            type="file"
                                            name="UrlImage"
                                            onChange={(e) => handleEditImageChange(e, col.id, img.id)}
                                            className="form-control mb-2 w-1/2 mr-2"
                                          />
                                          <CIcon
                                            icon={cilTrash}
                                            className="text-red-500 cursor-pointer hover:text-red-700 ml-2"
                                            style={{ fontSize: '1.2rem' }}
                                            onClick={() => handleDeleteEditImage(col.id, img.id)}
                                          />
                                        </div>
                                      )}

                                      {/* Sélecteur de mode d'importation */}
                                      <div>
                                        <label>
                                          <input
                                            type="checkbox"
                                            checked={importEditMode === 'file'}
                                            onChange={() => handleEditModeChange()}
                                          />
                                          Importer une image
                                        </label>
                                      </div>
                                    </div>
                                  ))}

                                  <CIcon
                                    icon={cilPlus}
                                    className="text-blue-500 cursor-pointer hover:text-blue-700 mt-2"
                                    style={{ fontSize: '1.5rem' }}
                                    onClick={() => handleAddEditImage(col.id)}
                                  />
                                </div>
                              </div>
                            ))}

                            <CIcon
                              icon={cilPlus}
                              className="text-blue-500 cursor-pointer hover:text-blue-700 mt-4"
                              style={{ fontSize: '1.5rem' }}
                              onClick={handleAddEditColour}
                            />
                          </div>
                        </div>
                        <CButton color="success" onClick={handleSaveEditProduct} className="mr-2" disabled={isEditUploading}>
                          {isEditUploading ? (
                            <span>
                              <CSpinner size="sm" /> Saving...
                            </span>
                          ) : (
                            'Save'
                          )}
                        </CButton>
                        <CButton size="sm" color="secondary" className="ml-1" onClick={handleCancelEditProduct}>
                          Cancel
                        </CButton>
                      </div>
                    ) : (
                      <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">

                        <CCard key={item.id} className="mb-6 bg-white rounded-lg shadow-lg">
                          <CCardHeader className="flex justify-between items-center bg-gray-200 rounded-t-lg p-4">
                            <h4 className="text-xl font-semibold text-gray-700">{item.nameProduct}</h4>
                          </CCardHeader>
                          <CCollapse visible={details.includes(item.id)}>
                            <CCardBody className="p-6">
                              <div className={`flex justify-center mb-4 ${isFullScreen ? 'fixed inset-0 bg-black bg-opacity-75 z-50' : ''}`}>
                                {selectedColor[item.id]?.images?.length > 0 && (
                                  <div className={`relative ${isFullScreen ? 'w-full h-full flex items-center justify-center' : 'w-40 max-w-3xl'}`}>
                                    <img
                                      src={selectedColor[item.id].images[currentImageIndex].UrlImage}
                                      alt="Product"
                                      className={`transition-transform transform ${isFullScreen ? 'w-full h-full object-contain' : 'w-full h-auto object-cover rounded-lg shadow-md hover:scale-105'}`}
                                      onClick={toggleFullScreen}
                                    />
                                    {!isFullScreen && (
                                      <>
                                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
                                          <CButton
                                            onClick={() => handlePreviousImage(item.id)}
                                            className="w-12 h-12 p-2 text-2xl bg-gray-800 text-black rounded-full border-3 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
                                          >
                                            &lt;
                                          </CButton>
                                        </div>
                                        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
                                          <CButton
                                            onClick={() => handleNextImage(item.id)}
                                            className="w-12 h-12 p-2 text-2xl bg-gray-800 text-black rounded-full border-3 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300 shadow-md"
                                          >
                                            &gt;
                                          </CButton>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>

                              <p className="text-gray-700 text-lg text-center">Description: {item.description}</p>
                              <p className="text-gray-500 text-sm text-center">Created on: {format(new Date(item.createdate), 'yyyy-MM-dd')}</p>
                              <p className="text-gray-500 text-sm text-center">
                                Updated on: {item.updatedate ? format(new Date(item.updatedate), 'yyyy-MM-dd') : 'N/A'}
                              </p>

                              <h5 className="text-lg font-semibold text-gray-700 mt-4 text-center">Colours:</h5>
                              <div className="flex space-x-2 justify-center">
                                {item.colours && item.colours.map((colour) => (
                                  // Vérification si colour est non null/undefined avant de l'utiliser
                                  colour && colour.nameCouleur && (
                                    <div
                                      key={colour.id}
                                      onClick={() => handleColorSelect(item.id, colour)}
                                      style={{
                                        backgroundColor: colorMapping(colour.nameCouleur),
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        border: selectedColor[item.id] === colour.nameCouleur ? '2px solid black' : '1px solid #ccc', // Appliquer la bordure en fonction de la couleur sélectionnée
                                        borderRadius: '4px',
                                      }}
                                      className="shadow-md transform hover:scale-105 transition-transform"
                                      title={colour.nameCouleur}
                                    />
                                  )
                                ))}
                              </div>

                              {selectedColor[item.id] ? (
                                selectedColor[item.id].sizes ? (
                                  <>
                                    <h6 className="text-lg font-semibold text-gray-700 mt-4 text-center">Sizes:</h6>
                                    <ul className="list-disc list-inside text-gray-700 text-center flex justify-center ">
                                      {selectedColor[item.id].sizes.map((size) => (
                                        <div className='ml-4 mr-4' key={size.id}>{size.typeSize} - Stock: {size.stockQuantity}</div>
                                      ))}
                                    </ul>
                                  </>
                                ) : (
                                  <p className="text-gray-700">No sizes available.</p>
                                )
                              ) : (
                                <p className="text-gray-700">Select a color to see sizes.</p>
                              )}
                            </CCardBody>
                          </CCollapse>
                          <CCardFooter className="bg-gray-200 rounded-b-lg p-4">
                            <CButton size="sm" color="warning" className="ml-1" onClick={() => handleEditClick(item)}>
                              Edit
                            </CButton>
                            <CButton size="sm" color="danger" className="ml-1" onClick={() => handleDeleteClick(item)}>
                              Delete
                            </CButton>
                          </CCardFooter>
                        </CCard>

                      </div>
                    )}
                </CCardBody>
              </CCollapse>
            ),
          }}
          selectable
          sorterValue={{ column: 'createdate', state: 'asc' }}
          tableFilter
          tableFilterLabel="Filter product:"
          tableFilterPlaceholder="Type to search..."
          tableProps={{
            className: 'min-w-full',
            responsive: true,
            striped: true,
            hover: true,
          }}
          tableBodyProps={{
            className: 'align-middle',
          }}
        />
      </div>
    </div>
  );
}

export default Products;