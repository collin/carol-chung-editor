import React, {useState, useEffect} from 'react';
import './App.css';
import Buttons from './components/Buttons';
import ShapeEditor from './components/ShapeEditor';

//id matters for delete
const defaultCircle = {
  type: 'circle',
  x: 250,
  y: 250,
  radius: 25,
  color: '#000000'
};
//id matters for delete
const defaultRectangle = {
  type: 'rectangle',
  x: 250,
  y: 250,
  width: 75,
  height: 50,
  color: '#000000'
}

function App() {
  const [shapes, setShapes] = useState({});
  const [highlightedShapes, setHighlightedShapes] = useState([]);
  const [selectedShapes, setSelectedShapes] = useState([]);
  const [latestShapeId, setLatestShapeId] = useState(1);

  // EVENT HANDLERS
  const clickButtonHandler = (ev) => {
    //TODO handle 4 cases
    //1 add circle, 2 add rect, 3 delete circle, 4 delete rect
    console.log('todo click button');
    console.log('label', ev.target.value)
  }

  //id matters for this one
  const changeRangeHandler = (ev) => {

  }

  //id matters for this one
  const changeColorHandler = (ev) => {

  }

  const buildCanvas = () => {

  }

  const getShapesAr = () => {
    let shapesAr = [];
    Object.keys(shapes).forEach(k => {
      shapesAr.push(shapes[k]);
    });
    return shapesAr;
  }

  useEffect(() => {
    buildCanvas();
  }, getShapesAr());

  return (
    <div>
      <main>
        <Buttons clickHandler={clickButtonHandler}></Buttons>
        <canvas width='500' height='500' id='shape-canvas'/>
        <ShapeEditor clickHandler={clickButtonHandler}></ShapeEditor>
      </main>
    </div>
  );
}

export default App;
