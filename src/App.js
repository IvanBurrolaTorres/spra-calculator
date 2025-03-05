import React, { useState } from 'react';
import './App.css';

function App() {
  const [productName, setProductName] = useState('');
  const [asin, setAsin] = useState('');
  const [category, setCategory] = useState('');
  const [revenue, setRevenue] = useState(0);
  const [competitors, setCompetitors] = useState(0);
  const [fbaVendors, setFbaVendors] = useState(0);
  const [fbmVendors, setFbmVendors] = useState(0);

  // Derived calculations
  const revenuePerCompetitor = competitors > 0 ? revenue / competitors : 0;
  const fbaRatio = (fbaVendors + fbmVendors > 0) ? fbaVendors / (fbaVendors + fbmVendors) : 0;
  const fbmRatio = (fbaVendors + fbmVendors > 0) ? fbmVendors / (fbaVendors + fbmVendors) : 0;

  // Scoring functions
  const getRevenueScore = () => {
    if (!revenue || !competitors) return 0;
    if (revenuePerCompetitor > 50000) return 45;
    if (revenuePerCompetitor > 25000) return 35;
    if (revenuePerCompetitor > 10000) return 25;
    if (revenuePerCompetitor > 5000) return 15;
    return 5;
  };

  const getCompetitorCountScore = () => {
    if (!competitors) return 0;
    if (competitors <= 2) return 20;
    if (competitors <= 4) return 15;
    if (competitors <= 6) return 8;
    return 0;
  };

  const getFbaFbmRatioScore = () => {
    if (!fbaVendors && !fbmVendors) return 0;
    if (fbmRatio > 0.7) return 20;
    if (fbmRatio >= 0.3) return 10;
    return 5;
  };

  const getBuyBoxProbability = () => {
    if (!fbaVendors && !fbmVendors) return "N/A";
    if (fbaVendors === 1 || fbmRatio > 0.7) return "Alta";
    if (fbmRatio >= 0.3 && fbmRatio <= 0.7) return "Media";
    return "Baja";
  };

  const getBuyBoxScore = () => {
    if (!fbaVendors && !fbmVendors) return 0;
    const probability = getBuyBoxProbability();
    if (probability === "Alta") return 15;
    if (probability === "Media") return 8;
    return 0;
  };

  // Calculate total score
  const revenueScore = getRevenueScore();
  const competitorScore = getCompetitorCountScore();
  const ratioScore = getFbaFbmRatioScore();
  const buyBoxScore = getBuyBoxScore();
  const totalScore = revenueScore + competitorScore + ratioScore + buyBoxScore;

  // Get rating
  const getRating = () => {
    if (totalScore >= 80) return "Rentabilidad Alta";
    if (totalScore >= 60) return "Rentabilidad Media-Alta";
    if (totalScore >= 40) return "Rentabilidad Media";
    if (totalScore >= 20) return "Rentabilidad Baja";
    return "No Recomendable";
  };

  // Get color based on score for className
  const getScoreColorClass = (score, max) => {
    const percentage = score / max;
    if (percentage >= 0.8) return "high-score";
    if (percentage >= 0.6) return "good-score";
    if (percentage >= 0.4) return "medium-score";
    if (percentage >= 0.2) return "low-score";
    return "poor-score";
  };

  const getTotalScoreColorClass = () => {
    if (totalScore >= 80) return "high-total";
    if (totalScore >= 60) return "good-total";
    if (totalScore >= 40) return "medium-total";
    if (totalScore >= 20) return "low-total";
    return "poor-total";
  };

  return (
    <div className="calculator-container">
      <h1 className="main-title">CALCULADORA SPRA: SISTEMA DE PUNTUACIÓN DE RENTABILIDAD PARA AMAZON</h1>
      
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
            />
          </div>
          <div className="form-group">
            <label className="form-label">ASIN:</label>
            <input 
              type="text" 
              className="form-input" 
              value={asin} 
              onChange={(e) => setAsin(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Categoría:</label>
            <input 
              type="text" 
              className="form-input" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
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
            />
          </div>
          <div className="form-group">
            <label className="form-label">Número de competidores:</label>
            <input 
              type="number" 
              className="form-input" 
              value={competitors} 
              onChange={(e) => setCompetitors(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Número de vendedores FBA:</label>
            <input 
              type="number" 
              className="form-input" 
              value={fbaVendors} 
              onChange={(e) => setFbaVendors(Number(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Número de vendedores FBM:</label>
            <input 
              type="number" 
              className="form-input" 
              value={fbmVendors} 
              onChange={(e) => setFbmVendors(Number(e.target.value))}
            />
          </div>
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
        </div>
      </div>
      
      {/* SPRA Analysis Results */}
      <div className="section results">
        <h2 className="section-title results-title">RESULTADOS DEL ANÁLISIS SPRA</h2>
        
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
        
        {/* Total Score */}
        <div className={`total-score ${getTotalScoreColorClass()}`}>
          <h3 className="total-score-title">PUNTUACIÓN TOTAL SPRA:</h3>
          <div className="total-score-value">
            {(revenue && competitors && (fbaVendors || fbmVendors)) 
              ? `${totalScore} / 100` 
              : "Ingresa los datos para calcular"}
          </div>
          <div className="total-rating">
            {(revenue && competitors && (fbaVendors || fbmVendors)) 
              ? getRating() 
              : "Pendiente"}
          </div>
        </div>
      </div>
      
      {/* Rating Scale */}
      <div className="section rating-scale">
        <h2 className="section-title">ESCALA DE VALORACIÓN</h2>
        <div className="scale-grid">
          <div className="scale-item high">80-100:<br/>Rentabilidad Alta</div>
          <div className="scale-item good">60-79:<br/>Rentabilidad Media-Alta</div>
          <div className="scale-item medium">40-59:<br/>Rentabilidad Media</div>
          <div className="scale-item low">20-39:<br/>Rentabilidad Baja</div>
          <div className="scale-item poor">0-19:<br/>No Recomendable</div>
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
    </div>
  );
}

export default App;