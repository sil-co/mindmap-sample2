import React from 'react';
import IconButton from './IconButton';
import css from './toolbar.module.css';

const Toolbar = (props) => {

  let className = css.container;
  props.location.forEach(item => {
    className += ' ' + css[item];
  })

  return (
    <div className={className}>
      {props.list.map(item => (
        <div key={item.name} className={css.button}>
          <IconButton key={item.name} name={item.name} onClick={item.onClick} type={props.type} />
        </div>
      ))}
    </div>

  );
};

export default Toolbar;
