// Clave para almacenar las búsquedas en localStorage
const SEARCHES_STORAGE_KEY = 'spra_saved_searches';

// Función para guardar una búsqueda en el historial
export const saveSearch = (searchData) => {
  // Obtener búsquedas existentes
  const existingSearches = getSearches();
  
  // Añadir la nueva búsqueda al principio del array
  existingSearches.unshift(searchData);
  
  // Guardar el array actualizado
  localStorage.setItem(SEARCHES_STORAGE_KEY, JSON.stringify(existingSearches));
};

// Función para obtener todas las búsquedas guardadas
export const getSearches = () => {
  const searches = localStorage.getItem(SEARCHES_STORAGE_KEY);
  return searches ? JSON.parse(searches) : [];
};

// Alias para mantener compatibilidad con código existente
export const getSearchHistory = getSearches;

// Función para eliminar una búsqueda por ID
export const deleteSearch = (searchId) => {
  const searches = getSearches();
  const updatedSearches = searches.filter(search => search.id !== searchId);
  localStorage.setItem(SEARCHES_STORAGE_KEY, JSON.stringify(updatedSearches));
};

// Función para limpiar todo el historial
export const clearAllSearches = () => {
  localStorage.removeItem(SEARCHES_STORAGE_KEY);
};