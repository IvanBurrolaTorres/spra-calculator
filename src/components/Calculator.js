import React, { useState, useEffect } from 'react';
import { saveSearch, getSearches } from '../utils/historyUtils';
import { getSavedCategories, getSavedBrands, saveCategory, saveBrand } from '../utils/savedDataUtils';
import SavedDataManager from './SavedDataManager';
import MarginBreakdown from './MarginBreakdown';
import AmazonCostsPanel from './AmazonCostsPanel';

function Calculator({ mode }) {
  // Datos básicos del producto
  const [productName, setProductName] = useState('');
  const [asin, setAsin] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  
  // Datos para análisis básico SPRA
  const [revenue, setRevenue] = useState(0);
  const [competitors, setCompetitors] = useState(0);
  const [fbaVendors, setFbaVendors] = useState(0);
  const [fbmVendors, setFbmVendors] = useState(0);
  
  // Datos adicionales para SPRA+
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [historicalMinPrice, setHistoricalMinPrice] = useState(0);
  
  // Costos de Amazon
  const [amazonCosts, setAmazonCosts] = useState({
    referralFee: 0,
    fulfillmentFee: 0,
    storageFee: 0,
    otherFees: 0,
    total: 0
  });
  
  // NUEVOS: Opciones configurables
  const [applyIva, setApplyIva] = useState(true); // IVA activado por defecto
  
  // Estado para categorías y marcas guardadas
  const [savedCategories, setSavedCategories] = useState([]);
  const [savedBrands, setSavedBrands] = useState([]);
  const [showSavedDataManager, setShowSavedDataManager] = useState(false);
  const [showCategoriesList, setShowCategoriesList] = useState(false);
  const [showBrandsList, setShowBrandsList] = useState(false);
  
  // Estado para el modal de confirmación de ASIN duplicado
  const [showDuplicateAsinModal, setShowDuplicateAsinModal] = useState(false);
  const [pendingSearchData, setPendingSearchData] = useState(null);
  
  // Cálculos derivados
  const revenuePerCompetitor = competitors > 0 ? revenue / competitors : 0;
  const fbaRatio = (fbaVendors + fbmVendors > 0) ? fbaVendors / (fbaVendors + fbmVendors) : 0;
  const fbmRatio = (fbaVendors + fbmVendors > 0) ? fbmVendors / (fbaVendors + fbmVendors) : 0;
  
  // Cálculos SPRA+ adaptados para el nuevo sistema de costos
  const calculateNetMargin = () => {
    if (!sellingPrice || !costPrice) return 0;
    
    const ivaRate = applyIva ? 0.16 : 0; // Solo aplicar IVA si está activado
    
    // Precio después de IVA
    const priceAfterIva = sellingPrice / (1 + ivaRate);
    
    // Usar los costos de Amazon totales
    const fees = amazonCosts.total;
    
    // Ingresos netos después de comisiones
    const netRevenue = priceAfterIva - fees;
    
    // Margen neto (después de costos, comisiones e IVA)
    return ((netRevenue - costPrice) / sellingPrice) * 100;
  };
  
  const grossMargin = calculateNetMargin();
  
  const priceStability = sellingPrice > 0 && historicalMinPrice > 0 
    ? ((sellingPrice - historicalMinPrice) / sellingPrice) * 100 
    : 0;

  // Cargar categorías y marcas guardadas
  useEffect(() => {
    loadSavedData();
  }, []);

  // Recargar datos guardados después de cerrar el gestor
  useEffect(() => {
    if (!showSavedDataManager) {
      loadSavedData();
    }
  }, [showSavedDataManager]);

  const loadSavedData = () => {
    setSavedCategories(getSavedCategories());
    setSavedBrands(getSavedBrands());
  };

  // Manejar selección de categoría
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory);
    setShowCategoriesList(false);
  };

  // Manejar selección de marca
  const handleBrandSelect = (selectedBrand) => {
    setBrand(selectedBrand);
    setShowBrandsList(false);
  };

  // Guardar nueva categoría
  const handleSaveCategory = () => {
    if (category.trim() && saveCategory(category)) {
      loadSavedData();
      alert('Categoría guardada con éxito.');
    } else if (category.trim()) {
      alert('Esta categoría ya está guardada.');
    }
  };

  // Guardar nueva marca
  const handleSaveBrand = () => {
    if (brand.trim() && saveBrand(brand)) {
      loadSavedData();
      alert('Marca guardada con éxito.');
    } else if (brand.trim()) {
      alert('Esta marca ya está guardada.');
    }
  };

  // Scoring functions para SPRA básico (versiones mejoradas)
  const getRevenueScore = () => {
    if (!revenue || !competitors) return 0;
    
    // Ajuste para ser más estricto con ingresos por competidor
    if (revenuePerCompetitor > 75000) return 45;
    if (revenuePerCompetitor > 40000) return 35;
    if (revenuePerCompetitor > 20000) return 25;
    if (revenuePerCompetitor > 10000) return 15;
    if (revenuePerCompetitor > 5000) return 5;
    return 0;
  };

  const getCompetitorCountScore = () => {
    if (!competitors) return 0;
    if (competitors === 1) return 20; // Ser el único es ideal
    if (competitors <= 3) return 15;
    if (competitors <= 5) return 10;
    if (competitors <= 7) return 5;
    return 0; // Más de 7 competidores es muy saturado
  };

  const getFbaFbmRatioScore = () => {
    if (!fbaVendors && !fbmVendors) return 0;
    
    if (fbaVendors === 0 && fbmVendors > 0) return 20; // Mejor escenario: sin FBA, solo FBM
    if (fbmRatio > 0.8) return 18;
    if (fbmRatio > 0.6) return 15;
    if (fbmRatio > 0.4) return 10;
    if (fbmRatio > 0.2) return 5;
    return 0; // Muy mal si casi todos son FBA
  };

  const getBuyBoxProbability = () => {
    if (!fbaVendors && !fbmVendors) return "N/A";
    
    // Mejor evaluación de probabilidad del Buy Box
    if (fbaVendors === 0 || (fbaVendors === 1 && fbmVendors >= 3)) return "Alta";
    if (fbmRatio > 0.6) return "Media";
    return "Baja";
  };

  const getBuyBoxScore = () => {
    if (!fbaVendors && !fbmVendors) return 0;
    
    const probability = getBuyBoxProbability();
    if (probability === "Alta") return 15;
    if (probability === "Media") return 7;
    return 0;
  };

  // Funciones scoring para SPRA+ (versiones mejoradas)
  const getGrossMarginScore = () => {
    if (mode !== 'plus' || !sellingPrice || !costPrice) return 0;
    
    const netMargin = grossMargin;
    
    // Umbrales mucho más exigentes considerando todas las comisiones
    if (netMargin >= 35) return 15;
    if (netMargin >= 25) return 12;
    if (netMargin >= 15) return 8;
    if (netMargin >= 10) return 4;
    if (netMargin > 0) return 2; // Al menos hay algún margen positivo
    return 0; // Margen negativo o cero
  };

  const getPriceStabilityScore = () => {
    if (mode !== 'plus' || !sellingPrice || !historicalMinPrice) return 0;
    
    // Ajustado para ser más estricto
    if (priceStability < 3) return 15; // Muy estable
    if (priceStability < 10) return 10;
    if (priceStability < 20) return 5;
    if (priceStability < 30) return 2;
    return 0; // Muy inestable
  };

  // Calculate total score
  const revenueScore = getRevenueScore();
  const competitorScore = getCompetitorCountScore();
  const ratioScore = getFbaFbmRatioScore();
  const buyBoxScore = getBuyBoxScore();
  const marginScore = getGrossMarginScore();
  const stabilityScore = getPriceStabilityScore();
  
  const basicTotalScore = revenueScore + competitorScore + ratioScore + buyBoxScore;
  const plusTotalScore = basicTotalScore + marginScore + stabilityScore;
  const totalScore = mode === 'plus' ? plusTotalScore : basicTotalScore;
  const maxScore = mode === 'plus' ? 130 : 100;

  // Get rating (versión mejorada)
  const getRating = () => {
    const scorePercentage = (totalScore / maxScore) * 100;
    
    // Umbrales más estrictos
    if (scorePercentage >= 85) return "Rentabilidad Alta";
    if (scorePercentage >= 70) return "Rentabilidad Media-Alta";
    if (scorePercentage >= 50) return "Rentabilidad Media";
    if (scorePercentage >= 30) return "Rentabilidad Baja";
    return "No Recomendable";
  };

  // Get color based on score for className (versión mejorada)
  const getScoreColorClass = (score, max) => {
    const percentage = score / max;
    if (percentage >= 0.85) return "high-score";
    if (percentage >= 0.70) return "good-score";
    if (percentage >= 0.50) return "medium-score";
    if (percentage >= 0.30) return "low-score";
    return "poor-score";
  };

  const getTotalScoreColorClass = () => {
    const percentage = totalScore / maxScore;
    
    // Umbrales más estrictos para colores
    if (percentage >= 0.85) return "high-total";
    if (percentage >= 0.70) return "good-total";
    if (percentage >= 0.50) return "medium-total";
    if (percentage >= 0.30) return "low-total";
    return "poor-total";
  };

  // Verificar si un ASIN ya existe
  const checkAsinExists = (asinToCheck) => {
    const savedSearches = getSearches();
    return savedSearches.some(search => search.asin.trim().toLowerCase() === asinToCheck.trim().toLowerCase());
  };

  // Función para confirmar guardar un ASIN duplicado
  const confirmSaveSearch = () => {
    if (pendingSearchData) {
      saveSearch(pendingSearchData);
      setPendingSearchData(null);
      setShowDuplicateAsinModal(false);
      alert('Búsqueda guardada con éxito.');
    }
  };

  // Cancelar guardar un ASIN duplicado
  const cancelSaveSearch = () => {
    setPendingSearchData(null);
    setShowDuplicateAsinModal(false);
  };

  // Save search to history
  const handleSaveSearch = () => {
    if (!productName || !asin) {
      alert('Por favor, ingrese al menos el Nombre del Producto y el ASIN para guardar el registro.');
      return;
    }

    const searchData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      productName,
      asin,
      category,
      brand,
      revenue,
      competitors,
      fbaVendors,
      fbmVendors,
      totalScore,
      maxScore,
      mode,
      rating: getRating()
    };

    // Add SPRA+ data if in plus mode
    if (mode === 'plus') {
      searchData.costPrice = costPrice;
      searchData.sellingPrice = sellingPrice;
      searchData.historicalMinPrice = historicalMinPrice;
      searchData.grossMargin = grossMargin;
      searchData.priceStability = priceStability;
      searchData.marginScore = marginScore;
      searchData.stabilityScore = stabilityScore;
      searchData.applyIva = applyIva;
      searchData.amazonCosts = amazonCosts;
    }

    // Verificar si el ASIN ya existe
    if (checkAsinExists(asin)) {
      setPendingSearchData(searchData);
      setShowDuplicateAsinModal(true);
    } else {
      saveSearch(searchData);
      alert('Búsqueda guardada con éxito.');
    }
  };

  // Reset form
  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que deseas reiniciar el formulario?')) {
      setProductName('');
      setAsin('');
      setCategory('');
      setBrand('');
      setRevenue(0);
      setCompetitors(0);
      setFbaVendors(0);
      setFbmVendors(0);
      
      // Reset SPRA+ fields
      setCostPrice(0);
      setSellingPrice(0);
      setHistoricalMinPrice(0);
      setAmazonCosts({
        referralFee: 0,
        fulfillmentFee: 0,
        storageFee: 0,
        otherFees: 0,
        total: 0
      });
      setApplyIva(true);
    }
  };

  // Validación de datos para SPRA+
  const hasValidSpraBasicData = revenue && competitors && (fbaVendors || fbmVendors);
  const hasValidSpraPlusData = hasValidSpraBasicData && mode === 'plus' && costPrice && sellingPrice && historicalMinPrice;

  // Manejar cambios en los costos de Amazon
  const handleAmazonCostsChange = (costs) => {
    setAmazonCosts(costs);
  };

  return (
    <div className="calculator-container">
      {/* Product Information */}
      <div className="section product-info">
        <h2 className="section-title">Información del Producto</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Nombre del Producto:</label>
            <input 
              type="text" 
              className="form-input" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Ingrese nombre del producto"
            />
          </div>
          <div className="form-group">
            <label className="form-label">ASIN:</label>
            <input 
              type="text" 
              className="form-input" 
              value={asin} 
              onChange={(e) => setAsin(e.target.value)}
              placeholder="Ej. B0123456789"
            />
          </div>
          <div className="form-group dropdown-group">
            <label className="form-label">Categoría:</label>
            <div className="dropdown-input-container">
              <input 
                type="text" 
                className="form-input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Seleccione o ingrese categoría"
                onClick={() => setShowCategoriesList(true)}
              />
              <div className="input-actions">
                {category && (
                  <button 
                    className="save-value-button" 
                    title="Guardar categoría"
                    onClick={handleSaveCategory}
                  >
                    💾
                  </button>
                )}
                <button 
                  className="dropdown-toggle" 
                  onClick={() => setShowCategoriesList(!showCategoriesList)}
                >
                  {showCategoriesList ? '▲' : '▼'}
                </button>
              </div>
              
              {showCategoriesList && savedCategories.length > 0 && (
                <ul className="dropdown-options">
                  {savedCategories.map((cat) => (
                    <li 
                      key={cat} 
                      onClick={() => handleCategorySelect(cat)}
                      className={cat === category ? 'selected' : ''}
                    >
                      {cat}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <div className="form-group dropdown-group">
            <label className="form-label">Marca:</label>
            <div className="dropdown-input-container">
              <input 
                type="text" 
                className="form-input" 
                value={brand} 
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Seleccione o ingrese marca"
                onClick={() => setShowBrandsList(true)}
              />
              <div className="input-actions">
                {brand && (
                  <button 
                    className="save-value-button" 
                    title="Guardar marca"
                    onClick={handleSaveBrand}
                  >
                    💾
                  </button>
                )}
                <button 
                  className="dropdown-toggle" 
                  onClick={() => setShowBrandsList(!showBrandsList)}
                >
                  {showBrandsList ? '▲' : '▼'}
                </button>
              </div>
              
              {showBrandsList && savedBrands.length > 0 && (
                <ul className="dropdown-options">
                  {savedBrands.map((b) => (
                    <li 
                      key={b} 
                      onClick={() => handleBrandSelect(b)}
                      className={b === brand ? 'selected' : ''}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        <div className="manage-saved-data">
          <button 
            className="manage-data-button"
            onClick={() => setShowSavedDataManager(true)}
          >
            <span className="button-icon">⚙️</span> Gestionar Categorías y Marcas
          </button>
        </div>
      </div>
      
      {/* Key Data */}
      <div className="section key-data">
        <h2 className="section-title">Datos Clave para Análisis</h2>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Ingresos en 30 días ($):</label>
            <input 
              type="number" 
              className="form-input" 
              value={revenue} 
              onChange={(e) => setRevenue(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Número de competidores:</label>
            <input 
              type="number" 
              className="form-input" 
              value={competitors} 
              onChange={(e) => setCompetitors(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Número de vendedores FBA:</label>
            <input 
              type="number" 
              className="form-input" 
              value={fbaVendors} 
              onChange={(e) => setFbaVendors(Number(e.target.value))}
              min="0"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Número de vendedores FBM:</label>
            <input 
              type="number" 
              className="form-input" 
              value={fbmVendors} 
              onChange={(e) => setFbmVendors(Number(e.target.value))}
              min="0"
            />
          </div>
        </div>

        {/* SPRA+ specific fields */}
        {mode === 'plus' && (
          <div className="plus-fields-container">
            <h3 className="plus-fields-title">
              <span className="badge plus-badge">PLUS</span> Datos Adicionales para SPRA+
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Costo de adquisición ($):</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={costPrice} 
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Precio de venta actual ($):</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={sellingPrice} 
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Precio mínimo histórico ($):</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={historicalMinPrice} 
                  onChange={(e) => setHistoricalMinPrice(Number(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            {/* Panel de costos de Amazon */}
            <AmazonCostsPanel 
              sellingPrice={sellingPrice}
              category={category}
              onCostsChange={handleAmazonCostsChange}
            />
            
            {/* Opción para activar/desactivar IVA */}
            <div className="tax-toggle-container">
              <label className="tax-toggle-label">
                <input
                  type="checkbox"
                  checked={applyIva}
                  onChange={() => setApplyIva(!applyIva)}
                  className="tax-toggle-checkbox"
                />
                <span className="tax-toggle-text">
                  Aplicar IVA de México (16%)
                </span>
              </label>
              <span className="tax-toggle-help">
                <span className="tooltip-icon">ℹ️</span>
                <span className="tooltip-text">
                  Si el producto está destinado al mercado mexicano, debe aplicarse el IVA del 16%. Desactive esta opción si el producto está destinado a otro mercado o si desea omitir el cálculo del IVA.
                </span>
              </span>
            </div>
            
            {/* Mostrar el componente de desglose de márgenes */}
            {sellingPrice > 0 && costPrice > 0 && (
              <MarginBreakdown 
                sellingPrice={sellingPrice}
                costPrice={costPrice}
                amazonCosts={amazonCosts}
                applyIva={applyIva}
                historicalMinPrice={historicalMinPrice}
              />
            )}
          </div>
        )}

        <div className="form-actions">
          <button onClick={handleSaveSearch} className="save-button">
            <span className="button-icon">💾</span> Guardar Búsqueda
          </button>
          <button onClick={handleReset} className="reset-button">
            <span className="button-icon">🔄</span> Reiniciar
          </button>
        </div>
      </div>
      
      {/* Automatic Calculations */}
      <div className="section auto-calcs">
        <h2 className="section-title">Cálculos Automáticos</h2>
        <div className="calcs-grid">
          <div className="calc-item">
            <span className="calc-label">Ingresos por competidor:</span>
            <div className="calc-value">${revenuePerCompetitor.toFixed(2)}</div>
          </div>
          <div className="calc-item">
            <span className="calc-label">Proporción FBA vs Total:</span>
            <div className="calc-value">{(fbaRatio * 100).toFixed(0)}%</div>
          </div>
          <div className="calc-item">
            <span className="calc-label">Proporción FBM vs Total:</span>
            <div className="calc-value">{(fbmRatio * 100).toFixed(0)}%</div>
          </div>
          
          {mode === 'plus' && (
            <>
              <div className="calc-item plus-calc">
                <span className="calc-label">
                  <span className="badge plus-badge">PLUS</span> Margen neto:
                </span>
                <div className="calc-value">{grossMargin.toFixed(2)}%</div>
              </div>
              <div className="calc-item plus-calc">
                <span className="calc-label">
                  <span className="badge plus-badge">PLUS</span> Diferencia con precio mínimo:
                </span>
                <div className="calc-value">{priceStability.toFixed(2)}%</div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* SPRA Analysis Results */}
      <div className="section results">
        <h2 className="section-title results-title">
          RESULTADOS DEL ANÁLISIS {mode === 'plus' ? 'SPRA+' : 'SPRA'}
        </h2>
        
        {/* Criterion 1 */}
        <div className={`criterion ${getScoreColorClass(revenueScore, 45)}`}>
          <h3 className="criterion-title">1. Ingresos vs. Competencia (45 puntos)</h3>
          <div className="criterion-grid">
            <div className="criterion-item">
              <span className="criterion-label">Revenue ajustado:</span>
              <div className="criterion-value">${revenuePerCompetitor.toFixed(2)}</div>
            </div>
            <div className="criterion-item">
              <span className="criterion-label">Puntuación:</span>
              <div className="criterion-value">{revenueScore} / 45</div>
            </div>
          </div>
        </div>
        
        {/* Criterion 2 */}
        <div className={`criterion ${getScoreColorClass(competitorScore + ratioScore, 40)}`}>
          <h3 className="criterion-title">2. Densidad y Tipo de Competencia (40 puntos)</h3>
          <div className="criterion-grid">
            <div className="criterion-item">
              <span className="criterion-label">Número de competidores:</span>
              <div className="criterion-value">{competitors}</div>
            </div>
            <div className="criterion-item">
              <span className="criterion-label">Puntuación:</span>
              <div className="criterion-value">{competitorScore} / 20</div>
            </div>
          </div>
          <div className="criterion-grid">
            <div className="criterion-item">
              <span className="criterion-label">Proporción FBA vs. FBM:</span>
              <div className="criterion-value">
                FBA: {(fbaRatio * 100).toFixed(0)}% | FBM: {(fbmRatio * 100).toFixed(0)}%
              </div>
            </div>
            <div className="criterion-item">
              <span className="criterion-label">Puntuación:</span>
              <div className="criterion-value">{ratioScore} / 20</div>
            </div>
          </div>
        </div>
        
        {/* Criterion 3 */}
        <div className={`criterion ${getScoreColorClass(buyBoxScore, 15)}`}>
          <h3 className="criterion-title">3. Control de Buy Box (15 puntos)</h3>
          <div className="criterion-grid">
            <div className="criterion-item">
              <span className="criterion-label">Probabilidad:</span>
              <div className="criterion-value">{getBuyBoxProbability()}</div>
            </div>
            <div className="criterion-item">
              <span className="criterion-label">Puntuación:</span>
              <div className="criterion-value">{buyBoxScore} / 15</div>
            </div>
          </div>
        </div>
        
        {/* SPRA+ Criteria */}
        {mode === 'plus' && (
          <div className={`criterion plus-criterion ${getScoreColorClass(marginScore + stabilityScore, 30)}`}>
            <h3 className="criterion-title">
              <span className="badge plus-badge">PLUS</span> 4. Análisis de Margen y Estabilidad de Precios (30 puntos)
            </h3>
            <div className="criterion-grid">
              <div className="criterion-item">
                <span className="criterion-label">Margen neto actual:</span>
                <div className="criterion-value">{grossMargin.toFixed(2)}%</div>
              </div>
              <div className="criterion-item">
                <span className="criterion-label">Puntuación:</span>
                <div className="criterion-value">{marginScore} / 15</div>
              </div>
            </div>
            <div className="criterion-grid">
              <div className="criterion-item">
                <span className="criterion-label">Estabilidad del precio:</span>
                <div className="criterion-value">
                  Diferencia con mínimo: {priceStability.toFixed(2)}%
                </div>
              </div>
              <div className="criterion-item">
                <span className="criterion-label">Puntuación:</span>
                <div className="criterion-value">{stabilityScore} / 15</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Total Score */}
        <div className={`total-score ${getTotalScoreColorClass()}`}>
          <h3 className="total-score-title">PUNTUACIÓN TOTAL {mode === 'plus' ? 'SPRA+' : 'SPRA'}:</h3>
          <div className="total-score-value">
            {(mode === 'basic' && hasValidSpraBasicData) || (mode === 'plus' && hasValidSpraPlusData) 
              ? `${totalScore} / ${maxScore}` 
              : "Ingresa los datos para calcular"}
          </div>
          <div className="total-rating">
            {(mode === 'basic' && hasValidSpraBasicData) || (mode === 'plus' && hasValidSpraPlusData) 
              ? getRating() 
              : "Pendiente"}
          </div>
          
          {/* Visual score representation */}
          {((mode === 'basic' && hasValidSpraBasicData) || (mode === 'plus' && hasValidSpraPlusData)) && (
            <div className="score-progress-container">
              <div 
                className="score-progress-bar" 
                style={{ width: `${(totalScore / maxScore) * 100}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Rating Scale - Adjusted for SPRA+ */}
      <div className="section rating-scale">
        <h2 className="section-title">ESCALA DE VALORACIÓN ({mode === 'plus' ? 'SPRA+' : 'SPRA'})</h2>
        <div className="scale-grid">
          <div className="scale-item high">85-100%:<br/>Rentabilidad Alta</div>
          <div className="scale-item good">70-84%:<br/>Rentabilidad Media-Alta</div>
          <div className="scale-item medium">50-69%:<br/>Rentabilidad Media</div>
          <div className="scale-item low">30-49%:<br/>Rentabilidad Baja</div>
          <div className="scale-item poor">0-29%:<br/>No Recomendable</div>
        </div>
      </div>
      
      {/* Additional Notes */}
      <div className="section additional-notes">
        <h2 className="section-title">FACTORES COMPLEMENTARIOS (NO PUNTUADOS)</h2>
        <ul className="notes-list">
          <li>Estacionalidad: Evaluar si el producto tiene demanda constante o picos estacionales</li>
          <li>Tendencia de ventas: Verificar si está creciendo, estable o decayendo</li>
          <li>Calificaciones de competidores: Analizar promedio de estrellas y número de reseñas</li>
          <li>Categoría del producto: Algunas categorías tienen naturalmente mayor rotación o márgenes</li>
          <li>Dificultad logística: Productos grandes, pesados o frágiles tienen consideraciones especiales</li>
        </ul>
      </div>
      
      {/* SPRA+ Description - shown only in plus mode */}
      {mode === 'plus' && (
        <div className="section plus-info">
          <h2 className="section-title">
            <span className="badge plus-badge">PLUS</span> INFORMACIÓN SOBRE SPRA+
          </h2>
          <div className="plus-description">
            <p>
              El SPRA+ (Sistema de Puntuación de Rentabilidad para Amazon Plus) es una versión ampliada del sistema SPRA básico 
              que incorpora criterios adicionales relacionados con los costos y la estructura de precios, permitiendo 
              un análisis de rentabilidad más profundo.
            </p>
            <h4>Ventajas del SPRA+:</h4>
            <ul>
              <li>Proporciona una visión más completa de la rentabilidad potencial real</li>
              <li>Permite anticipar guerras de precios basándose en el historial de precios mínimos</li>
              <li>Evalúa la sostenibilidad del margen de beneficio a largo plazo</li>
              <li>Ayuda a identificar productos con márgenes saludables y estables</li>
              <li>Destaca riesgos potenciales relacionados con la volatilidad de precios</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Modal para gestionar datos guardados */}
      {showSavedDataManager && (
        <SavedDataManager 
          onClose={() => setShowSavedDataManager(false)} 
        />
      )}
      
      {/* Modal de confirmación para ASIN duplicado */}
      {showDuplicateAsinModal && (
        <div className="modal-overlay">
          <div className="modal-container duplicate-asin-modal">
            <div className="modal-header">
              <h3>ASIN Duplicado</h3>
              <button className="close-modal-btn" onClick={cancelSaveSearch}>×</button>
            </div>
            <div className="modal-content">
              <p className="warning-message">
                <span className="warning-icon">⚠️</span>
                Ya existe un producto con este ASIN en tu historial.
              </p>
              <p>¿Quieres continuar y guardar este análisis de todos modos?</p>
              <div className="duplicate-product-info">
                <p><strong>ASIN:</strong> {asin}</p>
                <p><strong>Producto:</strong> {productName}</p>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cancel-button" onClick={cancelSaveSearch}>
                Cancelar
              </button>
              <button className="confirm-button" onClick={confirmSaveSearch}>
                Guardar de todos modos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calculator;