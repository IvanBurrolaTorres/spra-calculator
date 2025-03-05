import React from 'react';

function Header({ activeTab, setActiveTab }) {
  return (
    <header className="app-header">
      <h1 className="app-title">CALCULADORA SPRA: SISTEMA DE PUNTUACIÓN DE RENTABILIDAD PARA AMAZON</h1>
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
    </header>
  );
}

export default Header;