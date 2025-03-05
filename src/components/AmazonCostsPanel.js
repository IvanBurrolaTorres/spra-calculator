import React, { useState, useEffect } from 'react';

const AmazonCostsPanel = ({ 
  sellingPrice, 
  category,
  onCostsChange 
}) => {
  // Estados para cada componente del costo
  const [referralFee, setReferralFee] = useState(0);
  const [fulfillmentFee, setFulfillmentFee] = useState(0);
  const [storageFee, setStorageFee] = useState(0);
  const [otherFees, setOtherFees] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calcular tarifa de referencia sugerida (podría mejorarse con tarifas reales por categoría)
  const calculateSuggestedReferralFee = () => {
    if (!sellingPrice) return 0;
    
    // Tarifas de referencia aproximadas por categoría
    const categoryRates = {
      'Electrónica': 0.15,
      'Informática': 0.15,
      'Hogar': 0.15,
      'Belleza': 0.15,
      'Ropa': 0.15,
      'Juguetes': 0.15,
      'Salud': 0.15,
      'Deportes': 0.15,
      'Herramientas': 0.15,
      'Alimentos': 0.15,
      'Libros': 0.15,
      'default': 0.15 // Tasa predeterminada
    };
    
    const rate = categoryRates[category] || categoryRates['default'];
    return sellingPrice * rate;
  };
  
  // Sugerir tarifas cuando cambia el precio o la categoría
  useEffect(() => {
    const suggestedReferral = calculateSuggestedReferralFee();
    setReferralFee(suggestedReferral.toFixed(2));
  }, [sellingPrice, category]);
  
  // Calcular total de costos cuando cualquier valor cambia
  useEffect(() => {
    const totalCosts = {
      referralFee: parseFloat(referralFee) || 0,
      fulfillmentFee: parseFloat(fulfillmentFee) || 0,
      storageFee: parseFloat(storageFee) || 0,
      otherFees: parseFloat(otherFees) || 0,
      total: (parseFloat(referralFee) || 0) + 
             (parseFloat(fulfillmentFee) || 0) + 
             (parseFloat(storageFee) || 0) + 
             (parseFloat(otherFees) || 0)
    };
    
    onCostsChange(totalCosts);
  }, [referralFee, fulfillmentFee, storageFee, otherFees, onCostsChange]);
  
  return (
    <div className="amazon-costs-panel">
      <div className="amazon-costs-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h4 className="amazon-costs-title">
          Costos de Amazon {isExpanded ? '▼' : '▶'}
        </h4>
        <div className="amazon-costs-summary">
          Total: ${((parseFloat(referralFee) || 0) + 
                   (parseFloat(fulfillmentFee) || 0) + 
                   (parseFloat(storageFee) || 0) + 
                   (parseFloat(otherFees) || 0)).toFixed(2)}
        </div>
      </div>
      
      {isExpanded && (
        <div className="amazon-costs-details">
          <div className="fee-input-group">
            <div className="fee-description">
              <label htmlFor="referralFee" className="fee-label">Tarifa de Referencia (Comisión):</label>
              <span className="fee-tip" title="Comisión que cobra Amazon por vender en su plataforma, generalmente entre 8% y 15%">ℹ️</span>
            </div>
            <div className="fee-input-wrapper">
              <span className="fee-currency">$</span>
              <input
                id="referralFee"
                type="number"
                value={referralFee}
                onChange={(e) => setReferralFee(e.target.value)}
                className="fee-input"
                min="0"
                step="0.01"
              />
              <span className="fee-percent">
                {sellingPrice ? `(${((parseFloat(referralFee) / sellingPrice) * 100).toFixed(1)}%)` : ''}
              </span>
            </div>
          </div>
          
          <div className="fee-input-group">
            <div className="fee-description">
              <label htmlFor="fulfillmentFee" className="fee-label">Costo de Gestión Logística (FBA):</label>
              <span className="fee-tip" title="Costo que cobra Amazon por almacenar, empaquetar y enviar tu producto">ℹ️</span>
            </div>
            <div className="fee-input-wrapper">
              <span className="fee-currency">$</span>
              <input
                id="fulfillmentFee"
                type="number"
                value={fulfillmentFee}
                onChange={(e) => setFulfillmentFee(e.target.value)}
                className="fee-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="fee-input-group">
            <div className="fee-description">
              <label htmlFor="storageFee" className="fee-label">Costo de Almacenamiento:</label>
              <span className="fee-tip" title="Costo mensual por almacenar tu producto en los centros de Amazon">ℹ️</span>
            </div>
            <div className="fee-input-wrapper">
              <span className="fee-currency">$</span>
              <input
                id="storageFee"
                type="number"
                value={storageFee}
                onChange={(e) => setStorageFee(e.target.value)}
                className="fee-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="fee-input-group">
            <div className="fee-description">
              <label htmlFor="otherFees" className="fee-label">Otras tarifas de Amazon:</label>
              <span className="fee-tip" title="Otras tarifas como etiquetado, preparación, etc.">ℹ️</span>
            </div>
            <div className="fee-input-wrapper">
              <span className="fee-currency">$</span>
              <input
                id="otherFees"
                type="number"
                value={otherFees}
                onChange={(e) => setOtherFees(e.target.value)}
                className="fee-input"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="costs-info-box">
            <p className="costs-info-text">
              <strong>Sugerencia:</strong> Para obtener costos exactos, usa la 
              <a 
                href="https://sellercentral.amazon.com/hz/fba/profitabilitycalculator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="amazon-calc-link"
              > Calculadora FBA de Amazon</a> y copia los valores aquí.
            </p>
          </div>
          
          <div className="total-fees-display">
            <span className="total-fees-label">Total de Costos Amazon:</span>
            <span className="total-fees-value">
              ${((parseFloat(referralFee) || 0) + 
                 (parseFloat(fulfillmentFee) || 0) + 
                 (parseFloat(storageFee) || 0) + 
                 (parseFloat(otherFees) || 0)).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmazonCostsPanel;