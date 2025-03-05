// Función para inicializar los datos guardados si no existen
export const initializeSavedData = () => {
    try {
      // Verificar si ya existen categorías guardadas
      const categoriesString = localStorage.getItem('spraCategories');
      if (!categoriesString) {
        // Inicializar con algunas categorías comunes
        const initialCategories = [
          'Electrónica',
          'Hogar',
          'Belleza',
          'Juguetes',
          'Ropa',
          'Deportes',
          'Herramientas',
          'Cocina',
          'Mascotas',
          'Oficina'
        ];
        localStorage.setItem('spraCategories', JSON.stringify(initialCategories));
        console.log('Categorías inicializadas con éxito');
      }
      
      // Verificar si ya existen marcas guardadas
      const brandsString = localStorage.getItem('spraBrands');
      if (!brandsString) {
        // Inicializar con un array vacío para marcas
        localStorage.setItem('spraBrands', JSON.stringify([]));
        console.log('Marcas inicializadas con éxito');
      }
      
      return true;
    } catch (error) {
      console.error('Error al inicializar datos guardados:', error);
      return false;
    }
  };