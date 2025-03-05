import React, { useState } from 'react';
import './App.css';
import Calculator from './components/Calculator';
import History from './components/History';
import Header from './components/Header';

function App() {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="app-container">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {activeTab === 'calculator' ? (
        <Calculator />
      ) : (
        <History />
      )}
    </div>
  );
}

export default App;