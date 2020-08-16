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

  //canvasClickHandler = (ev) => {
    // this.state.shapes.forEach(shape => {
    //   let curId = shape.id;
    //   if (shape.hasHighlight) {
    //     let newShapes = this.state.shapes.map(shape => {
    //       if (shape.id === curId) {
    //         shape.isSelected = true;
    //       }
    //       return shape;
    //     });
    //     this.setState({shapes: newShapes}, () => {
    //       this.buildCanvas();
    //     })
    //   } else {
    //     let newShapes = this.state.shapes.map(shape => {
    //       if (shape.id === curId) {
    //         shape.isSelected = false;
    //       }
    //       return shape;
    //     });
    //     this.setState({shapes: newShapes}, () => {
    //       this.buildCanvas();
    //     })
    //   }
    // })
    //check if there is a hovered shape
      //if yes, remove highlight stroke and draw selected stroke
      //if no, check if anything is selected and deselect those chapes
  //}

  canvasMouseMoveHandler = (ev) => {
    //TODO, check if the mouse is hovering over an existing shape
      //if yes, draw a highlight stroke around it
    //note that canvasX is actually clientX - 170px
    const mouseX = ev.clientX;
    const mouseY = ev.clientY;
    const movementX = ev.movementX;
    const movementY = ev.movementY;
    console.log('ev', ev)
    console.log('movementx', ev.movementX)
    console.log('movementy', ev.movementY)

      this.state.shapes.forEach(shape => {
        const curId = shape.id;
        const xCorrection = -170;
        if (shape.type === 'rectangle') {
          if (this.isMouseOverRectangle(mouseX, mouseY, shape)) {
            let newShapes = this.state.shapes.map(shape => {
              if (shape.id === curId) {
                shape.hasHighlight = true;
              }
              if (this.state.isMouseDown) {
                console.log('gets here')
                shape.x += movementX;
                shape.y += movementY;
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
              if (this.state.isMouseDown) {
                console.log('gets here')
                shape.x += movementX;
                shape.y += movementY;
              }
              return shape;
            });
            this.setState({shapes: newShapes}, () => {
              this.buildCanvas();
            })
  
          } else {
          //   //if there is highlight, remove that highlight or replace it with a white highlight
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
        }
      })

  }

  mouseDownHandler = (ev) => {
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
      } else {
        let newShapes = this.state.shapes.map(shape => {
          if (shape.id === curId) {
            shape.isSelected = false;
          }
          return shape;
        });
        this.setState({shapes: newShapes}, () => {
          this.buildCanvas();
        })
      }
    })

    if (!this.state.isMouseDown) {
      this.setState({isMouseDown: true});
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
    let canvas = this.myRef.current;
    if (canvas.getContext) {
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, 500, 500);

      this.state.shapes.forEach(shape => {
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

  render() {
    const selectedShapes = this.state.shapes.filter(shape => shape.isSelected === true);
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
