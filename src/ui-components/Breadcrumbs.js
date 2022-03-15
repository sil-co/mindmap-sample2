import React from 'react';
// import css from './breadcrumbs.module.css';
import css from './breadcrumbs.module.scss';
import router from './router';

const Breadcrumbs = (props) => {
  return (
    <div className={css.container}>
      {
        props.list.map(item => (
          <span key={item}>
            <span
              onClick={() => router.setRoute(item)}
              className={css.item}>{item}</span>
          </span>
        ))
      }
    </div>
  );
};

export default Breadcrumbs;
