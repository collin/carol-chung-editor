import React, {useState, useEffect} from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Buttons from './components/Buttons';
import ShapeEditor from './components/ShapeEditor';

//id matters for delete
const defaultCircle = {
  type: 'circle',
  x: 250,
  y: 250,
  radius: 50,
  color: '#000000'
};
//id matters for delete
const defaultRectangle = {
  type: 'rectangle',
  x: 215,
  y: 225,
  width: 70,
  height: 50,
  color: '#000000'
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shapes: [],
      highlightedShapes: [],
      selectedShapes: []
    };
    this.myRef = React.createRef();
  }

  // EVENT HANDLERS
  clickButtonHandler = (ev) => {
    //TODO handle 4 cases
    //1 add circle, 2 add rect, 3 delete circle, 4 delete rect
    console.log('todo click button');
    console.log('label', ev.target.value)
    const {value} = ev.target;
    if (value === 'Add Circle') {
      let newCircle = {...defaultCircle, id: uuidv4()};
      this.setState((state, props) => {
        return {shapes: state.shapes.concat([newCircle])};
      }, () => {
        this.buildCanvas();
      })
    } else if (value === 'Add Rectangle') {
      let newRectangle = {...defaultRectangle, id: uuidv4()};
      this.setState((state, props) => {
        return {shapes: state.shapes.concat([newRectangle])};
      }, () => {
        this.buildCanvas();
      })
    }
  }

  //id matters for this one
  changeRangeHandler = (ev) => {

  }

  //id matters for this one
  changeColorHandler = (ev) => {

  }

  drawRectangle = (shape) => {
    let canvas = this.myRef.current;
    //const node = this.myRef.current;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      console.log('gets here');
      ctx.fillStyle = shape.color;
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      // drawing code here
    } else {
      // canvas-unsupported code here
      console.log('Browser does not support HTML Canvas. Sorry');
    }    
  }

  drawCircle = (shape) => {
    let canvas = this.myRef.current;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, (2 * Math.PI), 0);
      ctx.fillStyle = shape.color;
      ctx.fill();
      // drawing code here
    } else {
      // canvas-unsupported code here
    }    
  }

  buildCanvas = () => {
    this.state.shapes.forEach(shape => {
      if (shape.type === 'circle') {
        this.drawCircle(shape);
      } else if (shape.type === 'rectangle') {
        console.log('gets here build')
        this.drawRectangle(shape);
      }
    })
  }

  // const getShapesAr = () => {
  //   let shapesAr = [];
  //   Object.keys(shapes).forEach(k => {
  //     shapesAr.push(shapes[k]);
  //   });
  //   return shapesAr;
  // }

  // useEffect(() => {
  //   buildCanvas();
  // }, [shapes]);

  render() {
    return (
      <div>
        <main>
          <Buttons clickHandler={this.clickButtonHandler}></Buttons>
          <canvas width='500' height='500' id='shape-canvas' ref={this.myRef} />
          <ShapeEditor clickHandler={this.clickButtonHandler}></ShapeEditor>
        </main>
      </div>
    ); 
  } 
}

export default App;
