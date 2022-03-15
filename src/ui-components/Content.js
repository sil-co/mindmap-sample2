import React from 'react';
import css from './content.module.css';

const Content = (props) => {
  console.log('[Content : ]',props);

  return (
    <div className={css.container}>
      {props.component}
    </div>
  );
};

export default Content;
