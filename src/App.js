import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';
import Buttons from './components/Buttons';
import ShapeEditor from './components/ShapeEditor';

const defaultCircle = {
  type: 'circle',
  x: 250,
  y: 250,
  radius: 50,
  color: '#044aad',
  hasHighlight: false,
  isSelected: false,
};

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
      shapesObj: {},
      lastShapeOrder: 1,
      isMouseDown: false,
      isShiftPressed: false,
    };
    this.myRef = React.createRef();
  }

  // EVENT HANDLERS
  clickButtonHandler = (ev) => {
    const {value} = ev.target;
    let newId = uuidv4();
    if (value === 'Add Circle') {
      //order property is used to draw shapes in order they were added in case of overlap
      let newCircle = {...defaultCircle, id: newId, order: this.state.lastShapeOrder};
      this.setState((state, props) => {
        return { shapesObj: {...state.shapesObj, [newId]: newCircle},
                  lastShapeOrder: state.lastShapeOrder + 1};
      }, () => {
        this.buildCanvas();
      })
    } else if (value === 'Add Rectangle') {
      let newRectangle = {...defaultRectangle, id: newId, order: this.state.lastShapeOrder};
      this.setState((state, props) => {
        return {shapesObj: {...state.shapesObj, [newId]: newRectangle},
                lastShapeOrder: state.lastShapeOrder + 1};
      }, () => {
        this.buildCanvas();
      })
    } else if (value === 'Delete') {
      let id = ev.target.className;
      let newShapesObj = {};
      Object.keys(this.state.shapesObj).forEach(k => {
        if (k !== id) newShapesObj[k] = this.state.shapesObj[k];
      })
      this.setState({shapesObj: newShapesObj}, () => this.buildCanvas());
    } else {
      console.log('Click event which is not handled')
    }
  }

  canvasMouseMoveHandler = (ev) => {
    //note that canvasX is actually clientX - 170px
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;
    const movementX = ev.movementX;
    const movementY = ev.movementY;
    let orderedShapesAr = this.getOrderedShapesAr();
    let reverseOrderedShapesAr = this.getReverseOrderedShapesAr();
    let newShapesObj = {...this.state.shapesObj};

    reverseOrderedShapesAr.forEach(shape => {
      const curId = shape.id;
      const xCorrection = -170;
      if (shape.type === 'rectangle') {
        if (this.isMouseOverRectangle(mouseX, mouseY, shape) ) {
          newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: true}};
          if (this.state.isMouseDown) {
            newShapesObj = {...newShapesObj, 
              [curId]: {...newShapesObj[curId], 
                x: newShapesObj[curId]['x'] + movementX,
                y: newShapesObj[curId]['y'] + movementY
              }
            };
          }
        } else {
          if (shape.hasHighlight) {
            newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: false}};
          }
          if (shape.isSelected && this.state.isMouseDown) {
            newShapesObj = {...newShapesObj, 
              [curId]: {...newShapesObj[curId], 
                x: newShapesObj[curId]['x'] + movementX,
                y: newShapesObj[curId]['y'] + movementY
              }
            };
          }
        } 
      } else if (shape.type === 'circle') {
        if (this.isMouseOverCircle(mouseX, mouseY, shape) ) {
          newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: true}};
          if (this.state.isMouseDown) {
            newShapesObj = {...newShapesObj, 
              [curId]: {...newShapesObj[curId], 
                x: newShapesObj[curId]['x'] + movementX,
                y: newShapesObj[curId]['y'] + movementY
              }
            };
          }
        } else {
          if ( shape.hasHighlight) {
            newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: false}};
          }
          if (shape.isSelected && this.state.isMouseDown) {
            newShapesObj = {...newShapesObj, 
              [curId]: {...newShapesObj[curId], 
                x: newShapesObj[curId]['x'] + movementX,
                y: newShapesObj[curId]['y'] + movementY
              }
            };
          }
        } 
      }
    })
    this.setState({shapesObj: newShapesObj}, () => {
      this.buildCanvas();
    });
  }

  mouseDownHandler = (ev) => {
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;
    let newShapes = {...this.state.shapesObj};
    let selectedShapes = this.getSelectedShapesAr();

    //deselect objects
    if (!this.state.isShiftPressed && selectedShapes.length && this.clickedOutsideAllShapes(mouseX, mouseY, selectedShapes)) {
      selectedShapes.forEach(shape => {
        let curId = shape.id;
        newShapes = {...newShapes, [curId]: {...newShapes[curId], isSelected: false}}
      })
    } 
    //select objects
    let shapesAr = this.getOrderedShapesAr();
    shapesAr.forEach(shape => {
      let curId = shape.id;
      if (shape.hasHighlight || (this.state.isShiftPressed && ( this.isMouseOverCircle(mouseX, mouseY, shape) || this.isMouseOverRectangle(mouseX, mouseY, shape)))) {
        newShapes = {...newShapes, [curId]: {...newShapes[curId], isSelected: true}}
      }
    })
    if (!this.state.isMouseDown) {
      this.setState({shapesObj: newShapes, isMouseDown: true}, () => {
        this.buildCanvas();
      });
    } else {
      this.setState({shapesObj: newShapes}, () => {
       this.buildCanvas();
      })  
    }
  }

  mouseUpHandler = (ev) => {
    if (this.state.isMouseDown) {
      this.setState({isMouseDown: false});
    }
  }

  //think in order to deselect one shape, should define another key handler like Ctrl pressed 
  //and click selected shape should result in deselect
  keyDownHandler = (ev) => {
    let key = ev.key;
    if (key === 'Shift') {
      this.setState({isShiftPressed: true});
    }
  }

  keyUpHandler = (ev) => {
    let key = ev.key;
    if (key === 'Shift') {
      this.setState({isShiftPressed: false});
    }
  }

  //id matters for this one
  changeRangeHandler = (ev) => {
    let {value, name} = ev.target;
    let id = ev.target.className;
    this.setState((state, props) => {
      return {
        shapesObj: {...state.shapesObj,
          [id]: {...state.shapesObj[id],
            [name]: parseInt(value, 10)
          }
        }
      }
    },
    () => this.buildCanvas())
  }

  //id matters for this one
  changeColorHandler = (ev) => {
    let {value, name} = ev.target;
    let id = ev.target.className;
    this.setState((state, props) => {
      return {
        shapesObj: {...state.shapesObj,
          [id]: {...state.shapesObj[id],
            [name]: value
          }
        }
      }
    },
    () => this.buildCanvas())
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
      //draw highlight
      if (shape.hasHighlight) {
        ctx.strokeStyle = highlightColor;
      } else {
        ctx.strokeStyle = clearColor;
      }
      ctx.lineWidth = highlightWidth;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      //draw select border
      if (shape.isSelected) {
        ctx.strokeStyle = selectColor;
      } else {
        ctx.strokeStyle = clearColor;
      }
      ctx.lineWidth = 5;
      let selectWidth = shape.width + highlightWidth + 5;
      let selectHeight = shape.height + highlightWidth + 5;
      ctx.strokeRect(shape.x - highlightWidth + 2, shape.y - highlightWidth + 2, selectWidth, selectHeight);
    } else {
      // canvas-unsupported code here
      console.log('Browser does not support HTML Canvas. Sorry');
    }    
  }

  drawCircle = (shape) => {
    const highlightWidth = 10;
    let canvas = this.myRef.current;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      var ctx2 = canvas.getContext('2d');
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, (2 * Math.PI), 0);
      ctx.fillStyle = shape.color;
      ctx.fill();
      if (shape.hasHighlight) {
        ctx.strokeStyle = highlightColor;
        ctx.lineWidth = highlightWidth;
        ctx.stroke();
      }
      //draw select border
      ctx2.beginPath();
      if (shape.isSelected) {
        ctx2.strokeStyle = selectColor;
        ctx2.arc(shape.x, shape.y, shape.radius + highlightWidth, 0, (2 * Math.PI), 0);
        ctx2.lineWidth = 5;
        ctx2.stroke();
      }
    } else {
      // canvas-unsupported code here
      console.log('')
    }    
  }

  buildCanvas = () => {
    let orderedShapesAr = this.getOrderedShapesAr();
    let canvas = this.myRef.current;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 500, 500);

      orderedShapesAr.forEach(shape => {
        if (shape.type === 'circle') {
          this.drawCircle(shape);
        } else if (shape.type === 'rectangle') {
          this.drawRectangle(shape);
        }
      })
    } else {
      console.log('Browser does not support HTML Canvas.');
    }
  }

  //HELPERS
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

  getOrderedShapesAr = () => {
    let shapesAr = Object.keys(this.state.shapesObj).map(k => this.state.shapesObj[k]);
    //sort shapesAr by order; source from mdn array.sort
    shapesAr.sort(function(a, b) {
      var orderA = a.order;
      var orderB = b.order;
      if (orderA < orderB) {
        return -1;
      }
      if (orderA > orderB) {
        return 1;
      }
      return 0;
    });
    return shapesAr;
  }

  getReverseOrderedShapesAr = () => {
    let shapesAr = Object.keys(this.state.shapesObj).map(k => this.state.shapesObj[k]);
    //sort shapesAr by reverse order; source from mdn array.sort
    shapesAr.sort(function(a, b) {
      var orderA = a.order;
      var orderB = b.order;
      if (orderA > orderB) {
        return -1;
      }
      if (orderA < orderB) {
        return 1;
      }
      return 0;
    });
    return shapesAr;
  }

  getSelectedShapesAr = () => {
    let selectedShapesAr = [];
    Object.keys(this.state.shapesObj).forEach(k => {
      if (this.state.shapesObj[k].isSelected) {
        selectedShapesAr.push(this.state.shapesObj[k]);
      }
    })
    return selectedShapesAr;
  }

  clickedOutsideAllShapes = (x, y, selectedShapesAr) => {
    for (let i = 0; i < selectedShapesAr.length; i++) {
      if (selectedShapesAr[i].type === 'rectangle') {
        if (this.isMouseOverRectangle(x, y, selectedShapesAr[i])) {
          return false;
        }
      } else if (selectedShapesAr[i].type === 'circle') {
        if (this.isMouseOverCircle(x, y, selectedShapesAr[i])) {
          return false;
        }
      }
    }
    return true;
  }

  render() {
    let orderedShapesAr = this.getOrderedShapesAr();
    const selectedShapes = orderedShapesAr.filter(shape => shape.isSelected === true);
    //tabIndex was required to trigger key press event recognition
    return (
      <div tabIndex="-1" onKeyDown={this.keyDownHandler} onKeyUp={this.keyUpHandler} className='body-container'>
        <main>
          <Buttons clickHandler={this.clickButtonHandler}></Buttons>
          <canvas width='500' height='500' id='shape-canvas' ref={this.myRef} 
            onMouseMove={this.canvasMouseMoveHandler}
            onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} 
          />
          <ShapeEditor clickHandler={this.clickButtonHandler} selectedShapes={selectedShapes} 
            changeRangeHandler={this.changeRangeHandler} changeColorHandler={this.changeColorHandler}/>
        </main>
      </div>
    ); 
  } 
}

export default App;
