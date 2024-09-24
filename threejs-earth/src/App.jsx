import React from 'react';
import './App.css';
import EarthVisualization from './index.js';

function App() {
  return (
    <div className="App">
      <EarthVisualization />
      <img src={require('./textures/00_earthmap1k.jpg')} alt="" />
      
    </div>
  );
}

export default App;
