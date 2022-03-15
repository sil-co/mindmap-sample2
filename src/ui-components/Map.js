import React, {useEffect, useState, useRef, useCallback} from 'react';
import repository from '../repository';
import router from './router';
import Details from './Details';
// import css from './map.module.css';
import css from './map.module.scss';
import Toolbar from './Toolbar';
import TableView from './TableView';
import Chart from './Chart';
import MediaQuery from 'react-responsive';

// Hooks記法
const Map = (props) => {
  const DEFAULT_WIDTH = 400;
  const DEFAULT_HEIGHT = 200;

  const wrapper = useRef();
  const rootId = Number(router.getParams());

  const [list, setList] = useState(repository.getList({rootId}));
  const item = list[0];
  const [id, setId] = useState(item.id);
  const [name, setName] = useState(item.name);
  const [level, setLevel] = useState(item.level);
  const [comment, setComment] = useState(item.comment);
  const [zoom, setZoom] = useState(1);
  const [moveMode, setMoveMode] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  // const [hideItem, setHideItem] = useState(false);

  const onResize = () => {
    console.log('[Map] onResize is called');

    const width = wrapper.current.clientWidth;
    const height = wrapper.current.clientHeight;
    setWidth(width);
    setHeight(height);
    console.log(`[Map] onResize ${width}, ${height}`);
  };

  useEffect(() => {
    console.log('[Map] useEffect onResize Mounting');
    onResize();
    window.addEventListener('resize', onResize);

    // 戻り値を渡すことで、unMount(ページが移動したりして、死ぬ)時の処理を追加できる
    return () => {
      window.removeEventListener('resize', onResize);
      console.log('[Map] useEffect onResize unMounting');
    }
  }, [])

  const toggleMoveMode = () => {
    console.log('[Map] toggleMoveMode');
    setMoveMode(!moveMode);
  };

  const ZOOM_FACTOR = 1.1;

  const zoomOnWheel = (e) => {
    console.log('[Map] zoomOnWheel');
  }

  const zoomIn = () => {
    console.log('[Map] zoomIn');
    setZoom(zoom * ZOOM_FACTOR);
  };

  const zoomOut = () => {
    console.log('[Map] zoomOut');
    setZoom(zoom / ZOOM_FACTOR);
  };

  const changeName = (e) => {
    console.log('[Map] changeName');
    const name = e.target.value;
    const item = {id: id, name};
    repository.save(item);
    const list = repository.getList({rootId: rootId});
    setName(name);
    setList(list);
  }

  const setSelected = (id) => {
    console.log('[Map] setSelected');
    const item = repository.getItem(id);
    setId(item.id);
    setName(item.name);
    setLevel(item.level);
    setComment(item.comment);
  };

  const changeComment = (e) => {
    console.log('[Map] changeComment');
    const comment = e.target.value;
    const item = {id: id, comment};
    repository.save(item);
    setComment(comment);
  }

  const add = () => {
    console.log('[Map] add');
    const item = repository.save({
      name: 'New item',
      level: level + 1,
      rootId: rootId,
      parentId: id,
      comment: ''
    });
    const list = repository.getList({rootId: rootId});
    setId(item.id);
    setName(item.name);
    setLevel(item.level);
    setComment(item.comment);
    setList(list);
  }

  const deleteRepository = () => {
    console.log('[Map] deleteRepository');
    repository.delete(id);
    const list = repository.getList({rootId: rootId});
    if (!list.length) {
      router.setRoute('home');
      return;
    }
    const item = list[0];
    setId(item.id);
    setName(item.id);
    setLevel(item.level);
    setComment(item.comment);
    setList(list);
  };

  const actionList = [
    {name: 'add', onClick: () => add()},
    {name: 'delete', onClick: () => deleteRepository()}
  ];



  const onMouseDown = (e) => {
    console.log('[Map] onMouseDown');
    if (!moveMode) {
      return;
    }
    setIsDragging(true);
    setStartX(x * zoom + e.clientX);
    setStartY(y * zoom + e.clientY);
  };

  const onMouseUp = () => {
    console.log('[Map] onMouseUp');
    setIsDragging(false);
  };

  const onMouseMove = useCallback((e) => {
    console.log('[Map] onMouseMove');
    if (!isDragging) {
      return;
    }
    e.preventDefault();
    const x = (startX - e.clientX) * zoom;
    const y = (startY - e.clientY) * zoom;
    setX(x);
    setY(y);
  }, [isDragging, startX, startY, zoom]);

  const [view, setView] = useState('');

  const viewMenu = [
    { name: 'viewList', onClick: () => setView('table')},
    { name: 'hive', onClick: () => setView('chart')},
  ];

  let mapView;
  if (view === 'table') {
    mapView =
      <TableView
        id={id}
        onClick={setSelected}
        list={list}
      />
  } else {
    mapView =
      <Chart
        id={id}
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onWheel={zoomOnWheel}
        onToggleMoveMode={toggleMoveMode}
        x={x}
        y={y}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onClick={setSelected}
        list={list}
      />
    }

  return (
    <>
      <h1>Map</h1>
      <div className={css.container} ref={wrapper}>
        {mapView}
        <Toolbar
          type="alert"
          location={['right', 'bottom', 'vertical']}
          list={actionList}
        />
      </div>
      <Toolbar
        list={viewMenu}
        type="default"
        location={['vertical', 'left', 'bottom']}
      />
      <MediaQuery query="(min-width: 501px)">
        <Details id={id}
          level={level}
          name={name}
          onChangeName={changeName}
          onChangeComment={changeComment}
          comment={comment}
        />
      </MediaQuery>
    </>
  )
}

export default Map;


// class記法
// class Map extends React.Component {
//   DEFAULT_WIDTH = 400;
//   DEFAULT_HEIGHT = 200;

//   constructor(props) {
//     super(props);
//     this.wrapper = React.createRef();
//     const rootId = Number(router.getParams());
//     const list = repository.getList({rootId});
//     const item = list[0];
//     this.state = {
//       id: item.id,
//       name: item.name,
//       level: item.level,
//       comment: item.comment,
//       rootId,
//       list,
//       zoom: 1,
//       moveMode: false,
//       x: 0,
//       y: 0,
//       width: this.DEFAULT_WIDTH,
//       height: this.DEFAULT_HEIGHT,
//     }
//   }

//   onResize = () => {
//     const width = this.wrapper.current.clientWidth;
//     const height = this.wrapper.current.clientHeight;
//     this.setState({width, height});
//   };

//   // マウント(Mount)とはDOMツリーにDOMノードを追加すること。
//   // MountされたときcomponentDidMountが呼ばれる。
//   // この場合は最初に更新した際にthis.onResizeが呼ばれ、画面サイズをresizeした時にも呼ばれる
//   componentDidMount() {
//     this.onResize();
//     window.addEventListener('resize', this.onResize);
//   }

//   // アンマウント(Unmount)とはDOMツリーからDOMノードを削除すること。
//   componentWillUnmount() {
//     window.removeEventListener('resize', this.onResize);
//   }

//   toggleMoveMode = () => {
//     const moveMode = !this.state.moveMode;
//     this.setState({moveMode});
//   };

//   ZOOM_FACTOR = 1.1;

//   zoomIn = () => {
//     const zoom = this.state.zoom * this.ZOOM_FACTOR;
//     this.setState({zoom});
//   };

//   zoomOut = () => {
//     const zoom = this.state.zoom / this.ZOOM_FACTOR;
//     this.setState({zoom});
//   };

//   changeName = (e) => {
//     const name = e.target.value;
//     const item = {id: this.state.id, name};
//     repository.save(item);
//     const list = repository.getList({rootId: this.state.rootId});

//     this.setState({name, list});
//   }

//   setSelected = (id) => {
//     const item = repository.getItem(id);
//     this.setState({
//       id: item.id,
//       name: item.name,
//       level: item.level,
//       comment: item.comment,
//     })
//   };

//   changeComment = (e) => {
//     const comment = e.target.value;
//     const item = {id: this.state.id, comment};
//     repository.save(item);
//     this.setState({comment});
//   }

//   actionList = [
//     {name: 'add', onClick: () => this.add()},
//     {name: 'delete', onClick: () => this.delete()}
//   ]

//   add() {
//     const item = repository.save({
//       name: 'New item',
//       level: this.state.level + 1,
//       rootId: this.state.rootId,
//       parentId: this.state.id,
//       comment: ''
//     });
//     const list = repository.getList({rootId: this.state.rootId});
//     this.setState({
//       id: item.id,
//       name: item.name,
//       level: item.level,
//       comment: item.comment,
//       list
//     })
//   }

//   delete = () => {
//     repository.delete(this.state.id);
//     const list = repository.getList({
//       rootId: this.state.rootId
//     });
//     if (!list.length) {
//       router.setRoute('home');
//       return;
//     }
//     const item = list[0];
//     this.setState({
//       id: item.id,
//       name: item.id,
//       level: item.level,
//       comment: item.comment,
//       list
//     });
//   };

//   onMouseDown = (e) => {
//     if (!this.state.moveMode) {
//       return;
//     }
//     this.isDragging = true;
//     this.startX = this.state.x * this.state.zoom + e.clientX;
//     this.startY = this.state.y * this.state.zoom + e.clientY;
//   };

//   onMouseMove = (e) => {
//     if (!this.isDragging) {
//       return;
//     }
//     e.preventDefault();
//     const x = (this.startX - e.clientX) * this.state.zoom;
//     const y = (this.startY - e.clientY) * this.state.zoom;
//     this.setState({x, y});
//   };

//   onMouseUp = () => {
//     this.isDragging = false;
//   };

//   viewMenu = [
//     { name: 'viewList', onClick: () => this.setState({view: 'table'})},
//     { name: 'hive', onClick: () => this.setState({view: 'chart'})},
//   ];

//   render() {
//     let view;
//     if (this.state.view === 'table') {
//       view =  <TableView
//       id={this.state.id}
//       onClick={this.setSelected}
//       list={this.state.list}
//     />
//     } else {
//       view = <Chart
//       id={this.state.id}
//       zoom={this.state.zoom}
//       onZoomIn={this.zoomIn}
//       onZoomOut={this.zoomOut}
//       onToggleMoveMode={this.toggleMoveMode}
//       x={this.state.x}
//       y={this.state.y}
//       width={this.state.width}
//       height={this.state.height}
//       onMouseDown={this.onMouseDown}
//       onMouseMove={this.onMouseMove}
//       onMouseUp={this.onMouseUp}
//       onClick={this.setSelected}
//       list={this.state.list}
//     />
//     }
//     return (
//       <>
//         <h1>Map</h1>
//         <div className={css.container} ref={this.wrapper}>
//           {view}
//           <Toolbar
//             type="alert"
//             location={['right', 'bottom', 'vertical']}
//             list={this.actionList}
//           />
//         </div>
//         <Toolbar list={this.viewMenu} type="default" location={['vertical', 'left', 'bottom']} />
//         <Details id={this.state.id}
//           level={this.state.level}
//           name={this.state.name}
//           onChangeName={this.changeName}
//           onChangeComment={this.changeComment}
//           comment={this.state.comment} />

//       </>
//     );
//   }
// };

// export default Map;
