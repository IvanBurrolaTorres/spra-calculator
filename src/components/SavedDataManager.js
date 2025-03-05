import React, { useState, useEffect } from 'react';
import { 
  getSavedCategories, 
  getSavedBrands, 
  saveCategory,
  saveBrand,
  removeCategory,
  removeBrand
} from '../utils/savedDataUtils';

function SavedDataManager({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [activeTab, setActiveTab] = useState('categories');

  // Cargar datos guardados
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = () => {
    setCategories(getSavedCategories());
    setBrands(getSavedBrands());
  };

  // Manejar adición de categoría
  const handleAddCategory = () => {
    if (saveCategory(newCategory)) {
      setCategories(getSavedCategories());
      setNewCategory('');
    } else if (newCategory.trim()) {
      alert('Esta categoría ya existe en tu lista.');
    }
  };

  // Manejar adición de marca
  const handleAddBrand = () => {
    if (saveBrand(newBrand)) {
      setBrands(getSavedBrands());
      setNewBrand('');
    } else if (newBrand.trim()) {
      alert('Esta marca ya existe en tu lista.');
    }
  };

  // Manejar eliminación de categoría
  const handleRemoveCategory = (category) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la categoría "${category}"?`)) {
      removeCategory(category);
      setCategories(getSavedCategories());
    }
  };

  // Manejar eliminación de marca
  const handleRemoveBrand = (brand) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la marca "${brand}"?`)) {
      removeBrand(brand);
      setBrands(getSavedBrands());
    }
  };

  return (
    <div className="saved-data-modal">
      <div className="saved-data-content">
        <div className="saved-data-header">
          <h2>Gestionar Datos Guardados</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="saved-data-tabs">
          <button 
            className={`tab-button ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            Categorías
          </button>
          <button 
            className={`tab-button ${activeTab === 'brands' ? 'active' : ''}`}
            onClick={() => setActiveTab('brands')}
          >
            Marcas
          </button>
        </div>
        
        {activeTab === 'categories' ? (
          <div className="saved-data-section">
            <div className="add-item-form">
              <input
                type="text"
                placeholder="Nueva categoría..."
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="form-input"
              />
              <button 
                onClick={handleAddCategory}
                className="add-button"
                disabled={!newCategory.trim()}
              >
                Añadir
              </button>
            </div>
            
            {categories.length === 0 ? (
              <div className="no-items">No hay categorías guardadas.</div>
            ) : (
              <ul className="saved-items-list">
                {categories.map((category) => (
                  <li key={category} className="saved-item">
                    <span>{category}</span>
                    <button 
                      onClick={() => handleRemoveCategory(category)}
                      className="remove-item-button"
                      title="Eliminar categoría"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="saved-data-section">
            <div className="add-item-form">
              <input
                type="text"
                placeholder="Nueva marca..."
                value={newBrand}
                onChange={(e) => setNewBrand(e.target.value)}
                className="form-input"
              />
              <button 
                onClick={handleAddBrand}
                className="add-button"
                disabled={!newBrand.trim()}
              >
                Añadir
              </button>
            </div>
            
            {brands.length === 0 ? (
              <div className="no-items">No hay marcas guardadas.</div>
            ) : (
              <ul className="saved-items-list">
                {brands.map((brand) => (
                  <li key={brand} className="saved-item">
                    <span>{brand}</span>
                    <button 
                      onClick={() => handleRemoveBrand(brand)}
                      className="remove-item-button"
                      title="Eliminar marca"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default SavedDataManager;