import React, { useState } from 'react';
import './MarginBreakdown.css';

function MarginBreakdown({ sellingPrice, costPrice, amazonCosts, applyIva, historicalMinPrice }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Verificar que tenemos todos los datos necesarios
  if (!sellingPrice || !costPrice || !amazonCosts) {
    return null;
  }
  
  const ivaRate = applyIva ? 0.16 : 0;
  
  // Cálculos para el precio actual
  const priceAfterIva = sellingPrice / (1 + ivaRate);
  const totalFees = amazonCosts.total;
  const netRevenue = priceAfterIva - totalFees;
  const profit = netRevenue - costPrice;
  const profitMargin = (profit / sellingPrice) * 100;
  
  // Cálculos para el precio mínimo histórico (si está disponible)
  let minPriceAfterIva = 0;
  let minNetRevenue = 0;
  let minProfit = 0;
  let minProfitMargin = 0;
  
  if (historicalMinPrice && historicalMinPrice > 0) {
    minPriceAfterIva = historicalMinPrice / (1 + ivaRate);
    minNetRevenue = minPriceAfterIva - totalFees;
    minProfit = minNetRevenue - costPrice;
    minProfitMargin = (minProfit / historicalMinPrice) * 100;
  }
  
  // Función para determinar la clase CSS basada en el valor
  const getValueClass = (value) => {
    if (value > 20) return "high-value";
    if (value > 10) return "good-value";
    if (value > 0) return "medium-value";
    return "negative-value";
  };
  
  // Formatear número como moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Formatear número como porcentaje
  const formatPercent = (value) => {
    return value.toFixed(2) + '%';
  };
  
  return (
    <div className="margin-breakdown-container">
      <div className="margin-summary">
        <h4 className="margin-title">
          Desglose de Márgenes
          <button 
            className="toggle-details-btn"
            onClick={() => setShowDetails(!showDetails)}
            title={showDetails ? "Ocultar detalles" : "Mostrar detalles"}
          >
            {showDetails ? "▲" : "▼"}
          </button>
        </h4>
        
        {/* Vista resumida */}
        <div className="margin-summary-grid">
          <div className="margin-summary-item">
            <span className="margin-label">Beneficio neto por unidad:</span>
            <div className={`margin-value ${getValueClass(profit)}`}>
              {formatCurrency(profit)}
            </div>
          </div>
          <div className="margin-summary-item">
            <span className="margin-label">Margen neto:</span>
            <div className={`margin-value ${getValueClass(profitMargin)}`}>
              {formatPercent(profitMargin)}
            </div>
          </div>
        </div>
        
        {/* Sección de precio mínimo histórico (siempre visible) */}
        {historicalMinPrice && historicalMinPrice > 0 && (
          <div className="historical-price-section">
            <h4 className="historical-price-title">
              Escenario con Precio Mínimo Histórico ({formatCurrency(historicalMinPrice)})
            </h4>
            <div className="margin-summary-grid">
              <div className="margin-summary-item">
                <span className="margin-label">Beneficio neto por unidad:</span>
                <div className={`margin-value ${getValueClass(minProfit)}`}>
                  {formatCurrency(minProfit)}
                </div>
              </div>
              <div className="margin-summary-item">
                <span className="margin-label">Margen neto:</span>
                <div className={`margin-value ${getValueClass(minProfitMargin)}`}>
                  {formatPercent(minProfitMargin)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Vista detallada (expandible) */}
        {showDetails && (
          <div className="margin-details">
            <div className="margin-details-section">
              <h4 className="details-section-title">Desglose Real de Márgenes (Precio Actual)</h4>
              <table className="margin-details-table">
                <tbody>
                  <tr>
                    <td>Precio de venta</td>
                    <td className="text-right">{formatCurrency(sellingPrice)}</td>
                    <td className="text-right">100.00%</td>
                  </tr>
                  {applyIva && (
                    <tr>
                      <td>IVA (16%)</td>
                      <td className="text-right">-{formatCurrency(sellingPrice - priceAfterIva)}</td>
                      <td className="text-right">-{formatPercent((sellingPrice - priceAfterIva) / sellingPrice * 100)}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Precio sin IVA</td>
                    <td className="text-right">{formatCurrency(priceAfterIva)}</td>
                    <td className="text-right">{formatPercent(priceAfterIva / sellingPrice * 100)}</td>
                  </tr>
                  <tr>
                    <td>Comisión de referencia</td>
                    <td className="text-right">-{formatCurrency(amazonCosts.referralFee)}</td>
                    <td className="text-right">-{formatPercent(amazonCosts.referralFee / sellingPrice * 100)}</td>
                  </tr>
                  <tr>
                    <td>Tarifa de cumplimiento</td>
                    <td className="text-right">-{formatCurrency(amazonCosts.fulfillmentFee)}</td>
                    <td className="text-right">-{formatPercent(amazonCosts.fulfillmentFee / sellingPrice * 100)}</td>
                  </tr>
                  <tr>
                    <td>Tarifa de almacenamiento</td>
                    <td className="text-right">-{formatCurrency(amazonCosts.storageFee)}</td>
                    <td className="text-right">-{formatPercent(amazonCosts.storageFee / sellingPrice * 100)}</td>
                  </tr>
                  <tr>
                    <td>Otras tarifas</td>
                    <td className="text-right">-{formatCurrency(amazonCosts.otherFees)}</td>
                    <td className="text-right">-{formatPercent(amazonCosts.otherFees / sellingPrice * 100)}</td>
                  </tr>
                  <tr className="subtotal-row">
                    <td>Ingreso neto después de tarifas</td>
                    <td className="text-right">{formatCurrency(netRevenue)}</td>
                    <td className="text-right">{formatPercent(netRevenue / sellingPrice * 100)}</td>
                  </tr>
                  <tr>
                    <td>Costo de adquisición</td>
                    <td className="text-right">-{formatCurrency(costPrice)}</td>
                    <td className="text-right">-{formatPercent(costPrice / sellingPrice * 100)}</td>
                  </tr>
                  <tr className="profit-row">
                    <td>Beneficio neto por unidad</td>
                    <td className={`text-right ${profit < 0 ? 'negative-amount' : ''}`}>
                      {formatCurrency(profit)}
                    </td>
                    <td className={`text-right ${profitMargin < 0 ? 'negative-amount' : ''}`}>
                      {formatPercent(profitMargin)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Desglose con precio mínimo histórico */}
            {historicalMinPrice && historicalMinPrice > 0 && (
              <div className="margin-details-section historical-margin-details">
                <h4 className="details-section-title">Desglose Real de Márgenes (Precio Mínimo Histórico)</h4>
                <table className="margin-details-table">
                  <tbody>
                    <tr>
                      <td>Precio de venta (mínimo)</td>
                      <td className="text-right">{formatCurrency(historicalMinPrice)}</td>
                      <td className="text-right">100.00%</td>
                    </tr>
                    {applyIva && (
                      <tr>
                        <td>IVA (16%)</td>
                        <td className="text-right">-{formatCurrency(historicalMinPrice - minPriceAfterIva)}</td>
                        <td className="text-right">-{formatPercent((historicalMinPrice - minPriceAfterIva) / historicalMinPrice * 100)}</td>
                      </tr>
                    )}
                    <tr>
                      <td>Precio sin IVA</td>
                      <td className="text-right">{formatCurrency(minPriceAfterIva)}</td>
                      <td className="text-right">{formatPercent(minPriceAfterIva / historicalMinPrice * 100)}</td>
                    </tr>
                    <tr>
                      <td>Comisión de referencia</td>
                      <td className="text-right">-{formatCurrency(amazonCosts.referralFee)}</td>
                      <td className="text-right">-{formatPercent(amazonCosts.referralFee / historicalMinPrice * 100)}</td>
                    </tr>
                    <tr>
                      <td>Tarifa de cumplimiento</td>
                      <td className="text-right">-{formatCurrency(amazonCosts.fulfillmentFee)}</td>
                      <td className="text-right">-{formatPercent(amazonCosts.fulfillmentFee / historicalMinPrice * 100)}</td>
                    </tr>
                    <tr>
                      <td>Tarifa de almacenamiento</td>
                      <td className="text-right">-{formatCurrency(amazonCosts.storageFee)}</td>
                      <td className="text-right">-{formatPercent(amazonCosts.storageFee / historicalMinPrice * 100)}</td>
                    </tr>
                    <tr>
                      <td>Otras tarifas</td>
                      <td className="text-right">-{formatCurrency(amazonCosts.otherFees)}</td>
                      <td className="text-right">-{formatPercent(amazonCosts.otherFees / historicalMinPrice * 100)}</td>
                    </tr>
                    <tr className="subtotal-row">
                      <td>Ingreso neto después de tarifas</td>
                      <td className="text-right">{formatCurrency(minNetRevenue)}</td>
                      <td className="text-right">{formatPercent(minNetRevenue / historicalMinPrice * 100)}</td>
                    </tr>
                    <tr>
                      <td>Costo de adquisición</td>
                      <td className="text-right">-{formatCurrency(costPrice)}</td>
                      <td className="text-right">-{formatPercent(costPrice / historicalMinPrice * 100)}</td>
                    </tr>
                    <tr className="profit-row">
                      <td>Beneficio neto por unidad</td>
                      <td className={`text-right ${minProfit < 0 ? 'negative-amount' : ''}`}>
                        {formatCurrency(minProfit)}
                      </td>
                      <td className={`text-right ${minProfitMargin < 0 ? 'negative-amount' : ''}`}>
                        {formatPercent(minProfitMargin)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Comparativa entre precio actual y mínimo histórico */}
            {historicalMinPrice && historicalMinPrice > 0 && (
              <div className="margin-details-section comparison-section">
                <h4 className="details-section-title">Comparativa entre Precio Actual y Mínimo Histórico</h4>
                <table className="margin-details-table">
                  <thead>
                    <tr>
                      <th>Métrica</th>
                      <th className="text-right">Precio Actual</th>
                      <th className="text-right">Precio Mínimo</th>
                      <th className="text-right">Diferencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Precio de venta</td>
                      <td className="text-right">{formatCurrency(sellingPrice)}</td>
                      <td className="text-right">{formatCurrency(historicalMinPrice)}</td>
                      <td className="text-right">{formatCurrency(sellingPrice - historicalMinPrice)}</td>
                    </tr>
                    <tr>
                      <td>Ingreso neto tras tarifas</td>
                      <td className="text-right">{formatCurrency(netRevenue)}</td>
                      <td className="text-right">{formatCurrency(minNetRevenue)}</td>
                      <td className="text-right">{formatCurrency(netRevenue - minNetRevenue)}</td>
                    </tr>
                    <tr className="profit-row">
                      <td>Beneficio neto por unidad</td>
                      <td className="text-right">{formatCurrency(profit)}</td>
                      <td className="text-right">{formatCurrency(minProfit)}</td>
                      <td className={`text-right ${profit - minProfit < 0 ? 'negative-amount' : ''}`}>
                        {formatCurrency(profit - minProfit)}
                      </td>
                    </tr>
                    <tr>
                      <td>Margen neto</td>
                      <td className="text-right">{formatPercent(profitMargin)}</td>
                      <td className="text-right">{formatPercent(minProfitMargin)}</td>
                      <td className={`text-right ${profitMargin - minProfitMargin < 0 ? 'negative-amount' : ''}`}>
                        {formatPercent(profitMargin - minProfitMargin)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MarginBreakdown;