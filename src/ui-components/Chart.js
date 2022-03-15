import React from 'react';
import css from './chart.module.css';
import ChartElement from './ChartElement';
import Connection from './Connection';
import Toolbar from './Toolbar';

const Chart = (props) => {

  const WIDTH = props.width / props.zoom;
  const HEIGHT = props.height / props.zoom;
  console.log('WIDTH', WIDTH, 'HEIGHT', HEIGHT);
  const R = 90;

  const getChildren = (list, parent, elements, dPhi) => {
    // console.log('[Chart] getChildren');
    const children = list.filter(item => item.parentId === parent.id);
    for (let i = 0; i < children.length; i++) {
      let item = children[i];
      let phi = i * dPhi / children.length + parent.phi;
      const isLeftSide = (phi > Math.PI / 2) && (phi < 3 * Math.PI / 2);
      const element = {
        id: item.id,
        name: item.name,
        level: item.level,
        x: parent.x + R * Math.cos(phi),
        y: parent.y + R * Math.sin(phi),
        phi,
        px: parent.x,
        py: parent.y,
        isLeftSide
      };
      elements.push(element);
      getChildren(list, element, elements, dPhi / children.length);
    }
  };

  const setElements = (list) => {
    console.log('[chart] setElements', list);
    // 例 list: [{…}, {…}, {…}, {…}, {…}, {…}]
    // 0: {name: 'Bright Idea!', level: 0, parentId: null, id: 1, rootId: 1}
    // 1: {
          // comment: ""
          // id: 3
          // level: 1
          // name: "New item"
          // parentId: 2
          // rootId: 2 }
    const elements = [];
    const x0 = WIDTH / 2;
    const y0 = HEIGHT / 2;
    console.log('x0', x0, 'y0', y0);
    const root = list.find(item => item.level === 0);
    // 例 root: {name: 'Bright Idea!', level: 0, parentId: null, id: 1, rootId: 1}
    const rootElement = {
      id: root.id, // 例 id: 1
      name: root.name, // 例 name: 'Bright Idia'
      level: root.level, // 例 level: 0
      x: x0,
      y: y0,
      phi: 0
    };
    console.log('rootElement: ', rootElement);
    elements.push(rootElement);
    console.log('elements: ', elements);
    // Math.PIは円周率 3.1415...
    getChildren(list, rootElement, elements, 2*Math.PI);
    return elements;
  };

  const zoomMenu = [
    { name: 'zoomIn', onClick: props.onZoomIn },
    { name: 'zoomOut', onClick: props.onZoomOut },
    { name: 'panTool', onClick: props.onToggleMoveMode },
  ];

  const elements = setElements(props.list);

  return (
    <div className={css.container}>
      <Toolbar list={zoomMenu} type="default" location={['horisontal', 'right', 'top']} />

      <svg viewBox={`${props.x} ${props.y} ${WIDTH} ${HEIGHT}`}
        onMouseMove={(e) => props.onMouseMove(e)}
        onMouseDown={(e) => props.onMouseDown(e)}
        onMouseUp={(e) => props.onMouseUp(e)}
        onWheel={(e) => props.onWheel(e)}
      >
        <Connection list={elements} />
        {
          elements.map(element =>
            (
              <ChartElement
                key={element.id}
                onClick={props.onClick}
                id={element.id}
                phi={element.phi}
                level={element.level}
                x={element.x} y={element.y}
                isSelected={element.id === props.id}
                px={element.px} py={element.py}
                name={element.name} />
            ))
        }
      </svg>
    </div>
  );
};

export default Chart;
