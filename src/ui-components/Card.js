import React from 'react';
import css from './card.module.css';

const Card = (props) => {

  let className = css.container;
  if (props.isSelected) {
    className += ' ' + css.selected;
  }

  return (
    <div className={className}
      onClick={props.onClick}>
      <div className={css.card}>
        <div className={css.title}>{props.name}</div>
        <div className={css.comment}>{props.comment}</div>
      </div>
    </div>
  );
};

export default Card;
