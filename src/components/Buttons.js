import React from 'react';
import Button from './Button';
import '../App.css';

function Buttons(props) {
  const {clickHandler} = props;
  return (
    <div className="button-container">
      <Button label='Add Circle' clickHandler={clickHandler} />
      <Button label='Add Rectangle' clickHandler={clickHandler} />
    </div>
  );
}

export default Buttons;
