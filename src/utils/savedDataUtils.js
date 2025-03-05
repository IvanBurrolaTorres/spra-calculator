// Funciones para manejar categorías guardadas
export const getSavedCategories = () => {
    const categoriesString = localStorage.getItem('spraCategories');
    return categoriesString ? JSON.parse(categoriesString) : [];
  };
  
  export const saveCategory = (category) => {
    if (!category.trim()) return false;
    
    const categories = getSavedCategories();
    
    // Verificar si la categoría ya existe
    if (categories.includes(category.trim())) {
      return false;
    }
    
    categories.push(category.trim());
    localStorage.setItem('spraCategories', JSON.stringify(categories));
    return true;
  };
  
  export const removeCategory = (category) => {
    const categories = getSavedCategories();
    const updatedCategories = categories.filter(cat => cat !== category);
    localStorage.setItem('spraCategories', JSON.stringify(updatedCategories));
  };
  
  // Funciones para manejar marcas guardadas
  export const getSavedBrands = () => {
    const brandsString = localStorage.getItem('spraBrands');
    return brandsString ? JSON.parse(brandsString) : [];
  };
  
  export const saveBrand = (brand) => {
    if (!brand.trim()) return false;
    
    const brands = getSavedBrands();
    
    // Verificar si la marca ya existe
    if (brands.includes(brand.trim())) {
      return false;
    }
    
    brands.push(brand.trim());
    localStorage.setItem('spraBrands', JSON.stringify(brands));
    return true;
  };
  
  export const removeBrand = (brand) => {
    const brands = getSavedBrands();
    const updatedBrands = brands.filter(b => b !== brand);
    localStorage.setItem('spraBrands', JSON.stringify(updatedBrands));
  };