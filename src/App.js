import React, {useState} from 'react';
import './App.css';
import Buttons from './components/Buttons';
import ShapeEditor from './components/ShapeEditor';

function App() {
  return (
    <div>
      <main>
        <Buttons></Buttons>
        <canvas width='500' height='500' />
        <ShapeEditor></ShapeEditor>
      </main>
    </div>
  );
}

export default App;
