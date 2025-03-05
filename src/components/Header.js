import React from 'react';

function Header({ activeTab, setActiveTab, calculatorMode, setCalculatorMode }) {
  return (
    <header className="app-header">
      <h1 className="app-title">CALCULADORA SPRA: SISTEMA DE PUNTUACIÓN DE RENTABILIDAD PARA AMAZON</h1>
      
      <div className="header-controls">
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveTab('calculator')}
          >
            Calculadora
          </button>
          <button 
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Archivos
          </button>
        </div>
        
        {activeTab === 'calculator' && (
          <div className="mode-toggle">
            <span className="mode-label">Modo:</span>
            <div className="toggle-container">
              <button 
                className={`mode-button ${calculatorMode === 'basic' ? 'active' : ''}`}
                onClick={() => setCalculatorMode('basic')}
              >
                SPRA Básico
              </button>
              <button 
                className={`mode-button ${calculatorMode === 'plus' ? 'active' : ''}`}
                onClick={() => setCalculatorMode('plus')}
              >
                SPRA+
              </button>
            </div>
          </div>
        )}
      </div>
      
      {activeTab === 'calculator' && calculatorMode === 'plus' && (
        <div className="mode-description">
          <span className="badge plus-badge">PLUS</span>
          <p>Modo avanzado con análisis de margen y estabilidad de precios (130 puntos máximos)</p>
        </div>
      )}
    </header>
  );
}

export default Header;