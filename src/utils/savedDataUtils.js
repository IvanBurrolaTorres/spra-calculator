// Funciones para manejar categorías guardadas
export const getSavedCategories = () => {
    try {
      const categoriesString = localStorage.getItem('spraCategories');
      return categoriesString ? JSON.parse(categoriesString) : [];
    } catch (error) {
      console.error('Error al obtener categorías guardadas:', error);
      return [];
    }
  };
  
  export const saveCategory = (category) => {
    if (!category.trim()) return false;
    
    try {
      const categories = getSavedCategories();
      
      // Verificar si la categoría ya existe
      if (categories.includes(category.trim())) {
        return false;
      }
      
      categories.push(category.trim());
      localStorage.setItem('spraCategories', JSON.stringify(categories));
      return true;
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      return false;
    }
  };
  
  export const removeCategory = (category) => {
    try {
      const categories = getSavedCategories();
      const updatedCategories = categories.filter(cat => cat !== category);
      localStorage.setItem('spraCategories', JSON.stringify(updatedCategories));
      return true;
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
      return false;
    }
  };
  
  // Funciones para manejar marcas guardadas
  export const getSavedBrands = () => {
    try {
      const brandsString = localStorage.getItem('spraBrands');
      return brandsString ? JSON.parse(brandsString) : [];
    } catch (error) {
      console.error('Error al obtener marcas guardadas:', error);
      return [];
    }
  };
  
  export const saveBrand = (brand) => {
    if (!brand.trim()) return false;
    
    try {
      const brands = getSavedBrands();
      
      // Verificar si la marca ya existe
      if (brands.includes(brand.trim())) {
        return false;
      }
      
      brands.push(brand.trim());
      localStorage.setItem('spraBrands', JSON.stringify(brands));
      return true;
    } catch (error) {
      console.error('Error al guardar marca:', error);
      return false;
    }
  };
  
  export const removeBrand = (brand) => {
    try {
      const brands = getSavedBrands();
      const updatedBrands = brands.filter(b => b !== brand);
      localStorage.setItem('spraBrands', JSON.stringify(updatedBrands));
      return true;
    } catch (error) {
      console.error('Error al eliminar marca:', error);
      return false;
    }
  };