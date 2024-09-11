import React, { useEffect, useState } from 'react';
import { CAlert, CButton, CCard, CCardBody, CCardFooter, CCardHeader, CCollapse, CModal, CModalBody, CModalFooter, CModalHeader, CSpinner } from '@coreui/react';
import { CSmartTable } from '@coreui/react-pro';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axiosInstance from '../axiosConfig';
import axios from 'axios';

function Categories(props) {
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dknd9q7kt/image/upload';
  const CLOUDINARY_UPLOAD_PRESET = 'ecommerce_upload'; // Remplacez par votre nom de preset
  const [isUploading, setIsUploading] = useState(false);
  const [isEditUploading, setIsEditUploading] = useState(false);
  const [details, setDetails] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [editId, setEditId] = useState(null);
  const [importMode, setImportMode] = useState('url');
  const [importEditMode, setImportEditMode] = useState('url');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  
  const [editCategory, setEditCategory] = useState({
    nameCategory: "",
    description: "",
    NameparentCategory: "",
    image: {
      UrlImage: "",
      nameCategorie: "",
      id: Date.now()
    },
  });
  const [tempCategpory, setTempCategory] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [newCategory, setNewCategory] = useState({
    nameCategory: "",
    description: "",
    parentCategory: "",
    image: { UrlImage: "", nameCategorie: "" },
  });

  const columns = [
    { key: 'id', _style: { width: '12.5%',borderRight: '1px solid #e0e0e0' } },
    { key: 'nameCategory', _style: { width: '20%',borderRight: '1px solid #e0e0e0' } },
    { key: 'description', _style: { width: '27.5%',borderRight: '1px solid #e0e0e0' } },
    { key: 'parentCategory.nameCategory', label: 'Parent Category', _style: { width: '20%',borderRight: '1px solid #e0e0e0' } },
    {
      key: 'createdAt',
      _style: { width: '20%',borderRight: '1px solid #e0e0e0' },
      filter: true,
      filterRenderer: () => (
        <div className="flex flex-col space-y-2">
          <label htmlFor="startDate">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            id="startDate"
          />
          <label htmlFor="endDate">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            id="endDate"
          />
        </div>
      ),
      filterValue: { startDate, endDate },
      filterFunction: (item, filterValue) => {
        if (!filterValue.startDate && !filterValue.endDate) return true;
        const date = new Date(item.createdAt);
        return (
          (!filterValue.startDate || date >= filterValue.startDate) &&
          (!filterValue.endDate || date <= filterValue.endDate)
        );
      },
    },

    { key: 'show_details', label: '', _style: { width: '1%' }, filter: false, sorter: false },
  ];


  useEffect(() => {
    axiosInstance.get('/categories', {
      headers: {
        'Content-Type': 'application/json'
      },
      withCredentials: true
    }) // Remplacez par l'URL de votre backend
      .then(response => {
        setCategoriesData(response.data.data);
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
  const handleModeChange = () => {
    setImportMode((prevMode) => (prevMode === 'url' ? 'file' : 'url'));
  };
  const handleEditModeChange = () => {
    setImportEditMode((prevMode) => (prevMode === 'url' ? 'file' : 'url'));
    console.log(importEditMode);
  };
  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setIsUploading(true); // Activer l'état de chargement

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.secure_url;
      setNewCategory((prev) => ({
        ...prev,
        image: { ...prev.image, UrlImage: imageUrl }
      }));

      console.log('Image téléchargée avec succès sur Cloudinary:', imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image sur Cloudinary:', error);
    } finally {
      setIsUploading(false); // Désactiver l'état de chargement
    }
  };


  const handleEditImageUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file); // Ajoutez le fichier à télécharger
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET); // Ajoutez le preset de téléchargement

    setIsEditUploading(true); // Activer l'état de chargement
    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const imageUrl = response.data.secure_url; // Récupérez l'URL de l'image téléchargée
      setEditCategory((prev) => ({
        ...prev,
        image: { ...prev.image, UrlImage: imageUrl }
      }));

      console.log('Image téléchargée avec succès sur Cloudinary:', imageUrl);
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image sur Cloudinary:', error);
    }
    finally {
      setIsEditUploading(false); // Désactiver l'état de chargement
    }
  };

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    console.log(position)
    let newDetails = details.slice();
    console.log(newDetails)
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const handleDeleteClick = async (item) => {
    try {


      // Envoyer la nouvelle catégorie au backend
      const response = await axiosInstance.delete(`/categories/delete/${item.id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log('Category added:', response.data);
      // Ajouter la nouvelle catégorie à la liste existante des catégories après une réponse réussie
      await setCategoriesData((prevCategories) => {
        return prevCategories.filter(category => category.id !== item.id);
      });
      await console.log('Categories data:', categoriesData);
      await setCategoriesData((prevCategories) => {
        return prevCategories.filter(category => category.parentCategory?.nameCategorie !== item.nameCategory);
      });
      await console.log('Categories data:', categoriesData);
      setAlertMessage('✅ Categorie supprimé avec succès!');
      setAlertType('success');

    } catch (error) {
      console.log('Error adding category:', error);
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
    setEditCategory({
      nameCategory: item.nameCategory,
      description: item.description,
      NameparentCategory: item.parentCategory ? item.parentCategory.nameCategory : '',
      image: {
        UrlImage: item.image.UrlImage,
        nameCategorie: item.image.nameCategorie,
        id: item.image.id
      },
    });
    setTempCategory({
      nameCategory: item.nameCategory,
      description: item.description,
      NameparentCategory: item.parentCategory ? item.parentCategory.nameCategory : '',
      image: {
        UrlImage: item.image.UrlImage,
        nameCategorie: item.image.nameCategorie,
        id: item.image.id
      },
    });
    console.log(details);
  };


  const handleInputChange = (e) => {
    const { name, value, files, type } = e.target;

    setEditCategory((prev) => {
      if (name.includes('.') && type === 'file') {
        const [nestedKey, nestedField] = name.split('.');
        const file = files[0];

        handleEditImageUpload(file);

      } else if (name.includes('.')) {
        const [nestedKey, nestedField] = name.split('.');
        console.log(nestedKey, nestedField, value);
        return {
          ...prev,
          [nestedKey]: {
            ...prev[nestedKey],
            [nestedField]: value
          }
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };




  const handleSaveClick = async () => {
    try {
      const editCategoryPayload = {
        nameCategory: ((tempCategpory.nameCategory === editCategory.nameCategory) ? null : editCategory.nameCategory),
        description: editCategory.description,
        NameparentCategory: ((tempCategpory.NameparentCategory === editCategory.NameparentCategory) ? null : editCategory.NameparentCategory),
        image: {
          UrlImage: ((tempCategpory.image.UrlImage === editCategory.UrlImage) ? null : editCategory.image.UrlImage),
          nameCategorie: editCategory.nameCategory,
          id: editCategory.image.id
        }
      };
      console.log(editCategoryPayload);

      // Envoyer la nouvelle catégorie au backend
      const response = await axiosInstance.put(`/categories/update/${editId}`, editCategoryPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log('Category added:', response.data);
      // Ajouter la nouvelle catégorie à la liste existante des catégories après une réponse réussie
      setCategoriesData((prevCategories) => {
        return prevCategories.map(category =>
          category.id === editId ? response.data.data : category
        );
      });
      setAlertMessage('✅Categorie mis à jour avec succès!');
      setAlertType('success');

      // Réinitialiser le formulaire
      setEditCategory({
        nameCategory: "",
        description: "",
        NameparentCategory: "",
        image: {
          UrlImage: "",
          nameCategorie: "",
          id: Date.now()
        },
      });
      setEditId(null);
      toggleDetails(editId);
    } catch (error) {
      console.log('Error adding category:', error);
      setAlertMessage('❌ Échec de mise à jour.');
      setAlertType('danger');
    }
  };

  const handleCancelClick = () => {
    setEditId(null);
    setEditCategory({
      nameCategory: "",
      description: "",
      parentCategory: "",
      image: {
        UrlImage: "",
        nameCategorie: ""
      },
    });
  };


  const handleAddInputChange = (e) => {
    const { name, value, files, type } = e.target;

    setNewCategory((prev) => {
      if (name.includes('.') && type === 'file') {
        const [nestedKey, nestedField] = name.split('.');
        const file = files[0];

        handleImageUpload(file);

      } else if (name.includes('.')) {
        const [nestedKey, nestedField] = name.split('.');
        return {
          ...prev,
          [nestedKey]: {
            ...prev[nestedKey],
            [nestedField]: value
          }
        };
      }

      return {
        ...prev,
        [name]: value
      };
    });
  };

  const handleAddSaveClick = async () => {
    try {
      const newCategoryPayload = {
        nameCategory: newCategory.nameCategory,
        description: newCategory.description,
        NameparentCategory: newCategory.parentCategory,
        image: {
          UrlImage: newCategory.image.UrlImage,
          nameCategorie: newCategory.nameCategory,
        }
      };
      console.log(newCategoryPayload);

      // Envoyer la nouvelle catégorie au backend
      const response = await axiosInstance.post('/categories/create', newCategoryPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      console.log('Category added:', response.data);
      // Ajouter la nouvelle catégorie à la liste existante des catégories après une réponse réussie
      const updatedCategories = [
        ...categoriesData,
        response.data.data
      ];
      setCategoriesData(updatedCategories);
      setIsAdding(false);
      setAlertMessage('✅Categorie ajouté');
      setAlertType('success');

      // Réinitialiser le formulaire
      setNewCategory({
        nameCategory: "",
        description: "",
        parentCategory: "",
        image: { UrlImage: "", nameCategorie: "" },
      });
    } catch (error) {
      console.log('Error adding category:', error);
      setAlertMessage('❌ Échec de l\'ajout du categorie');
      setAlertType('danger');
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prevState => !prevState);
  };
  const handleAddCancelClick = () => {
    setIsAdding(false);
    setNewCategory({
      nameCategory: "",
      description: "",
      parentCategory: "",
      image: { UrlImage: "", nameCategorie: "" },
    });
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center my-4">
        <h2 className="text-center">Categories List</h2>
        {/* Afficher l'alerte si un message existe */}
        {alertMessage && (
          <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 9999 }}>
            <CAlert color={alertType} className="small-alert" dismissible onClose={() => setAlertMessage('')}>
              {alertMessage}
            </CAlert>
          </div>
        )}
        <CButton color="success" onClick={() => setIsAdding(true)}>
          Ajouter Categorie
        </CButton>
      </div>
      <CModal
        visible={isAdding}
        onClose={() => setIsAdding(false)}
        size={props.isLg === true ? 'lg' : 'md'}
      >
        <CModalHeader
          closeButton={true}
          className={props.theme === 'dark' ? 'bg-slate-700 text-white  p-4 mt-auto border' : 'bg-slate-0 text-dark  p-4 mt-auto border'}
        >
          <h5>Ajouter Nouveau Categorie</h5>
        </CModalHeader>
        <CModalBody className={props.theme === 'dark' ? 'bg-slate-700 text-white p-4 mt-auto border-r border-l ' : 'bg-slate-0 text-dark  p-4 mt-auto broder-l border-r'}>
          <div>
            <label htmlFor="nameCategory">Category Name</label>
            <input
              type="text"
              id="nameCategory"
              name="nameCategory"
              value={newCategory.nameCategory}
              onChange={handleAddInputChange}
              className="form-control w-auto h-auto"
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={newCategory.description}
              onChange={handleAddInputChange}
              className="form-control"
            />
          </div>
          <div>
            <label htmlFor="parentCategory">Parent Category</label>
            <select
              id="parentCategory"
              name="parentCategory"
              value={newCategory.parentCategory}
              onChange={handleAddInputChange}
              className="form-control w-auto h-auto"
            >
              <option value="">Select a parent category</option>
              {categoriesData && categoriesData.length > 0 ? (
                categoriesData.map((category) => (
                  category && category.id ? (
                    <option key={category.id} value={category.nameCategory}>
                      {category.nameCategory}
                    </option>
                  ) : null
                ))
              ) : (
                <option disabled>Loading categories...</option>
              )}
            </select>

          </div>
          {importMode === 'url' ? (
            <div>
              <label htmlFor="image.UrlImage">Image URL</label>
              <input
                type="text"
                id="image.UrlImage"
                name="image.UrlImage"
                value={newCategory.image.UrlImage}
                onChange={handleAddInputChange}
                className="form-control mb-2"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="image.UrlImage">Importer une image</label>
              <input
                type="file"
                id="image.UrlImage"
                name="image.UrlImage"
                onChange={handleAddInputChange}
                className="form-control mb-2"
              />
            </div>
          )}
          <div>
            <label>
              <input
                type="checkbox"
                checked={importMode === 'file'}
                onChange={handleModeChange}
              />
              Importer une image
            </label>
          </div>
        </CModalBody>
        <div className={props.theme === 'dark' ? 'bg-slate-700 border-l border-r border-b rounded-b-lg' : 'bg-slate-0 border-r border-l border-b rounded-b-lg'}>
          <CModalFooter>
            <CButton color="success" onClick={handleAddSaveClick} className="mr-2" disabled={isUploading}>
              {isUploading ? (
                <span>
                  <CSpinner size="sm" /> Saving...
                </span>
              ) : (
                'Save'
              )}
            </CButton>
            <CButton color="danger" onClick={handleAddCancelClick}>
              Cancel
            </CButton>
          </CModalFooter>
        </div>
      </CModal>

      <div className="overflow-x-auto">
        <CSmartTable
          striped
          className={`${props.theme === 'dark'
            ? 'bg-dark text-white text-center p-4 mt-auto table-auto border-collapse border border-gray-200'
            : 'bg-slate-0 text-dark text-center p-4 mt-auto table-auto border-collapse border border-gray-200'
            }`}
          activePage={1}
          cleaner
          clickableRows
          columns={columns}
          columnFilter
          columnSorter
          items={categoriesData}
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
            nameCategory: (item) => (
              <td className="border border-gray-200">{item.nameCategory}</td>
            ),
            description: (item) => (
              <td className="border border-gray-200">{item.description}</td>
            ),
            'parentCategory.nameCategory': (item) => (
              <td className="border border-gray-200">
                {item.parentCategory && item.parentCategory.nameCategory
                  ? item.parentCategory.nameCategory
                  : 'N/A'}
              </td>
            ),

            createdAt: (item) => (
              <td className="border border-gray-200">
                {format(new Date(item.createdAt), 'yyyy-MM-dd')}
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
                    toggleDetails(item.id);
                  }}
                >
                  {details.includes(item.id) ? 'Hide' : 'Show'}
                </CButton>
              </td>
            ),
            details: (item) => (
              <CCollapse visible={details.includes(item.id)}>
                <CCardBody className="p-3 border border-gray-200">
                  {editId === item.id ? (
                    <>
                      <div>
                        <label htmlFor="nameCategory">Category Name</label>
                        <input
                          type="text"
                          id="nameCategory"
                          name="nameCategory"
                          value={editCategory.nameCategory}
                          onChange={handleInputChange}
                          className="form-control w-auto h-auto"
                        />
                      </div>
                      <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                          type="text"
                          id="description"
                          name="description"
                          value={editCategory.description}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      </div>
                      <div>
                        <label htmlFor="NameparentCategory">Parent Category</label>
                        <select
                          id="NameparentCategory"
                          name="NameparentCategory"
                          value={editCategory.NameparentCategory || ""}
                          onChange={handleInputChange}
                          className="form-control w-auto h-auto"
                        >
                          {/* Option vide pour le cas où aucune catégorie parente n'est sélectionnée */}
                          <option value=""></option>

                          {categoriesData && categoriesData.length > 0 ? (
                            categoriesData.map((category) => (
                              category && category.id ? (
                                <option key={category.id} value={category.nameCategory}>
                                  {category.nameCategory}
                                </option>
                              ) : null
                            ))
                          ) : (
                            <option disabled>Loading categories...</option>
                          )}
                        </select>
                      </div>

                      {importEditMode === 'url' ? (
                        <div>
                          <label htmlFor="image.UrlImage">Image URL</label>
                          <input
                            type="text"
                            id="image.UrlImage"
                            name="image.UrlImage"
                            value={editCategory.image.UrlImage}
                            onChange={handleInputChange}
                            className="form-control mb-2"
                          />
                        </div>
                      ) : (
                        <div>
                          <label htmlFor="image.UrlImage">Importer une image</label>
                          <input
                            type="file"
                            id="image.UrlImage"
                            name="image.UrlImage"
                            onChange={handleInputChange}
                            className="form-control mb-2"
                          />
                        </div>
                      )}
                      <div>
                        <label>
                          <input
                            type="checkbox"
                            checked={importEditMode === 'file'}
                            onChange={handleEditModeChange}
                          />
                          Importer une image
                        </label>
                      </div>
                      <CButton color="success" onClick={handleSaveClick} className="mr-2" disabled={isEditUploading}>
                        {isEditUploading ? (
                          <span>
                            <CSpinner size="sm" /> Saving...
                          </span>
                        ) : (
                          'Save'
                        )}
                      </CButton>
                      <CButton size="sm" color="secondary" className="ml-1" onClick={handleCancelClick}>
                        Cancel
                      </CButton>
                    </>
                  ) : (
                    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
                      <CCard key={item.id} className="mb-6 bg-white rounded-lg shadow-lg">
                        <CCardHeader className="flex justify-between items-center bg-gray-200 rounded-t-lg p-4">
                          <h4 className="text-xl font-semibold text-gray-700">{item.nameCategory}</h4>
                        </CCardHeader>
                        <CCardBody className="p-6">
                          <div className={`flex justify-center mb-4 ${isFullScreen ? 'fixed inset-0 bg-black bg-opacity-75 z-50' : ''}`}>
                            <div className={`relative ${isFullScreen ? 'w-full h-full flex items-center justify-center' : 'w-40 max-w-3xl'}`}>
                              <img
                                src={item.image?.UrlImage}
                                alt={item.nameCategory}
                                className={`transition-transform transform ${isFullScreen ? 'w-full h-full object-contain' : 'w-full h-auto object-cover rounded-lg shadow-md hover:scale-105'}`}
                                onClick={toggleFullScreen}
                              />
                            </div>
                          </div>
                          <p className="text-gray-700 text-lg text-center">Description: {item.description}</p>
                          <p className="text-gray-700 text-lg text-center">
                            Parent Category: {item.parentCategory ? item.parentCategory.nameCategory : 'N/A'}
                          </p>
                          <p className="text-gray-500 text-sm text-center">Created At: {format(new Date(item.createdAt), 'yyyy-MM-dd')}</p>
                          <p className="text-gray-500 text-sm text-center">Updated At: {item.updatedate ? format(new Date(item.updatedate), 'yyyy-MM-dd') : 'N/A'}</p>

                        </CCardBody>
                        <CCardFooter className="bg-gray-200 rounded-b-lg p-4">
                          <CButton size="sm" color="danger" className="ml-1" onClick={() => handleDeleteClick(item)}>
                            Delete
                          </CButton>
                          <CButton size="sm" color="warning" className="ml-1" onClick={() => handleEditClick(item)}>
                            Edit
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

          tableFilter
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

export default Categories;
