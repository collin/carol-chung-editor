import React from 'react';
import Button from './Button';
import '../App.css';

function CircleEditor(props) {
  const {clickHandler} = props;
  return (
    <div className="circle-editor-container">
      <div className="row">
        <Button label="Delete" clickHandler={clickHandler} value="Delete Circle"/>
        <p>Circle</p>
      </div>
      <div className="row">
        <p>Center x:</p>
        <p>250</p>
      </div>
      <div className="row">
        <p>Center y:</p>
        <p>250</p>
      </div>
      <form>
        <div className="row">
          <label htmlFor="radius">Radius</label> 
          <input type="range" id="radius" name="radius" min="1" max="250" />
        </div>
        <div className="row">
          <label htmlFor="circle-color">Color</label>
          <input type="color" id="circle-color" name="circle-color" defaultValue="#000000" />
        </div>
      </form>
    </div>
  );
}

function RectangleEditor(props) {
  const {clickHandler} = props;
  return (
    <div className="rectangle-editor-container">
      <div className="row">
        <Button label="Delete" clickHandler={clickHandler} value="Delete Rectangle"/>
        <p>Rectangle</p>
      </div>
      <div className="row">
        <p>x position:</p>
        <p>215</p>
      </div>
      <div className="row">
        <p>y position:</p>
        <p>225</p>
      </div>
      <form>
        <div className="row">
          <label htmlFor="width">Width</label> 
          <input type="range" id="width" name="width" min="1" max="500" />
        </div>
        <div className="row">
          <label htmlFor="height">Height</label> 
          <input type="range" id="height" name="height" min="1" max="500" />
        </div>
        <div className="row">
          <label htmlFor="rect-color">Color</label>
          <input type="color" id="rect-color" name="rect-color" defaultValue="#000000" />
        </div>
      </form>
  </div>
  );
}

function ShapeEditor(props) {
  const {clickHandler} = props;
  return (
    <div className="editor-container">
      <CircleEditor clickHandler={clickHandler}/>
      <RectangleEditor clickHandler={clickHandler}/> 
    </div>
  );
}

export default ShapeEditor;
