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
  color: '#044aad',
  hasHighlight: false,
  isSelected: false,
};
//id matters for delete
const defaultRectangle = {
  type: 'rectangle',
  x: 175,
  y: 215,
  width: 150,
  height: 70,
  color: '#ff9999',
  hasHighlight: false,
  isSelected: false,
}

const highlightColor = '#9ADAF6';
const highlightWidth = 10;
const selectColor = '#fdd870';
const selectWidth = 5;
const clearColor = '#ffffff';

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

  canvasClickHandler = (ev) => {
    console.log('todo canvas click')
    this.state.shapes.forEach(shape => {
      let curId = shape.id;
      if (shape.hasHighlight) {
        let newShapes = this.state.shapes.map(shape => {
          if (shape.id === curId) {
            shape.isSelected = true;
          }
          return shape;
        });
        this.setState({shapes: newShapes}, () => {
          this.buildCanvas();
        })
      }
    })
    //check if there is a hovered shape
      //if yes, remove highlight stroke and draw selected stroke
      //if no, check if anything is selected and deselect those chapes
  }

  canvasMouseMoveHandler = (ev) => {
    //TODO, check if the mouse is hovering over an existing shape
      //if yes, draw a highlight stroke around it
    //note that canvasX is actually clientX - 170px
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;

    this.state.shapes.forEach(shape => {
      const curId = shape.id;
      if (shape.type === 'rectangle') {
        if (this.isMouseOverRectangle(mouseX, mouseY, shape)) {
          let newShapes = this.state.shapes.map(shape => {
            if (shape.id === curId) {
              shape.hasHighlight = true;
            }
            return shape;
          });
          this.setState({shapes: newShapes}, () => {
            this.buildCanvas();
          })
        } else {
          let newShapes = this.state.shapes.map(shape => {
            if (shape.id === curId) {
              shape.hasHighlight = false;
            }
            return shape;
          });
          this.setState({shapes: newShapes}, () => {
            this.buildCanvas();
          })
        }
      } else if (shape.type === 'circle') {
        if (this.isMouseOverCircle(mouseX, mouseY, shape)) {
          let newShapes = this.state.shapes.map(shape => {
            if (shape.id === curId) {
              shape.hasHighlight = true;
            }
            return shape;
          });
          console.log('TODO add circle highlight')
          //TODO is update drawCircle with conditional highlight
          this.setState({shapes: newShapes}, () => {
            this.buildCanvas();
          })

        } else {
        //   //if there is highlight, remove that highlight or replace it with a white highlight
          console.log('TODO clear circle highlight')
          let newShapes = this.state.shapes.map(shape => {
            if (shape.id === curId) {
              shape.hasHighlight = false;
            }
            return shape;
          });
          console.log('TODO add circle highlight')
          //TODO is update drawCircle with conditional highlight
          this.setState({shapes: newShapes}, () => {
            this.buildCanvas();
          })


        }
      }
    })
  }

  //id matters for this one
  changeRangeHandler = (ev) => {

  }

  //id matters for this one
  changeColorHandler = (ev) => {

  }

  drawRectangle = (shape) => {
    const highlightWidth = 10;
    const selectWidth = 5;

    let canvas = this.myRef.current;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var rectangle = new Path2D();
      rectangle.rect(shape.x, shape.y, shape.width, shape.height);
      ctx.fillStyle = shape.color;
      ctx.fill(rectangle);
      if (shape.hasHighlight) {
        ctx.strokeStyle = highlightColor;
      } else {
        ctx.strokeStyle = clearColor;
      }
      ctx.lineWidth = highlightWidth;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      if (shape.isSelected) {
        ctx.strokeStyle = selectColor;
      } else {
        ctx.strokeStyle = clearColor;
      }
      ctx.lineWidth = 5;
      ctx.strokeRect(shape.x - highlightWidth + 2, shape.y - highlightWidth + 2, shape.width + highlightWidth + 5, shape.height + highlightWidth + 5);
    } else {
      // canvas-unsupported code here
      console.log('Browser does not support HTML Canvas. Sorry');
    }    
  }

  drawRectangleHighlight = (shape) => {

  }

  clearRectangleHighlight = (shape) => {
    
  }

  drawCircle = (shape) => {
    let canvas = this.myRef.current;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, (2 * Math.PI), 0);
      ctx.fillStyle = shape.color;
      ctx.fill();
      if (shape.hasHighlight) {
        console.log('gets here')
        ctx.strokeStyle = highlightColor;
      } else {
        ctx.strokeStyle = clearColor;
      }
      ctx.lineWidth = 10;
      ctx.stroke();
    } else {
      // canvas-unsupported code here
    }    
  }

  isMouseOverRectangle = (mouseX, mouseY, shape) => {
    const xCorrection = -170;
    mouseX += xCorrection;
    if (mouseX >= shape.x && mouseY >= shape.y && mouseX <= shape.x + shape.width && mouseY <= shape.y + shape.height) {
      return true;
    }
    return false;
  }

  isMouseOverCircle = (mouseX, mouseY, shape) => {
    const xCorrection = -170;
    mouseX += xCorrection;
    if (mouseX >= shape.x - shape.radius && mouseX <= shape.x + shape.radius && mouseY >= shape.y - shape.radius && mouseY <=shape.y + shape.radius) {
      return true;
    }
    return false;
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

  render() {
    return (
      <div>
        <main>
          <Buttons clickHandler={this.clickButtonHandler}></Buttons>
          <canvas width='500' height='500' id='shape-canvas' ref={this.myRef} 
            onMouseMove={this.canvasMouseMoveHandler} onClick={this.canvasClickHandler} />
          <ShapeEditor clickHandler={this.clickButtonHandler}></ShapeEditor>
        </main>
      </div>
    ); 
  } 
}

export default App;
