import React, { useState } from 'react';

function MarginBreakdown({ sellingPrice, costPrice, amazonCosts, applyIva }) {
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' o 'summary'

  if (!sellingPrice || !costPrice) {
    return (
      <div className="margin-breakdown empty-breakdown">
        <p>Ingrese precio de venta y costo para ver el desglose de márgenes.</p>
      </div>
    );
  }

  // Extraer costos de Amazon
  const { referralFee, fulfillmentFee, storageFee, otherFees, total: totalAmazonFees } = amazonCosts || {
    referralFee: 0,
    fulfillmentFee: 0,
    storageFee: 0,
    otherFees: 0,
    total: 0
  };

  // Calcular valores
  const ivaRate = applyIva ? 0.16 : 0; // 16% IVA México si está activado
  const ivaAmount = sellingPrice * ivaRate / (1 + ivaRate);
  const priceBeforeIva = sellingPrice - ivaAmount;
  
  // Ingresos después de comisiones e IVA
  const revenueAfterFees = priceBeforeIva - totalAmazonFees;
  
  // Ganancia neta
  const netProfit = revenueAfterFees - costPrice;
  
  // Margen neto como porcentaje
  const netMarginPercentage = (netProfit / sellingPrice) * 100;
  
  // ROI (Return on Investment)
  const roi = (netProfit / costPrice) * 100;
  
  // Punto de equilibrio (Break-even price)
  const breakEvenPrice = (costPrice + totalAmazonFees) / (1 - (ivaRate / (1 + ivaRate)));
  
  // Determinar clase de color según rentabilidad
  let marginClass = "poor-margin";
  if (netMarginPercentage >= 35) marginClass = "high-margin";
  else if (netMarginPercentage >= 25) marginClass = "good-margin";
  else if (netMarginPercentage >= 15) marginClass = "medium-margin";
  else if (netMarginPercentage >= 10) marginClass = "low-margin";

  return (
    <div className={`margin-breakdown ${marginClass}`}>
      <div className="breakdown-header">
        <h4 className="breakdown-title">Desglose Real de Márgenes</h4>
        <div className="breakdown-view-toggle">
          <button 
            className={`breakdown-view-button ${viewMode === 'detailed' ? 'active' : ''}`}
            onClick={() => setViewMode('detailed')}
          >
            Detallado
          </button>
          <button 
            className={`breakdown-view-button ${viewMode === 'summary' ? 'active' : ''}`}
            onClick={() => setViewMode('summary')}
          >
            Resumen
          </button>
        </div>
      </div>
      
      {viewMode === 'detailed' ? (
        <div className="breakdown-detailed">
          <div className="breakdown-section">
            <h5 className="breakdown-section-title">Ingresos</h5>
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
            </div>
          </div>
          
          <div className="breakdown-section">
            <h5 className="breakdown-section-title">Costos de Amazon</h5>
            <div className="breakdown-table">
              {referralFee > 0 && (
                <div className="breakdown-row">
                  <span className="breakdown-label">Tarifa de referencia (comisión):</span>
                  <span className="breakdown-value">-${parseFloat(referralFee).toFixed(2)}</span>
                </div>
              )}
              
              {fulfillmentFee > 0 && (
                <div className="breakdown-row">
                  <span className="breakdown-label">Gestión logística (FBA):</span>
                  <span className="breakdown-value">-${parseFloat(fulfillmentFee).toFixed(2)}</span>
                </div>
              )}
              
              {storageFee > 0 && (
                <div className="breakdown-row">
                  <span className="breakdown-label">Almacenamiento:</span>
                  <span className="breakdown-value">-${parseFloat(storageFee).toFixed(2)}</span>
                </div>
              )}
              
              {otherFees > 0 && (
                <div className="breakdown-row">
                  <span className="breakdown-label">Otras tarifas:</span>
                  <span className="breakdown-value">-${parseFloat(otherFees).toFixed(2)}</span>
                </div>
              )}
              
              <div className="breakdown-row subtotal">
                <span className="breakdown-label">Total costos Amazon:</span>
                <span className="breakdown-value">-${totalAmazonFees.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="breakdown-section">
            <h5 className="breakdown-section-title">Costo del Producto</h5>
            <div className="breakdown-table">
              <div className="breakdown-row subtotal">
                <span className="breakdown-label">Ingreso neto después de Amazon:</span>
                <span className="breakdown-value">${revenueAfterFees.toFixed(2)}</span>
              </div>
              
              <div className="breakdown-row">
                <span className="breakdown-label">Costo del producto:</span>
                <span className="breakdown-value">-${costPrice.toFixed(2)}</span>
              </div>
              
              <div className="breakdown-row total">
                <span className="breakdown-label">Beneficio neto por unidad:</span>
                <span className="breakdown-value">${netProfit.toFixed(2)}</span>
              </div>
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
            <div className={`metric ${marginClass}`}>
              <span className="metric-label">Punto Equilibrio:</span>
              <span className="metric-value">${breakEvenPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="breakdown-summary">
          <div className="summary-chart">
            <div className="chart-container">
              <div className="chart-bar cost-bar" style={{width: `${(costPrice / sellingPrice) * 100}%`}}>
                <span className="bar-label">Costo</span>
              </div>
              <div className="chart-bar amazon-bar" style={{width: `${(totalAmazonFees / sellingPrice) * 100}%`}}>
                <span className="bar-label">Amazon</span>
              </div>
              {applyIva && (
                <div className="chart-bar iva-bar" style={{width: `${(ivaAmount / sellingPrice) * 100}%`}}>
                  <span className="bar-label">IVA</span>
                </div>
              )}
              <div className="chart-bar profit-bar" style={{width: `${(netProfit / sellingPrice) * 100}%`}}>
                <span className="bar-label">Beneficio</span>
              </div>
            </div>
            <div className="chart-labels">
              <div className="chart-label">0%</div>
              <div className="chart-label">25%</div>
              <div className="chart-label">50%</div>
              <div className="chart-label">75%</div>
              <div className="chart-label">100%</div>
            </div>
          </div>
          
          <div className="summary-metrics">
            <div className="summary-metric">
              <div className="summary-value">${sellingPrice.toFixed(2)}</div>
              <div className="summary-label">Precio venta</div>
            </div>
            <div className="summary-metric">
              <div className="summary-value">-${totalAmazonFees.toFixed(2)}</div>
              <div className="summary-label">Costos Amazon</div>
            </div>
            <div className="summary-metric">
              <div className="summary-value">-${costPrice.toFixed(2)}</div>
              <div className="summary-label">Costo producto</div>
            </div>
            <div className="summary-metric">
              <div className={`summary-value ${marginClass}`}>${netProfit.toFixed(2)}</div>
              <div className="summary-label">Beneficio neto</div>
            </div>
            <div className="summary-metric">
              <div className={`summary-value ${marginClass}`}>{netMarginPercentage.toFixed(2)}%</div>
              <div className="summary-label">Margen neto</div>
            </div>
          </div>
        </div>
      )}
      
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