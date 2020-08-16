import React from 'react';
import '../App.css';

function Button(props) {
  const {clickHandler, label} = props;
  const value = props.value ? props.value : props.label;
  const classN = props.shapeId ? props.shapeId: '';

  return (
    <div className='button'>
      <button onClick={ev => clickHandler(ev)} value={value} className={classN}>{label}</button>
    </div>
  );
}

export default Button;
