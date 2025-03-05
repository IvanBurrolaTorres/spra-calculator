import React from 'react';

// Componente para mostrar el desglose de márgenes reales
function MarginBreakdown({ sellingPrice, costPrice, fbaFee, applyIva }) {
  if (!sellingPrice || !costPrice) {
    return (
      <div className="margin-breakdown empty-breakdown">
        <p>Ingrese precio de venta y costo para ver el desglose de márgenes.</p>
      </div>
    );
  }

  // Calcular valores
  const ivaRate = applyIva ? 0.16 : 0; // 16% IVA México si está activado
  const ivaAmount = sellingPrice * ivaRate / (1 + ivaRate);
  const priceBeforeIva = sellingPrice - ivaAmount;
  
  // Usar la tarifa FBA proporcionada
  const fbaFeeAmount = fbaFee || 0;
  
  // Ingresos después de comisiones e IVA
  const revenueAfterFees = priceBeforeIva - fbaFeeAmount;
  
  // Ganancia neta
  const netProfit = revenueAfterFees - costPrice;
  
  // Margen neto como porcentaje
  const netMarginPercentage = (netProfit / sellingPrice) * 100;
  
  // ROI (Return on Investment)
  const roi = (netProfit / costPrice) * 100;
  
  // Determinar clase de color según rentabilidad
  let marginClass = "poor-margin";
  if (netMarginPercentage >= 35) marginClass = "high-margin";
  else if (netMarginPercentage >= 25) marginClass = "good-margin";
  else if (netMarginPercentage >= 15) marginClass = "medium-margin";
  else if (netMarginPercentage >= 10) marginClass = "low-margin";

  return (
    <div className={`margin-breakdown ${marginClass}`}>
      <h4 className="breakdown-title">Desglose Real de Márgenes</h4>
      
      <div className="breakdown-table">
        <div className="breakdown-row">
          <span className="breakdown-label">Precio de venta:</span>
          <span className="breakdown-value">${sellingPrice.toFixed(2)}</span>
        </div>
        
        {applyIva && (
          <>
            <div className="breakdown-row">
              <span className="breakdown-label">IVA (16%):</span>
              <span className="breakdown-value">-${ivaAmount.toFixed(2)}</span>
            </div>
            <div className="breakdown-row">
              <span className="breakdown-label">Precio sin IVA:</span>
              <span className="breakdown-value">${priceBeforeIva.toFixed(2)}</span>
            </div>
          </>
        )}
        
        {fbaFeeAmount > 0 && (
          <div className="breakdown-row">
            <span className="breakdown-label">Comisión Amazon FBA:</span>
            <span className="breakdown-value">-${fbaFeeAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="breakdown-row subtotal">
          <span className="breakdown-label">Ingreso después de comisiones:</span>
          <span className="breakdown-value">${revenueAfterFees.toFixed(2)}</span>
        </div>
        
        <div className="breakdown-row">
          <span className="breakdown-label">Costo del producto:</span>
          <span className="breakdown-value">-${costPrice.toFixed(2)}</span>
        </div>
        
        <div className="breakdown-row total">
          <span className="breakdown-label">Beneficio neto:</span>
          <span className="breakdown-value">${netProfit.toFixed(2)}</span>
        </div>
      </div>
      
      <div className="margin-metrics">
        <div className={`metric ${marginClass}`}>
          <span className="metric-label">Margen Neto:</span>
          <span className="metric-value">{netMarginPercentage.toFixed(2)}%</span>
        </div>
        <div className={`metric ${marginClass}`}>
          <span className="metric-label">ROI:</span>
          <span className="metric-value">{roi.toFixed(2)}%</span>
        </div>
      </div>
      
      <div className="margin-interpretation">
        {netMarginPercentage >= 35 ? (
          <p>✅ <strong>Excelente margen.</strong> Este producto tiene una rentabilidad muy atractiva.</p>
        ) : netMarginPercentage >= 25 ? (
          <p>✅ <strong>Buen margen.</strong> Este producto tiene una rentabilidad sólida.</p>
        ) : netMarginPercentage >= 15 ? (
          <p>⚠️ <strong>Margen medio.</strong> Rentabilidad aceptable pero vigile los costos.</p>
        ) : netMarginPercentage >= 10 ? (
          <p>⚠️ <strong>Margen bajo.</strong> Rentabilidad limitada, busque optimizar costos.</p>
        ) : netMarginPercentage > 0 ? (
          <p>❌ <strong>Margen muy bajo.</strong> Apenas rentable, considere otras opciones.</p>
        ) : (
          <p>❌ <strong>Pérdida.</strong> Este producto genera pérdidas, NO recomendado.</p>
        )}
      </div>
    </div>
  );
}

export default MarginBreakdown;