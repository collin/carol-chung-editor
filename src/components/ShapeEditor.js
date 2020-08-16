import React from 'react';
import Button from './Button';
import '../App.css';

function CircleEditor(props) {
  const {clickHandler, shape} = props;
  return (
    <div className="circle-editor-container">
      <div className="row">
        <Button label="Delete" clickHandler={clickHandler} value="Delete Circle"/>
        <p>Circle</p>
      </div>
      <div className="row">
        <p>Center x</p>
        <p>{shape.x}</p>
      </div>
      <div className="row">
        <p>Center y</p>
        <p>{shape.y}</p>
      </div>
      <form>
        <div className="row">
          <label htmlFor="radius">Radius</label> 
          <input type="range" id="radius" name="radius" min="1" max="250" value={shape.radius} className={shape.id}/>
        </div>
        <div className="row">
          <label htmlFor="color">Color</label>
          <input type="color" id="circle-color" name="color" value={shape.color} className={shape.id}/>
        </div>
      </form>
    </div>
  );
}

function RectangleEditor(props) {
  const {clickHandler, shape, changeRangeHandler, changeColorHandler} = props;
  return (
    <div className="rectangle-editor-container">
      <div className="row">
        <Button label="Delete" clickHandler={clickHandler} value="Delete Rectangle"/>
        <p>Rectangle</p>
      </div>
      <div className="row">
        <p>x position</p>
        <p>{shape.x}</p>
      </div>
      <div className="row">
        <p>y position:</p>
        <p>{shape.y}</p>
      </div>
      <form>
        <div className="row">
          <label htmlFor="width">Width</label> 
          <input type="range" id="width" name="width" min="1" max="500" value={shape.width} className={shape.id}
            onChange={ev => changeRangeHandler(ev)}/>
        </div>
        <div className="row">
          <label htmlFor="height">Height</label> 
          <input type="range" id="height" name="height" min="1" max="500" value={shape.height} className={shape.id} 
            onChange={ev => changeRangeHandler(ev)}/>
        </div>
        <div className="row">
          <label htmlFor="color">Color</label>
          <input type="color" id="rect-color" name="color" value={shape.color} className={shape.id}
            onChange={ev => changeColorHandler(ev)}/>
        </div>
      </form>
  </div>
  );
}

function ShapeEditor(props) {
  const {clickHandler, selectedShapes, changeRangeHandler, changeColorHandler} = props;
  return (
    <div className="editor-container">
      {selectedShapes.map(shape => {
        if (shape.type === 'rectangle') {
          return (
            <RectangleEditor shape={shape} changeRangeHandler={changeRangeHandler} changeColorHandler={changeColorHandler}/>
          )    
        } else {
          return (
            <CircleEditor shape={shape} changeRangeHandler={changeRangeHandler} changeColorHandler={changeColorHandler}/>
          )
        }
      })}
    </div>
  );
}

export default ShapeEditor;
