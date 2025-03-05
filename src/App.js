import React, { useState, useEffect } from 'react';
import './App.css';
import Calculator from './components/Calculator';
import History from './components/History';
import Header from './components/Header';
import { initializeSavedData } from './utils/initializeSavedData';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');
  const [calculatorMode, setCalculatorMode] = useState('basic'); // 'basic' o 'plus'

  // Inicializar datos guardados al cargar la aplicación
  useEffect(() => {
    initializeSavedData();
  }, []);

  return (
    <div className="app-container">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        calculatorMode={calculatorMode}
        setCalculatorMode={setCalculatorMode}
      />
      
      {activeTab === 'calculator' ? (
        <Calculator mode={calculatorMode} />
      ) : (
        <History />
      )}
    </div>
  );
}

export default App;