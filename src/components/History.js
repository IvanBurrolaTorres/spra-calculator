import React, { useState, useEffect } from 'react';
import { getSearchHistory, deleteSearch, clearAllSearches } from '../utils/historyUtils';

function History() {
  const [searchHistory, setSearchHistory] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('timestamp');
  const [sortDirection, setSortDirection] = useState('desc');

  // Load history on component mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const history = getSearchHistory();
    setSearchHistory(history);
  };

  const handleDeleteSearch = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      deleteSearch(id);
      loadHistory();
    }
  };

  const handleClearAllSearches = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todos los registros?')) {
      clearAllSearches();
      loadHistory();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Filter and sort the history
  const filteredHistory = searchHistory.filter(item => {
    const searchTerm = filter.toLowerCase();
    return (
      item.productName?.toLowerCase().includes(searchTerm) ||
      item.asin?.toLowerCase().includes(searchTerm) ||
      item.category?.toLowerCase().includes(searchTerm) ||
      item.brand?.toLowerCase().includes(searchTerm)
    );
  }).sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  return (
    <div className="history-container">
      <h2 className="section-title">Historial de Búsquedas</h2>
      
      <div className="section">
        <div className="history-controls">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Filtrar por nombre, ASIN, categoría o marca..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-input"
            />
          </div>
          
          <div className="sort-options">
            <label>Ordenar por:</label>
            <select 
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="sort-select"
            >
              <option value="timestamp">Fecha</option>
              <option value="productName">Nombre</option>
              <option value="asin">ASIN</option>
              <option value="totalScore">Puntuación</option>
            </select>
            
            <button 
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="sort-direction-button"
              title={sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>

            <button 
              onClick={handleClearAllSearches}
              className="clear-button"
            >
              Borrar Todo
            </button>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="no-records">
            {searchHistory.length === 0 
              ? 'No hay registros guardados. Realiza una búsqueda y guárdala para verla aquí.' 
              : 'No hay registros que coincidan con tu búsqueda.'}
          </div>
        ) : (
          <div className="history-records">
            {filteredHistory.map(record => (
              <div key={record.id} className="history-record">
                <div className="record-header">
                  <div className="record-date">{formatDate(record.timestamp)}</div>
                  <button 
                    onClick={() => handleDeleteSearch(record.id)}
                    className="delete-button"
                    title="Eliminar registro"
                  >
                    ×
                  </button>
                </div>
                
                <div className="record-details">
                  <div className="record-item">
                    <span className="record-label">Producto:</span>
                    <span className="record-value">{record.productName}</span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">ASIN:</span>
                    <span className="record-value">{record.asin}</span>
                  </div>
                  {record.category && (
                    <div className="record-item">
                      <span className="record-label">Categoría:</span>
                      <span className="record-value">{record.category}</span>
                    </div>
                  )}
                  {record.brand && (
                    <div className="record-item">
                      <span className="record-label">Marca:</span>
                      <span className="record-value">{record.brand}</span>
                    </div>
                  )}
                  <div className="record-item">
                    <span className="record-label">Puntuación:</span>
                    <span className={`record-value ${getTotalScoreClass(record.totalScore)}`}>
                      {record.totalScore} / 100
                    </span>
                  </div>
                  <div className="record-item">
                    <span className="record-label">Valoración:</span>
                    <span className="record-value">{record.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get score class
function getTotalScoreClass(score) {
  if (score >= 80) return "high-value";
  if (score >= 60) return "good-value";
  if (score >= 40) return "medium-value";
  if (score >= 20) return "low-value";
  return "poor-value";
}

export default History;