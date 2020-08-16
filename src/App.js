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
      shapesObj: {},
      //highlightedShapes: [],
      //selectedShapes: [],
      lastShapeOrder: 1,
      isMouseDown: false,
    };
    this.myRef = React.createRef();
  }

  // EVENT HANDLERS
  clickButtonHandler = (ev) => {
    //TODO handle 4 cases
    //1 add circle, 2 add rect, 3 delete circle, 4 delete rect
    const {value} = ev.target;
    let id = uuidv4();
    if (value === 'Add Circle') {
      let newCircle = {...defaultCircle, id, order: this.state.lastShapeOrder};
      this.setState((state, props) => {
        return { shapesObj: {...state.ShapesObj, [id]: newCircle},
                  lastShapeOrder: state.lastShapeOrder + 1};
      }, () => {
        this.buildCanvas();
        console.log('this.state', this.state)
      })
    } else if (value === 'Add Rectangle') {
      let newRectangle = {...defaultRectangle, id, order: this.state.lastShapeOrder};
      this.setState((state, props) => {
        return {shapesObj: {...state.ShapesObj, [id]: newRectangle},
                lastShapeOrder: state.lastShapeOrder + 1};
      }, () => {
        this.buildCanvas();
        console.log('this.state', this.state)
      })
    }
  }

  //TO REFACTOR for shapesObj
  canvasMouseMoveHandler = (ev) => {
    //TODO, check if the mouse is hovering over an existing shape
      //if yes, draw a highlight stroke around it
    //note that canvasX is actually clientX - 170px
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;
    const movementX = ev.movementX;
    const movementY = ev.movementY;
    let orderedShapesAr = this.getOrderedShapesAr();
    let newShapesObj = {...this.state.shapesObj};

    orderedShapesAr.forEach(shape => {
      const curId = shape.id;
      const xCorrection = -170;
      if (shape.type === 'rectangle') {
        if (this.isMouseOverRectangle(mouseX, mouseY, shape)) {
          //set shape.hasHighlight = true
          newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: true}};

          if (this.state.isMouseDown) {
            newShapesObj = {...newShapesObj, 
              [curId]: {...newShapesObj[curId], 
                x: newShapesObj[curId]['x'] + movementX,
                y: newShapesObj[curId]['y'] + movementY
              }
            };
          }
          // let newShapes = this.state.shapes.map(shape => {
          //   // if (shape.id === curId) {
          //   //   shape.hasHighlight = true;
          //   // }
          //   //this is issue, want it only for single shape but it is getting applied to all shapes
          //   // if (this.state.isMouseDown) {
          //   //   console.log('gets here')
          //   //   shape.x += movementX;
          //   //   shape.y += movementY;
          //   // }
          //   return shape;
          // });
          // this.setState({shapes: newShapes}, () => {
          //   this.buildCanvas();
          // })
        } else {
          newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: false}};
          // let newShapes = this.state.shapes.map(shape => {
          //   if (shape.id === curId) {
          //     shape.hasHighlight = false;
          //   }
          //   return shape;
          // });
          // this.setState({shapes: newShapes}, () => {
          //   this.buildCanvas();
          // })
        }
      } else if (shape.type === 'circle') {
        if (this.isMouseOverCircle(mouseX, mouseY, shape)) {
          //set highlight true
          newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: true}};
          //move shape
          if (this.state.isMouseDown) {
            newShapesObj = {...newShapesObj, 
              [curId]: {...newShapesObj[curId], 
                x: newShapesObj[curId]['x'] + movementX,
                y: newShapesObj[curId]['y'] + movementY
              }
            };
          }
          // let newShapes = this.state.shapes.map(shape => {
          //   if (shape.id === curId) {
          //     shape.hasHighlight = true;
          //   }
          //   //this is issue, want it only for single shape but it is getting applied to all shapes
          //   if (this.state.isMouseDown) {
          //     console.log('gets here')
          //     shape.x += movementX;
          //     shape.y += movementY;
          //   }
          //   return shape;
          // });
          // this.setState({shapes: newShapes}, () => {
          //   this.buildCanvas();
          // })

        } else {
          //set highlight false
          newShapesObj = {...newShapesObj, [curId]: {...newShapesObj[curId], hasHighlight: false}};
        //   //if there is highlight, remove that highlight or replace it with a white highlight
          // let newShapes = this.state.shapes.map(shape => {
          //   if (shape.id === curId) {
          //     shape.hasHighlight = false;
          //   }
          //   return shape;
          // });
          // this.setState({shapes: newShapes}, () => {
          //   this.buildCanvas();
          // })
        }
      }
    })
    this.setState({shapesObj: newShapesObj});
  }

  //TO REFACTOR for shapesObj
  mouseDownHandler = (ev) => {
    let orderedShapesAr = this.getOrderedShapesAr();
    let newShapes = {...this.state.shapesObj};
    orderedShapesAr.forEach(shape => {
      let curId = shape.id;
      if (shape.hasHighlight) {
        newShapes = {...newShapes, [curId]: {...newShapes[curId], isSelected: true}}
        // let newShapes = this.state.shapes.map(shape => {
        //   if (shape.id === curId) {
        //     shape.isSelected = true;
        //   }
        //   return shape;
        // });
        // this.setState({shapes: newShapes}, () => {
        //   this.buildCanvas();
        // })
      } else {
        newShapes = {...newShapes, [curId]: {...newShapes[curId], isSelected: false}}
        // let newShapes = this.state.shapes.map(shape => {
        //   if (shape.id === curId) {
        //     shape.isSelected = false;
        //   }
        //   return shape;
        // });
        // this.setState({shapes: newShapes}, () => {
        //   this.buildCanvas();
        // })
      }
    })
    if (!this.state.isMouseDown) {
      this.setState({shapes: newShapes, isMouseDown: true}, () => {
        this.buildCanvas();
      });
    } else {
      this.setState({shapes: newShapes}, () => {
        this.buildCanvas();
      })  
    }
  }

  mouseUpHandler = (ev) => {
    if (this.state.isMouseDown) {
      this.setState({isMouseDown: false});
    }
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
        ctx.lineWidth = 5;
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
      } else {
        ctx.strokeStyle = clearColor;
      }
      ctx.lineWidth = highlightWidth;
      ctx.stroke();

      ctx2.beginPath();
      if (shape.isSelected) {
        ctx2.strokeStyle = selectColor;
        ctx2.arc(shape.x, shape.y, shape.radius + highlightWidth, 0, (2 * Math.PI), 0);
      } else {
        ctx2.strokeStyle = clearColor;
        ctx2.arc(shape.x, shape.y, shape.radius + highlightWidth, 0, (2 * Math.PI), 0);
      }
      ctx2.lineWidth = 5;
      ctx2.stroke();

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

  getOrderedShapesAr = () => {
    console.log('this.state', this.state)
    let shapesAr = Object.keys(this.state.shapesObj).map(k => this.state.shapesObj[k]);
    //sort shapesAr by order
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

  render() {
    let orderedShapesAr = this.getOrderedShapesAr();
    const selectedShapes = orderedShapesAr.filter(shape => shape.isSelected === true);
    return (
      <div>
        <main>
          <Buttons clickHandler={this.clickButtonHandler}></Buttons>
          <canvas width='500' height='500' id='shape-canvas' ref={this.myRef} 
            onMouseMove={this.canvasMouseMoveHandler}
            onMouseDown={this.mouseDownHandler} onMouseUp={this.mouseUpHandler} />
          <ShapeEditor clickHandler={this.clickButtonHandler} selectedShapes={selectedShapes}></ShapeEditor>
        </main>
      </div>
    ); 
  } 
}

export default App;
