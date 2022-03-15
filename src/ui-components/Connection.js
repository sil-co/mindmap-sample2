import React from 'react';
import css from './connection.module.css';

const Connection = (props) => {
  console.log('[Connection]: ', props);
  const getElement = (element) => {
    if (element.level === 0) {
      return null;
    }
    const DX = element.isLeftSide ? -40 : 40;
    const dx = element.x - element.px;
    const dy = element.y - element.py;
    const d = `M ${element.px} ${element.py} c ${DX} 0, ${dx-DX} ${dy}, ${dx} ${dy}`;
    // console.log(d);
    return (
      <path d={d} className={css.connection} key={element.id} />
    )
  }
  return (

    props.list.map(element => getElement(element))
// {list: Array(6)}
  // list: Array(6)
    // 0: {id: 2, name: 'New Map', level: 0, x: 200, y: 100, …}
    // 1: {
      // id: 3
      // isLeftSide: false
      // level: 1
      // name: "New item"
      // phi: 0
      // px: 200
      // py: 100
      // x: 290
      // y: 100
    // }
    // 2: {id: 9, name: 'New item', level: 1, x: 227.81152949374527, y: 185.59508646656383, …}
    // 3: {id: 10, name: 'New item', level: 1, x: 127.18847050625475, y: 152.9006727063226, …}
    // 4: {id: 11, name: 'New item', level: 1, x: 127.18847050625473, y: 47.099327293677426, …}
    // 5: {id: 12, name: 'New item', level: 1, x: 227.81152949374524, y: 14.404913533436172, …}

  );
};

export default Connection;
